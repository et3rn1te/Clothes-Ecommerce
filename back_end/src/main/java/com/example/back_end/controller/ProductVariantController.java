package com.example.back_end.controller;

import com.example.back_end.dto.request.product.ProductVariantCreationRequest;
import com.example.back_end.dto.request.product.ProductVariantUpdateRequest;
import com.example.back_end.dto.request.product.VariantFilterRequest;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.product.ProductVariantSummary;
import com.example.back_end.service.product.IProductVariantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/{productId}/variants")
@RequiredArgsConstructor
public class ProductVariantController {
    private final IProductVariantService variantService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<ProductVariantResponse> createVariant(
            @PathVariable Long productId,
            @RequestBody ProductVariantCreationRequest request) {
        return ResponseEntity.ok(variantService.createVariant(productId, request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<ProductVariantResponse> updateVariant(
            @PathVariable Long id,
            @RequestBody ProductVariantUpdateRequest request) {
        return ResponseEntity.ok(variantService.updateVariant(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long id) {
        variantService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductVariantResponse> getVariantById(@PathVariable Long id) {
        return ResponseEntity.ok(variantService.getVariantById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductVariantSummary>> getVariantsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(variantService.getVariantsByProduct(productId));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> toggleVariantStatus(@PathVariable Long id) {
        variantService.toggleVariantStatus(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/check-exists")
    public ResponseEntity<Boolean> checkVariantExists(
            @PathVariable Long productId,
            @RequestParam Long colorId,
            @RequestParam Long sizeId) {
        return ResponseEntity.ok(variantService.existsByProductAndColorAndSize(productId, colorId, sizeId));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ProductVariantResponse> getVariantBySku(@PathVariable String sku) {
        return ResponseEntity.ok(variantService.getVariantBySku(sku));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductVariantSummary>> filterVariants(
            @PathVariable Long productId,
            @ModelAttribute VariantFilterRequest filter) {
        return ResponseEntity.ok(variantService.filterVariants(productId, filter));
    }
} 