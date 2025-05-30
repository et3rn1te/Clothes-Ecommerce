import React from 'react';
import { Star, Shield, Truck, RotateCcw } from 'lucide-react';

const ProductInfo = ({ product }) => {
  if (!product) return null;

  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + '₫' || 'Liên hệ';
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      {product.brand && (
        <div className="flex items-center gap-3">
          {product.brand.logoUrl && (
            <img 
              src={product.brand.logoUrl} 
              alt={product.brand.name}
              className="w-8 h-8 object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {product.brand.name}
          </span>
        </div>
      )}

      {/* Product Name */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        
        {/* SKU */}
        {product.variants && product.variants[0]?.sku && (
          <p className="text-sm text-gray-500">
            SKU: {product.variants[0].sku}
          </p>
        )}
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {renderStars(product.averageRating || 0)}
          <span className="text-sm text-gray-600 ml-1">
            ({product.averageRating || 0}/5)
          </span>
        </div>
        <div className="h-4 w-px bg-gray-300"></div>
        <span className="text-sm text-gray-600">
          {product.reviewCount || 0} đánh giá
        </span>
        <div className="h-4 w-px bg-gray-300"></div>
        <span className="text-sm text-gray-600">
          Đã bán {product.soldCount || 0}
        </span>
      </div>

      {/* Categories */}
      {product.categories && product.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.categories.map((category) => (
            <span 
              key={category.id}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full"
            >
              {category.name}
            </span>
          ))}
        </div>
      )}

      {/* Gender */}
      {product.gender && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Giới tính:</span>
          <span className="text-sm font-medium text-gray-800 bg-gray-100 px-2 py-1 rounded">
            {product.gender.name}
          </span>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h3>
          <div className="text-gray-600 leading-relaxed">
            {product.description.length > 300 ? (
              <>
                <p>{product.description.substring(0, 300)}...</p>
                <button className="text-blue-600 hover:text-blue-700 mt-2 font-medium">
                  Xem thêm
                </button>
              </>
            ) : (
              <p>{product.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Miễn phí vận chuyển</p>
            <p className="text-sm text-gray-500">Đơn hàng từ 500k</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <RotateCcw className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Đổi trả dễ dàng</p>
            <p className="text-sm text-gray-500">Trong vòng 30 ngày</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Bảo hành chính hãng</p>
            <p className="text-sm text-gray-500">12 tháng</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800">Chất lượng cao</p>
            <p className="text-sm text-gray-500">Được kiểm định</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;