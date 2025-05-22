package com.example.back_end.dto.response.product;

import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummary {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private String brandName;
    private ProductImageSummary primaryImage;
    private boolean featured;
}
