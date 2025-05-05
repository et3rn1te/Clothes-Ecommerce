package com.example.back_end.repository;

import com.example.back_end.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductId(Long id);
    Image findByUserId(Long id);
}
