package com.example.back_end.service.Cart;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.entity.CartDetail;

import java.util.List;

public interface ICartService {
    void updateCartItem(CartRequest request);
    List<CartDetailDto>listCartDetail (Long idUser);
}
