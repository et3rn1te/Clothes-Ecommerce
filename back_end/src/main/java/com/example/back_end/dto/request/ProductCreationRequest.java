package com.example.back_end.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreationRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String name;

    private String description;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @Min(value = 0, message = "Giá sản phẩm phải lớn hơn 0")
    private BigDecimal price;

    private BigDecimal originalPrice;
    private Integer discountPercent;

    @NotBlank(message = "Thương hiệu không được để trống")
    private String brand;

    @NotBlank(message = "Chất liệu không được để trống")
    private String material;

    private String careInstructions;
    private Boolean isFeatured;
    private Boolean isNewArrival;
    private Boolean isBestSeller;

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    private List<ProductVariantRequest> variants;
    private List<ProductImageRequest> images;
} 