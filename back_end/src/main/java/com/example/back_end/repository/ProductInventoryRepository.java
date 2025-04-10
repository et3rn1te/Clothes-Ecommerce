package com.example.back_end.repository;

import com.example.back_end.model.entity.ProductInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {
    List<ProductInventory> findByProductId(Integer productId);

    Optional<ProductInventory> findBySku(String sku);

    @Query("SELECT pi FROM ProductInventory pi WHERE pi.product.id = :productId AND pi.size.id = :sizeId AND pi.color.id = :colorId")
    Optional<ProductInventory> findByProductIdAndSizeIdAndColorId(
            @Param("productId") Integer productId,
            @Param("sizeId") Integer sizeId,
            @Param("colorId") Integer colorId
    );

    @Query("SELECT pi FROM ProductInventory pi WHERE pi.quantity > 0")
    List<ProductInventory> findAllInStock();

    @Query("SELECT pi FROM ProductInventory pi WHERE pi.quantity < :threshold")
    List<ProductInventory> findLowStock(@Param("threshold") Integer threshold);
}