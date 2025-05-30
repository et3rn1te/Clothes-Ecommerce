package com.example.back_end.service.order;

import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.response.order.OrderResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOrderService {
    void addOrder(OrderCreateRequest request);
    
    PageResponse<OrderResponse> getAllOrders(Pageable pageable);
    
    OrderResponse getOrderById(Long id);
    
    OrderResponse updateOrderStatus(Long id, int statusId);
    
    List<OrderResponse> getOrdersByUser(Long userId);
}
