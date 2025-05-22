package com.example.back_end.controller;

import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.LoginRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.service.AuthService;
import com.example.back_end.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody LoginRequest request) {
        AuthenticationResponse response = authService.login(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(0)
                .message("Login successful")
                .result(response)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        try {
            IntrospectResponse response = authService.introspect(request);
            return ApiResponse.<IntrospectResponse>builder()
                    .code(0)
                    .message("Token introspection successful")
                    .result(response)
                    .build();
        } catch (Exception e) {
            log.error("Token introspection failed", e);
            return ApiResponse.<IntrospectResponse>builder()
                    .code(1)
                    .message("Token introspection failed: " + e.getMessage())
                    .build();
        }
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody IntrospectRequest request) {
        try {
            authService.logout(request);
            return ApiResponse.<Void>builder()
                    .code(0)
                    .message("Logout successful")
                    .build();
        } catch (Exception e) {
            log.error("Logout failed", e);
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("Logout failed: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/verifyEmail")
    public ApiResponse<Void> verifyEmail(
            @RequestParam("token") String token,
            HttpServletResponse response) {
        try {
            IntrospectRequest request = new IntrospectRequest(token);
            IntrospectResponse result = authService.introspect(request);
            
            if (result.isValid() && result.getEmail() != null) {
                // Tạo user mới với email đã xác thực
                UserCreationRequest userRequest = new UserCreationRequest(
                    "", // username sẽ được set sau
                    "", // password sẽ được set sau
                    "", // fullname sẽ được set sau
                    result.getEmail(),
                    "" // phone sẽ được set sau
                );
                
                userService.createRequest(userRequest);
                response.sendRedirect("http://localhost:5173/auth/register?email=" + result.getEmail());
                
                return ApiResponse.<Void>builder()
                        .code(0)
                        .message("Email verification successful")
                        .build();
            } else {
                log.warn("Invalid email verification token");
                return ApiResponse.<Void>builder()
                        .code(1)
                        .message("Invalid verification token")
                        .build();
            }
        } catch (Exception e) {
            log.error("Email verification failed", e);
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("Email verification failed: " + e.getMessage())
                    .build();
        }
    }
}
