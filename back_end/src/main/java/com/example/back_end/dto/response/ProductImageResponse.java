package com.example.back_end.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {
    private Long id;
    private String imageUrl;
    private String thumbnailUrl;
    private String altText;
    private Integer imageOrder;
    private Boolean isPrimary;
    private Boolean isColorVariant;
    private String colorCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 