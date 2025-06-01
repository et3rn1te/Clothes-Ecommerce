package com.example.back_end.service.order;

import com.example.back_end.dto.request.OrderCreateRequest;

public interface IOrderService {
    void addOrder(OrderCreateRequest request);
}
