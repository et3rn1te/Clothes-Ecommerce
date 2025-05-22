package com.example.back_end.repository;

import com.example.back_end.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
    
    List<Category> findByIdIn(List<Long> ids);
} 