package com.example.back_end.controller.product;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Category;
import com.example.back_end.service.category.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final ICategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(
                ApiResponse.<List<Category>>builder()
                        .code(0)
                        .message("Category list retrieved successfully")
                        .data(categories)
                        .build()
        );
    }

    @PostMapping("/category/add")
    public ResponseEntity<ApiResponse<Category>> addCategory(@RequestBody Category category) {
        Category created = categoryService.addCategory(category);
        return ResponseEntity.ok(
                ApiResponse.<Category>builder()
                        .code(0)
                        .message("Category added successfully")
                        .data(created)
                        .build()
        );
    }

    @GetMapping("/category/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        Category cat = categoryService.getCategoryById(id);
        return ResponseEntity.ok(
                ApiResponse.<Category>builder()
                        .code(0)
                        .message("Category retrieved successfully")
                        .data(cat)
                        .build()
        );
    }

    @GetMapping("/category-{name}")
    public ResponseEntity<ApiResponse<Category>> getCategoryByName(@PathVariable String name) {
        Category cat = categoryService.getCategoryByName(name);
        return ResponseEntity.ok(
                ApiResponse.<Category>builder()
                        .code(0)
                        .message("Category retrieved successfully")
                        .data(cat)
                        .build()
        );
    }

    @PutMapping("/category/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id, @RequestBody Category category
    ) {
        Category updated = categoryService.updateCategory(category, id);
        return ResponseEntity.ok(
                ApiResponse.<Category>builder()
                        .code(0)
                        .message("Category updated successfully")
                        .data(updated)
                        .build()
        );
    }

    @DeleteMapping("/category/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategoryById(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(0)
                        .message("Category deleted successfully")
                        .build()
        );
    }
}