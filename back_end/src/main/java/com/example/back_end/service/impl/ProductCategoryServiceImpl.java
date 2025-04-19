package com.example.back_end.service.impl;

import com.example.back_end.entity.ProductCategory;
import com.example.back_end.repository.ProductCategoryRepository;
import com.example.back_end.service.ProductCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryRepository productCategoryRepository;

    @Override
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAll();
    }

    @Override
    public ProductCategory getCategoryById(Long id) {
        return productCategoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    @Transactional
    public ProductCategory createCategory(ProductCategory category) {
        return productCategoryRepository.save(category);
    }

    @Override
    @Transactional
    public ProductCategory updateCategory(Long id, ProductCategory category) {
        ProductCategory existingCategory = getCategoryById(id);
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setImageUrl(category.getImageUrl());
        existingCategory.setActive(category.isActive());
        return productCategoryRepository.save(existingCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        ProductCategory category = getCategoryById(id);
        productCategoryRepository.delete(category);
    }
} 