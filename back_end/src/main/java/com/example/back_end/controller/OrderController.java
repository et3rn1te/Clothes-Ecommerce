package com.example.back_end.controller;

import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    OrderService orderService;
    @PostMapping("/add")
    public ApiResponse<Void> updateCartItem(@RequestBody OrderCreateRequest request){
        orderService.addOrder(request);
        return ApiResponse.<Void>builder().build();
    }
}
