package com.example.back_end.dto;

import com.example.back_end.entity.Image;
import lombok.Data;

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
    private ImageDto avatar;
}
