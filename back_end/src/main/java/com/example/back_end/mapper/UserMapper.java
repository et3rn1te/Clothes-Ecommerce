package com.example.back_end.mapper;

import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.entity.User;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = Collectors.class)
public interface UserMapper {

    // CREATE
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
//    @Mapping(target = "active", constant = "false")
    @Mapping(target = "active", source = "active")// cái này t sửa để kích hoạt tài khoản cho dễ
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserCreationRequest request);

    // DTO RESPONSE

    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);
}
