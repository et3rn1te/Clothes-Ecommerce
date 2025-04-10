package com.example.back_end.model.dto.response;

import com.example.back_end.model.entity.Order;
import com.example.back_end.model.entity.Payment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Integer id;
    private Integer userId;
    private String userEmail;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private PaymentResponse payment;

    @Data
    public static class OrderItemResponse {
        private Integer id;
        private String productName;
        private String size;
        private String color;
        private Integer quantity;
        private BigDecimal price;
        private String imageUrl;
    }

    @Data
    public static class PaymentResponse {
        private Integer id;
        private BigDecimal amount;
        private String paymentMethod;
        private String transactionId;
        private Payment.PaymentStatus status;
        private LocalDateTime createdAt;
    }
}