package com.example.back_end.controller;

import com.example.back_end.dto.request.category.CategoryImageCreationRequest;
import com.example.back_end.dto.request.category.CategoryImageUpdateRequest;
import com.example.back_end.dto.response.category.CategoryImageResponse;
import com.example.back_end.service.category.ICategoryImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories/{categoryId}/image")
@RequiredArgsConstructor
public class CategoryImageController {
    private final ICategoryImageService categoryImageService;

    @PostMapping
    public ResponseEntity<CategoryImageResponse> createImage(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryImageCreationRequest request) {
        return ResponseEntity.ok(categoryImageService.createImage(categoryId, request));
    }

    @PutMapping
    public ResponseEntity<CategoryImageResponse> updateImage(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryImageUpdateRequest request) {
        return ResponseEntity.ok(categoryImageService.updateImage(categoryId, request));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteImage(@PathVariable Long categoryId) {
        categoryImageService.deleteImage(categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<CategoryImageResponse> getCategoryImage(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryImageService.getCategoryImage(categoryId));
    }
} 