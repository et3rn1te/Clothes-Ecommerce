package com.example.back_end.service.order;

import com.example.back_end.dto.request.OrderCreateRequest;
import com.example.back_end.entity.*;
import com.example.back_end.repository.*;
import com.example.back_end.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService implements IOrderService{
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final ModelMapper modelMapper;
    private final IUserService userService;
    private final PaymentRepository paymentRepository;
    private final StatusRepository statusRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
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
            Product product = cartDetail.getIdProduct();
            Integer cartQuantity = cartDetail.getQuantity();

//            BigDecimal price = BigDecimal.valueOf(product.getPrice());
//            BigDecimal totalPrice = price.multiply(BigDecimal.valueOf(cartQuantity));

            OrderDetail oderDetail = new OrderDetail();
            oderDetail.setIdOrder(order);
            oderDetail.setIdProduct(product);
            oderDetail.setQuantity(cartQuantity);
            oderDetail.setTotalPrice(request.getTotal());

            orderDetailRepository.save(oderDetail);
        }

//        cartDetailRepository.deleteAll(cartDetails);

    }
}
