package com.example.back_end.service;

import com.example.back_end.entity.ProductCategory;
import java.util.List;

public interface ProductCategoryService {
    List<ProductCategory> getAllCategories();
    ProductCategory getCategoryById(Long id);
    ProductCategory createCategory(ProductCategory category);
    ProductCategory updateCategory(Long id, ProductCategory category);
    void deleteCategory(Long id);
} 