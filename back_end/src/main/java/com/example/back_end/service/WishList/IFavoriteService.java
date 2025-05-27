package com.example.back_end.service.WishList;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.product.ProductResponse;

import java.util.List;

public interface IFavoriteService {
    ApiResponse<Void> addFavorite(Long userId, Long productId);
    ApiResponse<Void> removeFavoriteByUserIdAndProductId(Long userId, Long productId);
    List<ProductResponse> getFavoritesByUserId(Long userId);
}
