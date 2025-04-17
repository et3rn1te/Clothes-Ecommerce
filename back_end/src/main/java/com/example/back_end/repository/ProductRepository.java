package com.example.back_end.repository;

import com.example.back_end.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:brand IS NULL OR p.brand = :brand) AND " +
           "(:isFeatured IS NULL OR p.isFeatured = :isFeatured) AND " +
           "(:isNewArrival IS NULL OR p.isNewArrival = :isNewArrival) AND " +
           "(:isBestSeller IS NULL OR p.isBestSeller = :isBestSeller)")
    Page<Product> searchProducts(
            @Param("categoryId") Long categoryId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("brand") String brand,
            @Param("isFeatured") Boolean isFeatured,
            @Param("isNewArrival") Boolean isNewArrival,
            @Param("isBestSeller") Boolean isBestSeller,
            Pageable pageable);

    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByIsFeaturedTrue();
    List<Product> findByIsNewArrivalTrue();
    List<Product> findByIsBestSellerTrue();
} 