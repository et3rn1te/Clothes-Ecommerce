package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageDto {
    private Long id;
    private String originalFileName;
    private String fileType;
    private String imageUrl;
    private String imageType; // PRODUCT, USER_AVATAR
    private Long productId;
    private Long userId;
}
