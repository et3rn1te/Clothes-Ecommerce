package com.example.back_end.repository;

import com.example.back_end.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

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
} 