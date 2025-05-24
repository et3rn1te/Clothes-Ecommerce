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
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}", HttpStatus.BAD_REQUEST),
    INACTIVE_ACC(1009,"Your account had been clock", HttpStatus.LOCKED),
    PRODUCT_NOT_FOUND(1010, "Can not find the product", HttpStatus.NOT_FOUND),
    CATEGORY_EXIST(1011, "Category already exists", HttpStatus.CONFLICT),
    CATEGORY_NOT_FOUND(1012, "Can not find the category", HttpStatus.NOT_FOUND),
    IMAGE_NOT_FOUND(1013, "Can not find the image", HttpStatus.NOT_FOUND),
    BRAND_NOT_FOUND(1014, "Can not find the brand", HttpStatus.NOT_FOUND),
    GENDER_NOT_FOUND(1015, "Can not find the gender", HttpStatus.NOT_FOUND),
    PRODUCT_NAME_EXISTS(1016, "Product name already exists for this brand", HttpStatus.CONFLICT),
    CLOUDINARY_ERROR(1017, "Error occurred while processing image on Cloudinary", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_IMAGE_FORMAT(1018, "Invalid image format. Supported formats: JPG, PNG, GIF", HttpStatus.BAD_REQUEST),
    IMAGE_SIZE_TOO_LARGE(1019, "Image size is too large. Maximum size: 5MB", HttpStatus.BAD_REQUEST),
    COLOR_NOT_FOUND(1020, "Can not find the color", HttpStatus.NOT_FOUND),
    SIZE_NOT_FOUND(1021, "Can not find the size", HttpStatus.NOT_FOUND),
    VARIANT_NOT_FOUND(1022, "Can not find the product variant", HttpStatus.NOT_FOUND),
    VARIANT_EXISTS(1023, "Product variant with this color and size already exists", HttpStatus.CONFLICT),
    CATEGORY_NAME_EXISTS(1024, "Category name already exists", HttpStatus.CONFLICT),
    OPERATION_NOT_SUPPORTED(1025, "This operation is not supported", HttpStatus.METHOD_NOT_ALLOWED),
    PRODUCT_SLUG_EXISTS(1026, "Product slug already exists", HttpStatus.CONFLICT),
    CATEGORY_SLUG_EXISTS(1027, "Category slug already exists", HttpStatus.CONFLICT);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
