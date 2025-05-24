package com.example.back_end.service;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.UserDto;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.UserCreationRequest;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.UserMapper;
import com.example.back_end.repository.RoleRepository;
import com.example.back_end.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import com.example.back_end.dto.response.PageResponse;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

public interface UserService {
    User createRequest(UserCreationRequest request);

    IntrospectResponse introspect(IntrospectRequest request) throws Exception;

    PageResponse<UserDto> getUsers(Pageable pageable);

    User getUserById(Long id);

    AuthenticationResponse login(String email, String password);

    List<UserDto> getConvertedUsers(List<User> users);
}
