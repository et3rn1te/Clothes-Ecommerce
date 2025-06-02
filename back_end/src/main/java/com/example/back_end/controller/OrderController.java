package com.example.back_end.controller;

import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.dto.OrderDto;
import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/{userId}")
    public ApiResponse<List<OrderDto>> getOrderByUser(@PathVariable Long userId){
        List<OrderDto> orderDtos = orderService.getOrderByUserId(userId);
        return ApiResponse.<List<OrderDto>>builder().result(orderDtos).build();
    }
    @GetMapping("/details/{orderId}")
    public ApiResponse<List<OrderDetailDto>> getOrderDetail(@PathVariable Long orderId){
        List<OrderDetailDto> orderDtos = orderService.getOrderDetailsByOrderId(orderId);
        return ApiResponse.<List<OrderDetailDto>>builder().result(orderDtos).build();
    }

    
}
