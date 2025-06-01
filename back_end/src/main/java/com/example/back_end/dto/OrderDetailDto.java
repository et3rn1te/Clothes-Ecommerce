package com.example.back_end.dto;

import com.example.back_end.dto.response.product.ProductSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailDto {
    private Integer id;
    private ProductSummary idProduct;
    private Integer quantity;
    private BigDecimal totalPrice;
}
