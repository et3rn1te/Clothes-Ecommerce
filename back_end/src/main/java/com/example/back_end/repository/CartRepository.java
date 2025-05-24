package com.example.back_end.repository;

import com.example.back_end.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart,Long> {
    Optional<Cart> findByUser_IdAndIsOrdered(Long idUser,boolean ordered);
    Optional<Cart> findByUser_Id(Long idUser);

}
