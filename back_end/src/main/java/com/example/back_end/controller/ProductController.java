package com.example.back_end.controller;

import com.example.back_end.dto.request.ProductCreationRequest;
import com.example.back_end.dto.response.ProductResponse;
import com.example.back_end.entity.ProductImage;
import com.example.back_end.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreationRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Boolean isFeatured,
            @RequestParam(required = false) Boolean isNewArrival,
            @RequestParam(required = false) Boolean isBestSeller,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(
                categoryId, minPrice, maxPrice, brand,
                isFeatured, isNewArrival, isBestSeller, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ProductResponse>> getFeaturedProducts() {
        return ResponseEntity.ok(productService.getFeaturedProducts());
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<ProductResponse>> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<List<ProductResponse>> getBestSellers() {
        return ResponseEntity.ok(productService.getBestSellers());
    }
}