package com.example.back_end.dto.response;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.UserDto;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthenticationResponse {
    String token;
    boolean authenticated;
    UserDto currentUser;
}
