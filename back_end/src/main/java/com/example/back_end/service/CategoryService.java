package com.example.back_end.service;

import com.example.back_end.dto.request.category.CategoryCreationRequest;
import com.example.back_end.dto.request.category.UpdateCategoryRequest;
import com.example.back_end.dto.response.category.CategoryListResponse;
import com.example.back_end.dto.response.category.CategoryResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryCreationRequest request);
    
    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);
    
    void deleteCategory(Long id);
    
    CategoryResponse getCategoryById(Long id);
    
    List<CategoryListResponse> getAllCategories();
    
    void toggleCategoryStatus(Long id);
    
    boolean existsByName(String name);
} 