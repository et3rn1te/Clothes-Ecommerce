package com.example.back_end.controller;

import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Discount;
import com.example.back_end.service.Discount.DiscountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/discount")
public class DiscountController {
    @Autowired
    private DiscountService discountService;

    @GetMapping("/getDiscount")
    public ApiResponse<Discount> getDiscount(@RequestParam String code){
        Discount getDis = discountService.findByCode(code);
        return ApiResponse.<Discount>builder().result(getDis).build();
    }
}
