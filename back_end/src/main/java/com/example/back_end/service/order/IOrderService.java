package com.example.back_end.service.order;

import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.dto.OrderDto;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.entity.OrderDetail;

import java.util.List;

public interface IOrderService {
    void addOrder(OrderCreateRequest request);
    List<OrderDetailDto> getOrderDetailsByOrderId(Long orderId);
    List<OrderDto> getOrderByUserId(Long userId);
}
