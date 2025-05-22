package com.example.back_end.dto.request.product;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageUpdateRequest {
    @Size(max = 255, message = "Image URL cannot exceed 255 characters")
    private String imageUrl;

    @Size(max = 100, message = "Alt text cannot exceed 100 characters")
    private String altText;

    private MultipartFile imageFile;
}
