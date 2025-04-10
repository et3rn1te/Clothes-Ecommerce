package com.example.back_end.repository;

import com.example.back_end.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);

    List<Category> findByParentCategoryIsNull();

    List<Category> findByParentCategoryId(Integer parentId);

    @Query("SELECT c FROM Category c WHERE SIZE(c.products) > 0")
    List<Category> findNonEmptyCategories();
}