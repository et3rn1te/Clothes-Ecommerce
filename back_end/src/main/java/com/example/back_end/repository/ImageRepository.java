package com.example.back_end.repository;

import com.example.back_end.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductId(Long productId);

    Optional<Image> findByUserId(Long userId);

    @Query("SELECT i FROM Image i WHERE i.imageType = 'PRODUCT' AND i.product.id = :productId")
    List<Image> findAllProductImages(Long productId);

    @Query("SELECT i FROM Image i WHERE i.imageType = 'USER_AVATAR' AND i.user.id = :userId")
    Optional<Image> findUserAvatar(Long userId);
}