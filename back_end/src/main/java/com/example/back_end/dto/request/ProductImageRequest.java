package com.example.back_end.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageRequest {
    @NotBlank(message = "URL hình ảnh không được để trống")
    private String imageUrl;

    private String thumbnailUrl;
    private String altText;
    private Integer imageOrder;
    private Boolean isPrimary;
    private Boolean isColorVariant;
    private String colorCode;
} 