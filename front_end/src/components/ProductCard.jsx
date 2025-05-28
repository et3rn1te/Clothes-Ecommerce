import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa'; // Import icons
import { updateCartItem } from '../API/CartService';
import { FavoriteContext } from './FavoriteContext/FavoriteContext';

// URL hình ảnh placeholder tạm thời
const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/1080/1920';

function ProductCard({ product }) {
  const session = JSON.parse(localStorage.getItem("session"));
  const { addToWishlist} = useContext(FavoriteContext);
  const navigate = useNavigate();
  // Đảm bảo product và basePrice tồn tại trước khi định dạng
  const formattedPrice = product?.basePrice != null ? product.basePrice.toLocaleString('vi-VN') : 'Đang cập nhật';

  const handleProductClick = () => {
    if (product?.id) {
      navigate(`/product/${product.slug}`);
    }
  };

  const handleAddToCart =async (e,idProduct) => {
    e.stopPropagation();
    // TODO: Implement add to cart
    await updateCartItem({
      idUser: session.currentUser.id,
      action: true,
      idProduct: idProduct,
      amount: 1
    },session.token);
  };

  const handleAddToWishlist = (e,idProduct) => {
    e.stopPropagation();
    addToWishlist(idProduct);
    // TODO: Implement add to wishlist
  };

  return (
    <div 
      className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group flex flex-col cursor-pointer h-full"
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
      <div className="relative w-full h-80 rounded-t-xl overflow-hidden">
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
            onClick={(e)=> handleAddToCart(e,product.id)}
            aria-label="Thêm vào giỏ hàng"
          >
            <FaShoppingCart className="h-6 w-6" />
          </button>
          {/* Nút Yêu thích */}
          <button 
            className="p-3 rounded-full bg-white text-red-600 hover:bg-red-700 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
            onClick={(e)=> handleAddToWishlist(e,product.id)}
            aria-label="Thêm vào yêu thích"
          >
             <FaHeart className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 w-full text-left flex flex-col flex-grow">
        {/* Tên sản phẩm */}
        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">{product?.name || 'Tên sản phẩm'}</h3>
        {/* Giá sản phẩm */}
        <p className="text-lg font-bold text-gray-900 mt-auto">{formattedPrice} VNĐ</p>
      </div>

      {/* Thêm các chi tiết khác như màu sắc, kích thước sau */}
       {/* Ví dụ placeholder cho màu sắc */}
       {/* <div className="flex space-x-1 mt-2 px-4 pb-2 w-full justify-center">
         <div className="w-4 h-4 rounded-full bg-red-500"></div>
         <div className="w-4 h-4 rounded-full bg-blue-500"></div>
         <div className="w-4 h-4 rounded-full bg-green-500"></div>
       </div> */}
    </div>
  );
}

export default ProductCard; 