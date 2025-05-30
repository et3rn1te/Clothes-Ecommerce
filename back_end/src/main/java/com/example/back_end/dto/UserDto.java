package com.example.back_end.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private String phone;
    private Boolean active = false;
    private String imageUrl;
}
