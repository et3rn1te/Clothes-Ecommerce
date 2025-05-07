package com.example.back_end.dto;

import com.example.back_end.entity.Image;
import lombok.Data;

@Data
public class UserDto {
    private String username;
    private String password;
    private String fullname;
    private String email;
    private String phone;
    private Boolean active = false;
    private ImageDto avatar;
}
