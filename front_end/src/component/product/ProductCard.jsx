import React from "react";
import { FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product }) => {
  // Format price with proper currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  // Handle the case when product doesn't have all expected properties
  if (!product) return null;

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        {/* Use the first image from images array if available, otherwise use a placeholder */}
        <img
          src={product.images && product.images.length > 0 ? product.images[0].url : "/api/placeholder/400/320"}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <div className="flex justify-between items-center">
          <div className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </div>
          <button className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;