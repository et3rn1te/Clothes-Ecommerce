package com.example.back_end.controller;

import com.example.back_end.dto.request.category.CategoryCreationRequest;
import com.example.back_end.dto.request.category.UpdateCategoryRequest;
import com.example.back_end.dto.response.category.CategoryListResponse;
import com.example.back_end.dto.response.category.CategoryResponse;
import com.example.back_end.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    /**
     * Method to create Category
     *
     * @param request: Category creation request containing name and description
     * @return JSON body contains Category info if created successfully
     */
    @PostMapping
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryCreationRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    /**
     * Method to update Category
     *
     * @param id: Category's id
     * @param request: Category update request containing name and description
     * @return JSON body contains updated Category info
     */
    @PutMapping("/{id}")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody UpdateCategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    /**
     * Method to delete Category
     *
     * @param id: Category's id
     * @return JSON body contains Category info
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get Category
     *
     * @param id: Category's id
     * @return JSON body contains Category info
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    /**
     * Method to get all Categories
     *
     * @return JSON body contains Category info
     */
    @GetMapping
    public ResponseEntity<List<CategoryListResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    /**
     * Method to toggle Category's status
     * @param id: Category's id
     * @return changing the Category's status
     */
    @PatchMapping("/{id}/toggle")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> toggleCategoryStatus(@PathVariable Long id) {
        categoryService.toggleCategoryStatus(id);
        return ResponseEntity.noContent().build();
    }
} 