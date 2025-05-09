package com.example.back_end.dto.request;

import com.example.back_end.entity.Image;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor

public class UserCreationRequest {
    private String username;
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    private String fullname;
    private String email;
    private String phone;
    private Boolean active = false;
}
