package com.example.back_end.controller;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.image.IImageService;
import com.example.back_end.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final UserService userService;
    private final IImageService imageService;

    @PostMapping("/createUser")
    public ResponseEntity<ApiResponse<UserDto>> createUser(
            @RequestBody @Valid UserCreationRequest request) {
        UserDto dto = userService.convertToDto(
                userService.createRequest(request)
        );
        return ResponseEntity.ok(
                ApiResponse.<UserDto>builder()
                        .code(0)
                        .message("User created successfully")
                        .data(dto)
                        .build()
        );
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> list = userService.getConvertedUsers(
                userService.getUsers()
        );
        return ResponseEntity.ok(
                ApiResponse.<List<UserDto>>builder()
                        .code(0)
                        .message("User list retrieved successfully")
                        .data(list)
                        .build()
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(
            @PathVariable Long userId) {
        UserDto dto = userService.convertToDto(
                userService.getUserById(userId)
        );
        return ResponseEntity.ok(
                ApiResponse.<UserDto>builder()
                        .code(0)
                        .message("User retrieved successfully")
                        .data(dto)
                        .build()
        );
    }

    @PostMapping("/user/avatar/upload")
    public ResponseEntity<ApiResponse<ImageDto>> uploadAvatar(
            @RequestParam MultipartFile file,
            @RequestParam Long userId) {
        ImageDto imageDto = imageService.saveUserAvatar(file, userId);
        return ResponseEntity.ok(
                ApiResponse.<ImageDto>builder()
                        .code(0)
                        .message("Avatar uploaded successfully")
                        .data(imageDto)
                        .build()
        );
    }

    @GetMapping("/user/avatar/{userId}")
    public ResponseEntity<ApiResponse<ImageDto>> getUserAvatar(
            @PathVariable Long userId) {
        ImageDto imageDto = imageService.getUserAvatar(userId);
        return ResponseEntity.ok(
                ApiResponse.<ImageDto>builder()
                        .code(0)
                        .message("User avatar retrieved successfully")
                        .data(imageDto)
                        .build()
        );
    }

//    @GetMapping("/me")
//    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
//        String username = SecurityContextHolder.getContext()
//                .getAuthentication().getName();
//        UserDto dto = userService.convertToDto(
//                userService.getUserByUsername(username)
//        );
//        return ResponseEntity.ok(
//                ApiResponse.<UserDto>builder()
//                        .code(0)
//                        .message("Current user retrieved successfully")
//                        .data(dto)
//                        .build()
//        );
//    }
    @PostMapping("/existUser")
    ApiResponse<Boolean> existUser(@RequestParam ("email") String email) {
        boolean rs = true;
        if (userRepository.findByEmail(email).isEmpty()) {
            rs = false;
        }
        return ApiResponse.<Boolean>builder().result(rs).build();
    }
}
