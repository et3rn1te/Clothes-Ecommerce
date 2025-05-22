package com.example.back_end.service;

import com.example.back_end.dto.request.product.ProductImageCreationRequest;
import com.example.back_end.dto.request.product.ProductImageUpdateRequest;
import com.example.back_end.dto.response.product.ProductImageResponse;
import com.example.back_end.dto.response.product.ProductImageSummary;

import java.util.List;

public interface ProductImageService {
    ProductImageResponse createImage(Long productId, Long variantId, boolean isActive, boolean isPrimary, ProductImageCreationRequest request);

    ProductImageResponse updateImage(Long id, Boolean isActive, Boolean isPrimary, ProductImageUpdateRequest request);

    void deleteImage(Long id);

    ProductImageResponse getImageById(Long id);

    List<ProductImageSummary> getImagesByProduct(Long productId);

    void deleteImagesByProduct(Long productId);

    void toggleImageStatus(Long id);

    void setPrimaryImage(Long id);
} 