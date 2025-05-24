package com.example.back_end.service.user;

import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.User;
import org.springframework.data.domain.Pageable;
import com.example.back_end.dto.response.PageResponse;

import java.util.*;

public interface IUserService {
    User createRequest(UserCreationRequest request);

    IntrospectResponse introspect(IntrospectRequest request) throws Exception;

    PageResponse<UserDto> getUsers(Pageable pageable);

    User getUserById(Long id);

    AuthenticationResponse login(String email, String password);

    List<UserDto> getConvertedUsers(List<User> users);
}
