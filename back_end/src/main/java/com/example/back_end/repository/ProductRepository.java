package com.example.back_end.repository;

import com.example.back_end.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    Page<Product> findByNameContaining(String name, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.id = :categoryId")
    Page<Product> findByCategoryId(@Param("categoryId") Integer categoryId, Pageable pageable);

    Page<Product> findByBasePriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN p.inventory i GROUP BY p HAVING SUM(i.quantity) > 0")
    Page<Product> findInStockProducts(Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.reviews r GROUP BY p ORDER BY AVG(r.rating) DESC")
    List<Product> findTopRatedProducts(Pageable pageable);
}