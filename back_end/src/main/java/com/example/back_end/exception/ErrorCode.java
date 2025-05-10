package com.example.back_end.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

/**
 * Error codes for e-commerce clothing system
 * Error code format: XYYY where:
 * X: Category (1=General, 2=Auth, 3=User, 4=Product, 5=Order, 6=Payment, 7=Inventory, 8=Shipping)
 * YYY: Specific error code within category
 */
@AllArgsConstructor
@Getter
public enum ErrorCode {
    // General errors (1000-1099)
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    VALIDATION_ERROR(1001, "Validation error", HttpStatus.BAD_REQUEST),
    RESOURCE_NOT_FOUND(1002, "Resource not found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(1003, "Invalid request", HttpStatus.BAD_REQUEST),
    INVALID_FILE_FORMAT(1004, "Invalid file format", HttpStatus.BAD_REQUEST),
    RATE_LIMIT_EXCEEDED(1006, "Rate limit exceeded", HttpStatus.TOO_MANY_REQUESTS),
    DATABASE_ERROR(1007, "Database operation failed", HttpStatus.INTERNAL_SERVER_ERROR),
    EXTERNAL_SERVICE_ERROR(1008, "External service error", HttpStatus.SERVICE_UNAVAILABLE),
    MAINTENANCE_MODE(1009, "System is under maintenance", HttpStatus.SERVICE_UNAVAILABLE),

    // Authentication & Authorization errors (2000-2099)
    UNAUTHENTICATED(2000, "Authentication required", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2001, "You do not have permission to perform this action", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(2002, "Invalid username or password", HttpStatus.UNAUTHORIZED),
    EXPIRED_TOKEN(2003, "Authentication token has expired", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN(2004, "Invalid authentication token", HttpStatus.UNAUTHORIZED),
    ACCOUNT_LOCKED(2005, "Your account has been locked", HttpStatus.FORBIDDEN),
    ACCOUNT_DISABLED(2006, "Your account has been disabled", HttpStatus.FORBIDDEN),
    MFA_REQUIRED(2007, "Multi-factor authentication required", HttpStatus.UNAUTHORIZED),
    PASSWORD_EXPIRED(2008, "Password has expired", HttpStatus.UNAUTHORIZED),
    TOO_MANY_LOGIN_ATTEMPTS(2009, "Too many failed login attempts", HttpStatus.TOO_MANY_REQUESTS),

    // User errors (3000-3099)
    USER_NOT_FOUND(3000, "User not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS(3001, "User already exists", HttpStatus.CONFLICT),
    INVALID_USERNAME(3002, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(3003, "Password must be at least 8 characters and include letters and numbers", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(3004, "Invalid email format", HttpStatus.BAD_REQUEST),
    INVALID_PHONE(3005, "Invalid phone number format", HttpStatus.BAD_REQUEST),
    INVALID_DOB(3006, "Your age must be at least {min} years", HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_USED(3007, "Email is already in use", HttpStatus.CONFLICT),
    PHONE_ALREADY_USED(3008, "Phone number is already in use", HttpStatus.CONFLICT),
    PROFILE_UPDATE_FAILED(3009, "Failed to update user profile", HttpStatus.BAD_REQUEST),
    ADDRESS_NOT_FOUND(3010, "Shipping address not found", HttpStatus.NOT_FOUND),
    INVALID_ADDRESS(3011, "Invalid shipping address", HttpStatus.BAD_REQUEST),

    // Product errors (4000-4099)
    PRODUCT_NOT_FOUND(4000, "Product not found", HttpStatus.NOT_FOUND),
    PRODUCT_OUT_OF_STOCK(4001, "Product is out of stock", HttpStatus.BAD_REQUEST),
    INVALID_PRODUCT_ID(4002, "Invalid product ID", HttpStatus.BAD_REQUEST),
    PRODUCT_DISABLED(4003, "Product is no longer available", HttpStatus.BAD_REQUEST),
    CATEGORY_NOT_FOUND(4004, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(4005, "Category already exists", HttpStatus.CONFLICT),
    INVALID_CATEGORY(4006, "Invalid category", HttpStatus.BAD_REQUEST),
    INVALID_PRICE(4007, "Invalid product price", HttpStatus.BAD_REQUEST),
    INVALID_DISCOUNT(4008, "Invalid discount value", HttpStatus.BAD_REQUEST),
    PRODUCT_IMAGE_NOT_FOUND(4009, "Product image not found", HttpStatus.NOT_FOUND),
    MAX_PRODUCT_IMAGES_REACHED(4010, "Maximum number of product images reached", HttpStatus.BAD_REQUEST),
    INVALID_SIZE_OPTION(4011, "Invalid size option", HttpStatus.BAD_REQUEST),
    INVALID_COLOR_OPTION(4012, "Invalid color option", HttpStatus.BAD_REQUEST),
    PRODUCT_SKU_EXISTS(4013, "Product SKU already exists", HttpStatus.CONFLICT),

    // Order errors (5000-5099)
    ORDER_NOT_FOUND(5000, "Order not found", HttpStatus.NOT_FOUND),
    EMPTY_CART(5001, "Shopping cart is empty", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATE(5002, "Invalid order state transition", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_PROCESSED(5003, "Order has already been processed", HttpStatus.CONFLICT),
    ORDER_CANCELLED(5004, "Order has been cancelled", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(5005, "Cart item not found", HttpStatus.NOT_FOUND),
    INSUFFICIENT_STOCK(5006, "Insufficient stock for requested quantity", HttpStatus.BAD_REQUEST),
    MINIMUM_ORDER_VALUE_NOT_MET(5007, "Order does not meet minimum order value", HttpStatus.BAD_REQUEST),
    COUPON_NOT_FOUND(5008, "Coupon not found", HttpStatus.NOT_FOUND),
    COUPON_EXPIRED(5009, "Coupon has expired", HttpStatus.BAD_REQUEST),
    COUPON_ALREADY_USED(5010, "Coupon has already been used", HttpStatus.BAD_REQUEST),
    INVALID_COUPON(5011, "Invalid coupon", HttpStatus.BAD_REQUEST),
    ORDER_RETURN_PERIOD_EXPIRED(5012, "Order return period has expired", HttpStatus.BAD_REQUEST),
    INVALID_RETURN_REASON(5013, "Invalid return reason", HttpStatus.BAD_REQUEST),

    // Payment errors (6000-6099)
    PAYMENT_FAILED(6000, "Payment processing failed", HttpStatus.BAD_REQUEST),
    INVALID_PAYMENT_METHOD(6001, "Invalid payment method", HttpStatus.BAD_REQUEST),
    PAYMENT_DECLINED(6002, "Payment was declined by payment provider", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_FUNDS(6003, "Insufficient funds", HttpStatus.BAD_REQUEST),
    PAYMENT_EXPIRED(6004, "Payment session has expired", HttpStatus.BAD_REQUEST),
    PAYMENT_ALREADY_PROCESSED(6005, "Payment has already been processed", HttpStatus.CONFLICT),
    REFUND_FAILED(6006, "Refund processing failed", HttpStatus.BAD_REQUEST),
    INVOICE_NOT_FOUND(6007, "Invoice not found", HttpStatus.NOT_FOUND),
    PAYMENT_PROVIDER_ERROR(6008, "Payment provider error", HttpStatus.SERVICE_UNAVAILABLE),

    // Inventory errors (7000-7099)
    INVENTORY_UPDATE_FAILED(7000, "Failed to update inventory", HttpStatus.INTERNAL_SERVER_ERROR),
    NEGATIVE_STOCK_VALUE(7001, "Stock value cannot be negative", HttpStatus.BAD_REQUEST),
    SKU_NOT_FOUND(7002, "SKU not found", HttpStatus.NOT_FOUND),
    DUPLICATE_SKU(7003, "Duplicate SKU", HttpStatus.CONFLICT),
    SIZE_NOT_AVAILABLE(7004, "Selected size is not available", HttpStatus.BAD_REQUEST),
    COLOR_NOT_AVAILABLE(7005, "Selected color is not available", HttpStatus.BAD_REQUEST),
    VARIANT_NOT_FOUND(7006, "Product variant not found", HttpStatus.NOT_FOUND),

    // Shipping errors (8000-8099)
    SHIPPING_METHOD_NOT_AVAILABLE(8000, "Shipping method not available for your location", HttpStatus.BAD_REQUEST),
    INVALID_SHIPPING_ADDRESS(8001, "Invalid shipping address", HttpStatus.BAD_REQUEST),
    SHIPPING_CALCULATION_FAILED(8002, "Failed to calculate shipping cost", HttpStatus.INTERNAL_SERVER_ERROR),
    TRACKING_NOT_AVAILABLE(8003, "Tracking information not available", HttpStatus.NOT_FOUND),
    SHIPPING_RESTRICTED_ITEM(8004, "Order contains items restricted for shipping to your location", HttpStatus.BAD_REQUEST),
    SHIPPING_REGION_NOT_SUPPORTED(8005, "Shipping to your region is not supported", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_SHIPPED(8006, "Order has already been shipped", HttpStatus.CONFLICT),

    // File management errors (9000-9099)
    FILE_NOT_FOUND(9000, "File not found", HttpStatus.NOT_FOUND),
    FILE_STORAGE_ERROR(9001, "Failed to store file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_DELETE_ERROR(9002, "Failed to delete file", HttpStatus.INTERNAL_SERVER_ERROR),
    FILE_READ_ERROR(9003, "Failed to read file", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_FILE_TYPE(9004, "Invalid file type, supported types: {types}", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(9005, "File size exceeds the maximum limit of {maxSize}", HttpStatus.PAYLOAD_TOO_LARGE),
    FILE_EMPTY(9006, "File is empty", HttpStatus.BAD_REQUEST),
    FILE_NAME_TOO_LONG(9007, "File name exceeds maximum length", HttpStatus.BAD_REQUEST),
    FILE_CORRUPTED(9008, "File is corrupted or cannot be processed", HttpStatus.BAD_REQUEST),
    MAX_FILES_EXCEEDED(9009, "Maximum number of files exceeded", HttpStatus.BAD_REQUEST),
    FILE_VIRUS_DETECTED(9010, "Security threat detected in file", HttpStatus.BAD_REQUEST),
    IMAGE_PROCESSING_ERROR(9011, "Failed to process image", HttpStatus.INTERNAL_SERVER_ERROR),
    UNSUPPORTED_IMAGE_FORMAT(9012, "Unsupported image format, supported formats: {formats}", HttpStatus.BAD_REQUEST),
    IMAGE_RESOLUTION_TOO_LOW(9013, "Image resolution is too low, minimum required: {minWidth}x{minHeight}", HttpStatus.BAD_REQUEST),
    IMAGE_RESOLUTION_TOO_HIGH(9014, "Image resolution is too high, maximum allowed: {maxWidth}x{maxHeight}", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_TIMEOUT(9015, "File upload timed out", HttpStatus.REQUEST_TIMEOUT),
    CONCURRENT_FILE_MODIFICATION(9016, "File is being modified by another process", HttpStatus.CONFLICT),
    STORAGE_QUOTA_EXCEEDED(9017, "Storage quota exceeded", HttpStatus.FORBIDDEN),
    FILE_PERMISSION_DENIED(9018, "Permission denied for file operation", HttpStatus.FORBIDDEN),
    FILE_ALREADY_EXISTS(9019, "File with the same name already exists", HttpStatus.CONFLICT);

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}