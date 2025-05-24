package com.example.back_end.service;

import com.example.back_end.dto.request.product.ProductVariantCreationRequest;
import com.example.back_end.dto.request.product.ProductVariantUpdateRequest;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.product.ProductVariantSummary;

import java.util.List;

public interface ProductVariantService {
    ProductVariantResponse createVariant(Long productId, ProductVariantCreationRequest request);
    
    ProductVariantResponse updateVariant(Long id, ProductVariantUpdateRequest request);
    
    void deleteVariant(Long id);
    
    ProductVariantResponse getVariantById(Long id);
    
    List<ProductVariantSummary> getVariantsByProduct(Long productId);
    
    void toggleVariantStatus(Long id);
    
    boolean existsByProductAndColorAndSize(Long productId, Long colorId, Long sizeId);

    ProductVariantResponse getVariantBySku(String sku);
} 