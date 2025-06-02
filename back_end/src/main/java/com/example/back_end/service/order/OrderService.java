package com.example.back_end.service.order;

import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.dto.OrderDto;
import com.example.back_end.dto.StatusDto;
import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.entity.*;
import com.example.back_end.mapper.OrderDetailMapper;
import com.example.back_end.mapper.OrderMapper;
import com.example.back_end.mapper.ProductImageMapper;
import com.example.back_end.dto.response.order.OrderResponse;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.entity.*;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repository.*;
import com.example.back_end.service.product.IProductImageService;
import com.example.back_end.service.product.ProductImageService;
import com.example.back_end.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderDetailMapper orderDetailMapper;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ModelMapper modelMapper;
    private final IUserService userService;
    private final PaymentRepository paymentRepository;
    private final StatusRepository statusRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderMapper orderMapper;
    private final IProductImageService productImageService;
    private final ProductImageMapper productImageMapper;

    @Override
    public void addOrder(OrderCreateRequest request) {
        Cart cart = cartRepository.findByUser_Id(request.getIdUser())
                .orElseThrow(() -> new IllegalArgumentException("Cart không tồn tại cho User này."));
        List<CartDetail> cartDetails = cartDetailRepository.findAllByIdCart(cart);
        if (cartDetails.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống, không thể đặt đơn.");
        }
        PaymentMethod paymentMethod = paymentRepository.findById(request.getIdPaymentMethod())
                .orElseThrow(() -> new IllegalArgumentException("Phương thức thanh toán không hợp lệ."));
        Status status = statusRepository.findById(request.getIdStatus())
                .orElseThrow(() -> new IllegalArgumentException("Trạng thái không tồn tại."));
        Order order = new Order();
        order.setIdUser(userService.getUserById(request.getIdUser()));
        order.setDateOrder(LocalDate.now());
        order.setAddress(request.getAddress());
        order.setIdPaymentMethod(paymentMethod);
        order.setIdStatus(status);
        order.setReceiver(request.getReceiver());
        order.setPhone(request.getPhone());
        orderRepository.save(order);

        for (CartDetail cartDetail : cartDetails) {
            ProductVariant product = cartDetail.getIdProduct();
            Integer cartQuantity = cartDetail.getQuantity();

            OrderDetail oderDetail = new OrderDetail();
            oderDetail.setIdOrder(order);
            oderDetail.setIdProduct(product);
            oderDetail.setQuantity(cartQuantity);
            oderDetail.setTotalPrice(
                    product.getPrice().multiply(BigDecimal.valueOf(cartQuantity))
            );

            orderDetailRepository.save(oderDetail);
        }

//        cartDetailRepository.deleteAll(cartDetails);

    }

    @Override

    public List<OrderDetailDto> getOrderDetailsByOrderId(Long orderId) {
        List<OrderDetail>orderDetails= orderDetailRepository.findByIdOrder_Id(orderId);
        List<OrderDetailDto> orderDetailDtos= orderDetails.stream().map(orderDetailMapper::toDto).collect(Collectors.toList());
        return orderDetailDtos;
    }

    @Override
    public List<OrderDto> getOrderByUserId(Long userId) {
        List<Order> orders =  orderRepository.findByIdUser_Id(userId);
        List<OrderDto> orderDtos = orders.stream().map((element) -> modelMapper.map(element, OrderDto.class)).collect(Collectors.toList());
        for(OrderDto a : orderDtos){
            a.setOrderDetails(getOrderDetailsByOrderId(a.getIdOrder()));
        }
        return orderDtos;
    }

    public PageResponse<OrderResponse> getAllOrders(Pageable pageable) {
        Page<Order> orderPage = orderRepository.findAll(pageable);
        List<OrderResponse> orderResponses = orderPage.getContent().stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());

        return PageResponse.<OrderResponse>builder()
                .content(orderResponses)
                .pageNo(orderPage.getNumber())
                .pageSize(orderPage.getSize())
                .totalElements(orderPage.getTotalElements())
                .totalPages(orderPage.getTotalPages())
                .last(orderPage.isLast())
                .build();
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return modelMapper.map(order, OrderResponse.class);
    }

    @Override
    public OrderResponse updateOrderStatus(Long id, int statusId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        
        Status status = statusRepository.findById(statusId)
                .orElseThrow(() -> new AppException(ErrorCode.STATUS_NOT_FOUND));
        
        order.setIdStatus(status);
        Order updatedOrder = orderRepository.save(order);
        return modelMapper.map(updatedOrder, OrderResponse.class);
    }

    @Override
    public List<OrderResponse> getOrdersByUser(Long userId) {
        List<Order> orders = orderRepository.findByIdUser_Id(userId);
        return orders.stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .collect(Collectors.toList());
    }
}
