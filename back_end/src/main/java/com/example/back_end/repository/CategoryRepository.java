package com.example.back_end.repository;

import com.example.back_end.entity.Category;
import com.example.back_end.entity.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);

    boolean existsBySlug(String slug);

    List<Category> findByIdIn(List<Long> ids);

    List<Category> findAllByParentId(Long parentId);

    Optional<Category> findByName(String name);

    Optional<Category> findBySlug(String slug);

    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.subcategories WHERE c.slug = :slug")
    Optional<Category> findBySlugWithSubcategories(String slug);

    List<Category> findByGender(Gender gender);
} 