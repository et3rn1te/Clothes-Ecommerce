package com.example.back_end.service;

import com.example.back_end.dto.request.ProductCreationRequest;
import com.example.back_end.dto.response.ProductResponse;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.ProductCategory;
import com.example.back_end.entity.ProductImage;
import com.example.back_end.entity.ProductVariant;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductMapper;
import com.example.back_end.repository.ProductCategoryRepository;
import com.example.back_end.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductCategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public ProductResponse createProduct(ProductCreationRequest request) {
        ProductCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Product product = productMapper.toProduct(request);
        product.setCategory(category);

        // Xử lý biến thể
        if (request.getVariants() != null) {
            List<ProductVariant> variants = request.getVariants().stream()
                    .map(variantRequest -> {
                        ProductVariant variant = new ProductVariant();
                        variant.setSize(variantRequest.getSize());
                        variant.setColor(variantRequest.getColor());
                        variant.setColorCode(variantRequest.getColorCode());
                        variant.setQuantity(variantRequest.getQuantity());
                        variant.setSku(variantRequest.getSku());
                        variant.setProduct(product);
                        return variant;
                    })
                    .toList();
            product.setVariants(variants);
        }

        // Xử lý hình ảnh
        if (request.getImages() != null) {
            List<ProductImage> images = request.getImages().stream()
                    .map(imageRequest -> {
                        ProductImage image = new ProductImage();
                        image.setImageUrl(imageRequest.getImageUrl());
                        image.setThumbnailUrl(imageRequest.getThumbnailUrl());
                        image.setAltText(imageRequest.getAltText());
                        image.setImageOrder(imageRequest.getImageOrder());
                        image.setPrimary(imageRequest.getIsPrimary());
                        image.setColorVariant(imageRequest.getIsColorVariant());
                        image.setColorCode(imageRequest.getColorCode());
                        image.setProduct(product);
                        return image;
                    })
                    .toList();
            product.setImages(images);
        }

        Product savedProduct = productRepository.save(product);
        return productMapper.toProductResponse(savedProduct);
    }

    public Page<ProductResponse> searchProducts(
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String brand,
            Boolean isFeatured,
            Boolean isNewArrival,
            Boolean isBestSeller,
            Pageable pageable) {
        Page<Product> products = productRepository.searchProducts(
                categoryId, minPrice, maxPrice, brand,
                isFeatured, isNewArrival, isBestSeller, pageable);
        return products.map(productMapper::toProductResponse);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toProductResponse(product);
    }

    public List<ProductResponse> getFeaturedProducts() {
        List<Product> products = productRepository.findByIsFeaturedTrue();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public List<ProductResponse> getNewArrivals() {
        List<Product> products = productRepository.findByIsNewArrivalTrue();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    public List<ProductResponse> getBestSellers() {
        List<Product> products = productRepository.findByIsBestSellerTrue();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }
} 