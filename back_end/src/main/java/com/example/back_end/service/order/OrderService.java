package com.example.back_end.service.order;

import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.entity.Cart;
import com.example.back_end.entity.CartDetail;
import com.example.back_end.repository.CartDetailRepository;
import com.example.back_end.repository.CartRepository;
import com.example.back_end.service.product.ProductService;
import com.example.back_end.service.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;
    @Override
    public void addOrder(OrderCreateRequest request) {
        Cart cart = cartRepository.findByUser_Id(request.getIdUser())
                .orElseThrow(() -> new IllegalArgumentException("Cart không tồn tại cho User này."));
        List<CartDetail> cartDetails = cartDetailRepository.findAllByIdCart(cart);
        if (cartDetails.isEmpty()) {
            throw new IllegalArgumentException("Giỏ hàng trống, không thể đặt đơn.");
        }


    }
}
