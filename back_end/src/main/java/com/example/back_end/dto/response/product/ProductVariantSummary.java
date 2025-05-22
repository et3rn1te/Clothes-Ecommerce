package com.example.back_end.dto.response.product;


import com.example.back_end.dto.response.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantSummary {
    private Long id;
    private SizeSummary size;
    private ColorSummary color;
    private String sku;
    private BigDecimal price;
    private Integer stockQuantity;
    private boolean active;
}