package com.example.back_end.service.Discount;

import com.example.back_end.entity.Discount;
import com.example.back_end.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DiscountService implements IDiscountService{
    @Autowired
    private final DiscountRepository discountRepository;

    @Override
    public Discount findByCode(String code) {
        return discountRepository.findByCode(code);
    }
}
