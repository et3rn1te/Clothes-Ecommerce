package com.example.back_end.controller;

import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.request.user.ChangePasswordRequest;
import com.example.back_end.dto.request.user.UpdateUserProfileRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.User;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import com.example.back_end.dto.response.PageResponse;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final IUserService userService;

    @PostMapping("/createUser")
    public ResponseEntity<ApiResponse<UserDto>> createUser(
            @RequestBody @Valid UserCreationRequest request) {
        try {
            User user = userService.createRequest(request);
            List<UserDto> dtos = userService.getConvertedUsers(List.of(user));
            UserDto dto = dtos.get(0);
            
            return ResponseEntity.ok(
                    ApiResponse.<UserDto>builder()
                            .code(0)
                            .message("User created successfully")
                            .data(dto)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to create user", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserDto>builder()
                            .code(1)
                            .message("Failed to create user: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method to get all Users with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of User DTOs
     */
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<PageResponse<UserDto>>> getAllUsers(Pageable pageable) {
        try {
            PageResponse<UserDto> userPage = userService.getUsers(pageable);
            
            return ResponseEntity.ok(
                    ApiResponse.<PageResponse<UserDto>>builder()
                            .code(0)
                            .message("User list retrieved successfully")
                            .data(userPage)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to retrieve users", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<PageResponse<UserDto>>builder()
                            .code(1)
                            .message("Failed to retrieve users: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(
            @PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            List<UserDto> dtos = userService.getConvertedUsers(List.of(user));
            UserDto dto = dtos.get(0);
            
            return ResponseEntity.ok(
                    ApiResponse.<UserDto>builder()
                            .code(0)
                            .message("User retrieved successfully")
                            .data(dto)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to retrieve user with id: " + userId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserDto>builder()
                            .code(1)
                            .message("Failed to retrieve user: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        try {
            UserDto userDto = userService.getCurrentUser();
            return ResponseEntity.ok(
                    ApiResponse.<UserDto>builder()
                            .code(0)
                            .message("Lấy thông tin người dùng thành công")
                            .data(userDto)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to get current user", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserDto>builder()
                            .code(1)
                            .message("Không thể lấy thông tin người dùng: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @RequestBody @Valid UpdateUserProfileRequest request) {
        try {
            UserDto currentUser = userService.getCurrentUser();
            UserDto updatedUser = userService.updateProfile(currentUser.getId(), request);
            return ResponseEntity.ok(
                    ApiResponse.<UserDto>builder()
                            .code(0)
                            .message("Cập nhật thông tin thành công")
                            .data(updatedUser)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to update profile", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserDto>builder()
                            .code(1)
                            .message("Không thể cập nhật thông tin: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody @Valid ChangePasswordRequest request) {
        try {
            UserDto currentUser = userService.getCurrentUser();
            ApiResponse<Void> response = userService.changePassword(currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to change password", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Void>builder()
                            .code(1)
                            .message("Không thể đổi mật khẩu: " + e.getMessage())
                            .build());
        }
    }

    @PutMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserDto>> updateAvatar(
            @RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra định dạng file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<UserDto>builder()
                                .code(1)
                                .message("File không phải là hình ảnh")
                                .build());
            }

            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<UserDto>builder()
                                .code(1)
                                .message("Kích thước file quá lớn (tối đa 5MB)")
                                .build());
            }

            UserDto currentUser = userService.getCurrentUser();
            UserDto updatedUser = userService.updateAvatar(currentUser.getId(), file);
            return ResponseEntity.ok(
                    ApiResponse.<UserDto>builder()
                            .code(0)
                            .message("Cập nhật ảnh đại diện thành công")
                            .data(updatedUser)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to update avatar", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserDto>builder()
                            .code(1)
                            .message("Không thể cập nhật ảnh đại diện: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/existUser")
    ApiResponse<Boolean> existUser(@RequestParam ("email") String email) {
        boolean rs = true;
        if (userRepository.findByEmail(email).isEmpty()) {
            rs = false;
        }
        return ApiResponse.<Boolean>builder().result(rs).build();
    }
}
