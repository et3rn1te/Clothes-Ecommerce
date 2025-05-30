package com.example.back_end.controller;

import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    /**
     * Method to create a new order
     *
     * @param request: Order creation request containing user info, shipping details, and items
     * @return JSON body contains success message if order created successfully
     */
    @PostMapping("/add")
    public ApiResponse<Void> createOrder(@RequestBody OrderCreateRequest request) {
        orderService.addOrder(request);
        return ApiResponse.<Void>builder().build();
    }

    /**
     * Method to get all orders with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of orders
     */
    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> getAllOrders(Pageable pageable) {
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    /**
     * Method to get order by ID
     *
     * @param id: Order's id
     * @return JSON body contains detailed order information
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    /**
     * Method to update order status
     *
     * @param id: Order's id
     * @param statusId: New status id to update
     * @return JSON body contains updated order information
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam int statusId) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, statusId));
    }

    /**
     * Method to get orders by user ID
     *
     * @param userId: User's id
     * @return JSON body contains list of orders for the specified user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }
}
