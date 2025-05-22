package com.example.back_end.service.Discount;

import com.example.back_end.entity.Discount;

public interface IDiscountService {
    Discount findByCode(String code);
}
