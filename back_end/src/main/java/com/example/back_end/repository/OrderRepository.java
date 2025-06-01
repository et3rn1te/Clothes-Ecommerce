package com.example.back_end.repository;

import com.example.back_end.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByIdUser_Id(Long userId);
}
