import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiEye, FiStar } from 'react-icons/fi';
import { updateCartItem } from '../../API/CartService';
import { FavoriteContext } from '../../contexts/FavoriteContext.jsx';
import WishlistService from '../../API/WishlistService';

const PLACEHOLDER_IMAGE_URL = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center';

const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const ProductCard = ({ product, onClick }) => {
  const session = JSON.parse(localStorage.getItem("session"));
  const { addToWishlist, removeFromWishlist } = useContext(FavoriteContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (session?.currentUser?.id && product?.id) {
        try {
          const isFav = await WishlistService.checkFavorite(
              session.currentUser.id,
              product.id,
              session.token
          );
          setIsFavorite(isFav);
        } catch (error) {
          console.error('Lỗi kiểm tra trạng thái yêu thích:', error);
        }
      }
    };
    checkFavoriteStatus();
  }, [session, product]);

  const handleProductClick = () => {
    if (product?.id) {
      navigate(`/product/${product.slug}`);
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (session?.currentUser?.id) {
      setIsLoading(true);
      try {
        await updateCartItem({
          idUser: session.currentUser.id,
          action: true,
          idProduct: product.id,
          amount: 1
        }, session.token);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
        console.error('Lỗi thêm vào giỏ hàng:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      navigate('/auth/login');
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!session?.currentUser?.id) {
      navigate('/auth/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromWishlist(product.id);
        setIsFavorite(false);
      } else {
        await addToWishlist(product.id);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Lỗi xử lý yêu thích:', error);
    }
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    handleProductClick();
  };

  // Generate mock rating for demo
  const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
  const reviewCount = Math.floor(Math.random() * 100) + 10;

  return (
      <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
        {/* Product Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
              src={product?.primaryImage?.imageUrl || PLACEHOLDER_IMAGE_URL}
              alt={product?.primaryImage?.altText || product?.name || 'Product Image'}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
              onClick={handleProductClick}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Wishlist Button */}
          <button
              onClick={handleToggleWishlist}
              className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-sm shadow-lg transition-all duration-300 ${
                  isFavorite
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
              } hover:scale-110`}
              aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <FiHeart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Sale Badge */}
          {product?.discount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{product.discount}%
              </div>
          )}

          {/* Action Buttons Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
            <button
                onClick={handleQuickView}
                className="flex-1 bg-white/90 backdrop-blur-sm text-gray-900 py-2.5 px-4 rounded-xl font-medium hover:bg-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FiEye className="w-4 h-4" />
              <span className="text-sm">Xem nhanh</span>
            </button>
            <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span className="text-sm">{isLoading ? 'Đang thêm...' : 'Thêm vào giỏ'}</span>
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Brand */}
          {product?.brandName && (
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                {product.brandName}
              </p>
          )}

          {/* Product Name */}
          <h3
              className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200"
              onClick={handleProductClick}
          >
            {product?.name || 'Tên sản phẩm'}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                  <FiStar
                      key={i}
                      className={`w-3.5 h-3.5 ${
                          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                  />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(product?.basePrice)}
            </span>
              {product?.originalPrice && product.originalPrice > product.basePrice && (
                  <span className="text-sm text-gray-500 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs text-gray-600">Còn hàng</span>
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-200 transition-all duration-300 pointer-events-none"></div>
      </div>
  );
};

export default ProductCard;