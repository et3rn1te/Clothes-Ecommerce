package com.example.back_end.service.user;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.UserMapper;
import com.example.back_end.repository.RoleRepository;
import com.example.back_end.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.request.user.ChangePasswordRequest;
import com.example.back_end.dto.request.user.UpdateUserProfileRequest;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public User createRequest(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name(PredefinedRole.USER_ROLE)
                                .description("User role")
                                .build()
                ));
        user.setRoles(new HashSet<>(List.of(role)));

        return userRepository.save(user);
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws Exception {
        String token = request.getToken();
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        
        boolean valid = signedJWT.verify(verifier) 
                && signedJWT.getJWTClaimsSet().getExpirationTime().after(new Date());
        
        return IntrospectResponse.builder()
                .valid(valid)
                .build();
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public PageResponse<UserResponse> getUsers(Pageable pageable) {
        log.info("Fetching users with pagination");
        Page<User> userPage = userRepository.findAll(pageable);
        List<UserResponse> userDtos = userMapper.toResponseList(userPage.getContent());
        
        return PageResponse.<UserResponse>builder()
                .content(userDtos)
                .pageNo(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    @Override
    public AuthenticationResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    @Override
    public List<UserResponse> getConvertedUsers(List<User> users) {
        return userMapper.toResponseList(users);
    }

    private String generateToken(User user) {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("CDWED.com")
                .issueTime(new Date())
                .expirationTime(Date.from(
                        Instant.now().plus(1, ChronoUnit.HOURS)
                ))
                .claim("scope", buildScope(user))
                .build();

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWSObject jws = new JWSObject(header, new Payload(claims.toJSONObject()));

        try {
            jws.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jws.serialize();
        } catch (JOSEException e) {
            log.error("Token signing error", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> joiner.add(role.getName()));
        }
        return joiner.toString();
    }

    @Override
    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateUserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra xem số điện thoại mới có bị trùng không
        if (!user.getPhone().equals(request.getPhone()) &&
            userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Số điện thoại đã được sử dụng");
        }

        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    public ApiResponse<Void> changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.<Void>builder()
                .code(0)
                .message("Đổi mật khẩu thành công")
                .build();
    }

    @Override
    public UserResponse updateAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        try {
            // Upload ảnh lên Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "user_avatars",
                    "resource_type", "image"
                )
            );

            // Xóa ảnh cũ nếu có
            if (user.getImageUrl() != null) {
                String publicId = user.getImageUrl().split("/")[user.getImageUrl().split("/").length - 1].split("\\.")[0];
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }

            // Cập nhật URL ảnh mới
            user.setImageUrl((String) uploadResult.get("secure_url"));
            User updatedUser = userRepository.save(user);
            return userMapper.toResponse(updatedUser);

        } catch (IOException e) {
            log.error("Failed to upload avatar", e);
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }
}
