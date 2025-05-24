package com.example.back_end.controller;

import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.User;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
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
