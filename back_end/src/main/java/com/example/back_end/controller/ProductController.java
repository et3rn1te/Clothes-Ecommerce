package com.example.back_end.controller;

import com.example.back_end.dto.request.product.ProductCreationRequest;
import com.example.back_end.dto.request.product.ProductUpdateRequest;
import com.example.back_end.dto.response.product.ProductDetailResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.entity.Product;
import com.example.back_end.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;

    /**
     * Method to create Product
     *
     * @param request: Product creation request containing name, description, price, brand, etc.
     * @return JSON body contains Product info if created successfully
     */
    @PostMapping
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreationRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    /**
     * Method to update Product
     *
     * @param id: Product's id
     * @param request: Product update request containing fields to update
     * @return JSON body contains updated Product info
     */
    @PutMapping("/{id}")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    /**
     * Method to delete Product
     *
     * @param id: Product's id
     * @return No content if deleted successfully
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get Products by Category Name with pagination
     *
     * @param name: Category's name
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of Product summaries for the specified category name
     */
    @GetMapping("/category/name/{name}")
    public ResponseEntity<PageResponse<ProductSummary>> getProductsByCategoryName(
            @PathVariable String name,
            Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategoryName(name, pageable));
    }

    /**
     * Method to get Product by ID
     *
     * @param id: Product's id
     * @return JSON body contains detailed Product info including variants and images
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetailById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    @GetMapping("/check-slug")
    public ResponseEntity<Boolean> checkSlugExists(@RequestParam String slug) {
        return ResponseEntity.ok(productService.existsBySlug(slug));
    }

    /**
     * Method to get all Products with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of Product summaries
     */
    @GetMapping
    public ResponseEntity<PageResponse<ProductSummary>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    /**
     * Method to get featured Products with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of featured Product summaries
     */
    @GetMapping("/featured")
    public ResponseEntity<PageResponse<ProductSummary>> getFeaturedProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable));
    }

    /**
     * Method to search Products by keyword
     *
     * @param keyword: Search keyword to match against product name and description
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of matching Product summaries
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponse<ProductSummary>> searchProducts(
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(keyword, pageable));
    }

    /**
     * Method to get Products by Brand
     *
     * @param brandId: Brand's id
     * @return JSON body contains list of Product summaries for the specified brand
     */
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<ProductSummary>> getProductsByBrand(@PathVariable Long brandId) {
        return ResponseEntity.ok(productService.getProductsByBrand(brandId));
    }

    /**
     * Method to get Products by Gender
     *
     * @param genderName: Gender's name
     * @return JSON body contains list of Product summaries for the specified gender
     */
    @GetMapping("/gender/{genderName}")
    public ResponseEntity<List<ProductSummary>> getProductsByGender(@PathVariable String genderName) {
        return ResponseEntity.ok(productService.getProductsByGender(genderName));
    }

    /**
     * Method to get Products by Category
     *
     * @param categoryId: Category's id
     * @return JSON body contains list of Product summaries for the specified category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductSummary>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    /**
     * Method to toggle Product's active status
     *
     * @param id: Product's id
     * @return No content if status toggled successfully
     */
    @PatchMapping("/{id}/toggle-status")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> toggleProductStatus(@PathVariable Long id) {
        productService.toggleProductStatus(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to toggle Product's featured status
     *
     * @param id: Product's id
     * @return No content if featured status toggled successfully
     */
    @PatchMapping("/{id}/toggle-featured")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> toggleFeaturedStatus(@PathVariable Long id) {
        productService.toggleFeaturedStatus(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get Products by Category Slug and Gender Slug with pagination
     *
     * @param categorySlug: Category's slug
     * @param genderSlug: Gender's slug
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of Product summaries for the specified category and gender
     */
    @GetMapping("/category/slug/{categorySlug}")
    public ResponseEntity<PageResponse<ProductSummary>> getProductsByCategorySlug(
            @PathVariable String categorySlug,
            @RequestParam String genderSlug,
            Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByCategorySlug(categorySlug, genderSlug, pageable));
    }

    @GetMapping("/{id}/related")
    public ResponseEntity<PageResponse<ProductSummary>> getRelatedProducts(
            @PathVariable Long id,
            Pageable pageable) {
        return ResponseEntity.ok(productService.getRelatedProducts(id, pageable));
    }
} 