package com.example.back_end.controller;

import com.example.back_end.entity.ProductCategory;
import com.example.back_end.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class ProductCategoryController {

    private final ProductCategoryService productCategoryService;

    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        return ResponseEntity.ok(productCategoryService.getAllCategories());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(productCategoryService.getCategoryById(id));
    }

    @PostMapping
    public ResponseEntity<ProductCategory> createCategory(@RequestBody ProductCategory category) {
        return ResponseEntity.ok(productCategoryService.createCategory(category));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody ProductCategory category) {
        return ResponseEntity.ok(productCategoryService.updateCategory(id, category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        productCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
} 