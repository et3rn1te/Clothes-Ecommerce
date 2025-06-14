import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { updateCartItem } from '../../API/CartService';
import { FavoriteContext } from '../../contexts/FavoriteContext.jsx';
import WishlistService from '../../API/WishlistService';

// URL hình ảnh placeholder tạm thời
const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/1080/1920';

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
      try {
        await updateCartItem({
          idUser: session.currentUser.id,
          action: true,
          idProduct: product.id,
          amount: 1
        }, session.token);
        // Dispatch event để cập nhật cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } catch (error) {
        console.error('Lỗi thêm vào giỏ hàng:', error);
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

  return (
    <div 
      className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group flex flex-col cursor-pointer h-full"
      onClick={handleProductClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleProductClick();
        }
      }}
    >
      {/* Hình ảnh sản phẩm và overlay cho icons */}
      <div className="relative w-full h-70 rounded-t-lg overflow-hidden">
        <img
          src={product?.primaryImage?.imageUrl || PLACEHOLDER_IMAGE_URL}
          alt={product?.primaryImage?.altText || product?.name || 'Product Image'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay và Icons */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Nút Thêm vào giỏ hàng */}
          <button 
            className="p-3 rounded-full bg-white text-gray-800 hover:bg-blue-900 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50"
            onClick={handleAddToCart}
            aria-label="Thêm vào giỏ hàng"
          >
            <FaShoppingCart className="h-6 w-6" />
          </button>
          {/* Nút Yêu thích */}
          <button 
            className={`p-3 rounded-full bg-white ${isFavorite ? 'text-red-600' : 'text-gray-800'} hover:bg-red-600 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50`}
            onClick={handleToggleWishlist}
            aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <FaHeart className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-5 w-full text-left flex flex-col flex-grow">
        {/* Tên sản phẩm */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product?.name || 'Tên sản phẩm'}
        </h3>
        {/* Thương hiệu */}
        <p className="text-sm text-gray-600 mb-3">{product?.brandName}</p>
        {/* Giá sản phẩm */}
        <p className="text-xl font-bold text-gray-900 mt-auto">
          {formatCurrency(product?.basePrice)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard; 