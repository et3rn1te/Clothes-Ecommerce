package com.example.back_end.mapper;

import com.example.back_end.dto.request.ProductCreationRequest;
import com.example.back_end.dto.response.ProductImageResponse;
import com.example.back_end.dto.response.ProductResponse;
import com.example.back_end.dto.response.ProductVariantResponse;
import com.example.back_end.entity.Product;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ProductMapper {
    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .discountPercent(product.getDiscountPercent())
                .brand(product.getBrand())
                .material(product.getMaterial())
                .careInstructions(product.getCareInstructions())
                .isFeatured(product.isFeatured())
                .isNewArrival(product.isNewArrival())
                .isBestSeller(product.isBestSeller())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .variants(product.getVariants().stream()
                        .map(variant -> ProductVariantResponse.builder()
                                .id(variant.getId())
                                .size(variant.getSize())
                                .color(variant.getColor())
                                .colorCode(variant.getColorCode())
                                .quantity(variant.getQuantity())
                                .sku(variant.getSku())
                                .createdAt(variant.getCreatedAt())
                                .updatedAt(variant.getUpdatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .images(product.getImages().stream()
                        .map(image -> ProductImageResponse.builder()
                                .id(image.getId())
                                .imageUrl(image.getImageUrl())
                                .thumbnailUrl(image.getThumbnailUrl())
                                .altText(image.getAltText())
                                .imageOrder(image.getImageOrder())
                                .isPrimary(image.isPrimary())
                                .isColorVariant(image.isColorVariant())
                                .colorCode(image.getColorCode())
                                .createdAt(image.getCreatedAt())
                                .updatedAt(image.getUpdatedAt())
                                .build())
                        .collect(Collectors.toList()))
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public Product toProduct(ProductCreationRequest request) {
        return Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .discountPercent(request.getDiscountPercent())
                .brand(request.getBrand())
                .material(request.getMaterial())
                .careInstructions(request.getCareInstructions())
                .isFeatured(request.getIsFeatured())
                .isNewArrival(request.getIsNewArrival())
                .isBestSeller(request.getIsBestSeller())
                .build();
    }
} 