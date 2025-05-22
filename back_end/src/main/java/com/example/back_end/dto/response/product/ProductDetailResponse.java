package com.example.back_end.dto.response.product;

import com.example.back_end.dto.response.*;
import com.example.back_end.dto.response.category.CategorySummary;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private BrandSummary brand;
    private GenderSummary gender;
    private List<CategorySummary> categories = new ArrayList<>();
    private List<ProductImageSummary> images = new ArrayList<>();
    private List<ProductVariantSummary> variants = new ArrayList<>();
    private boolean featured;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}