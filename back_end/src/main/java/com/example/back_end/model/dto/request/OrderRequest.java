package com.example.back_end.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    @NotNull(message = "Address ID is required")
    private Integer addressId;

    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemRequest> items;

    private String promotionCode;

    private PaymentRequest payment;

    @Data
    public static class OrderItemRequest {
        @NotNull(message = "Inventory ID is required")
        private Integer inventoryId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;
    }

    @Data
    public static class PaymentRequest {
        @NotNull(message = "Payment method is required")
        private String paymentMethod;

        private String transactionId;
    }
}