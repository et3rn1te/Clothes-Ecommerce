package com.example.back_end.mapper;

import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.UserDto;
import com.example.back_end.entity.User;
import com.example.back_end.entity.Role;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = {Collectors.class})
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "active", constant = "false")
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserCreationRequest request);

    @Mapping(target = "imageUrl", source = "imageUrl")
    UserDto toDto(User user);

    List<UserDto> toDtoList(List<User> users);

    default String rolesToString(Set<Role> roles) {
        if (roles == null || roles.isEmpty()) {
            return null;
        }
        return roles.stream()
                .map(Role::getName)
                .collect(Collectors.joining(","));
    }
}
