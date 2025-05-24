package com.example.back_end.repository;

import com.example.back_end.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);
    
    Page<Product> findByFeaturedTrueAndActiveTrue(Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchProducts(String keyword, Pageable pageable);
    
    List<Product> findByBrandIdAndActiveTrue(Long brandId);
    
    List<Product> findByGenderIdAndActiveTrue(Long genderId);
    
    List<Product> findByCategoriesIdAndActiveTrue(Long categoryId);
    
    boolean existsByNameAndBrandId(String name, Long brandId);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.name = :categoryName AND p.active = true")
    Page<Product> findByCategoriesNameAndActiveTrue(String categoryName, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
           "JOIN p.categories c " +
           "WHERE (c.name = :categoryName OR c.parent.name = :categoryName) " +
           "AND p.active = true")
    Page<Product> findByCategoryNameIncludingSubcategories(String categoryName, Pageable pageable);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.variants v " +
           "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(Long id);

    @Query("SELECT p FROM Product p " +
           "LEFT JOIN FETCH p.variants v " +
           "WHERE p.slug = :slug AND p.active = true")
    Optional<Product> findBySlugWithDetails(String slug);

    boolean existsBySlug(String slug);
} 