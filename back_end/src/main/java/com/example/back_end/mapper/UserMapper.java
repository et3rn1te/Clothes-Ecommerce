package com.example.back_end.mapper;

import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = Collectors.class)
public interface UserMapper {

    // CREATE
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "active", constant = "false")
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserCreationRequest request);

    // DTO RESPONSE
    @Mapping(target = "imageUrl", source = "imageUrl")
    UserDto toDto(User user);

    List<UserDto> toDtoList(List<User> users);
}
