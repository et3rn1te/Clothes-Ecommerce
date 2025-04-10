package com.example.back_end.repository;

import com.example.back_end.model.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUserId(Integer userId);

    Optional<Address> findByUserIdAndIsDefaultTrue(Integer userId);
}