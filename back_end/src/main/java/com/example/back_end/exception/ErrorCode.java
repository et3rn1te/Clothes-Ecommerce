package com.example.back_end.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least 8 characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "User not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    SESSION_EXPIRED(1013, "Your session has expired. Please log in again.", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INACTIVE_ACC(1009,"Your account had been clock", HttpStatus.LOCKED),
    PRODUCT_NOT_FOUND(109, "Can not find the product", HttpStatus.NOT_FOUND),
    CATEGORY_EXIST(1010, "Can not find the category", HttpStatus.CONFLICT),
    CATEGORY_NOT_FOUND(1011, "Can not find the category", HttpStatus.NOT_FOUND),
    IMAGE_NOT_FOUND(1012, "Can not find the image", HttpStatus.NOT_FOUND),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
