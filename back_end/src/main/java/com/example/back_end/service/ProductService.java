package com.example.back_end.service;

import com.example.back_end.dto.request.product.ProductCreationRequest;
import com.example.back_end.dto.request.product.ProductUpdateRequest;
import com.example.back_end.dto.response.product.ProductDetailResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.dto.response.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductCreationRequest request);
    
    ProductResponse updateProduct(Long id, ProductUpdateRequest request);
    
    void deleteProduct(Long id);
    
    ProductDetailResponse getProductById(Long id);
    
    ProductDetailResponse getProductBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    PageResponse<ProductSummary> getAllProducts(Pageable pageable);
    
    PageResponse<ProductSummary> getFeaturedProducts(Pageable pageable);
    
    PageResponse<ProductSummary> searchProducts(String keyword, Pageable pageable);
    
    List<ProductSummary> getProductsByBrand(Long brandId);
    
    List<ProductSummary> getProductsByGender(Long genderId);
    
    List<ProductSummary> getProductsByCategory(Long categoryId);
    
    void toggleProductStatus(Long id);
    
    void toggleFeaturedStatus(Long id);

    PageResponse<ProductSummary> getProductsByCategoryName(String categoryName, Pageable pageable);
} 