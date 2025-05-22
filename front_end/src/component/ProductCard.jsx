import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  if (!product) return null;
  const handleProductClick = () => navigate(`/product_detail/${product.id}`);
  const handleAddToCart = (e) => { e.stopPropagation(); };
  return (
    <div
      className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer flex flex-col border border-gray-100"
      onClick={handleProductClick}
    >
      <img
        src={product.images?.[0]?.url || '/api/placeholder/400/320'}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-gray-500 mb-2 text-sm">{product.brand}</p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-red-500">{formatPrice(product.price)}</span>
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-red-500 transition"
            onClick={handleAddToCart}
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;