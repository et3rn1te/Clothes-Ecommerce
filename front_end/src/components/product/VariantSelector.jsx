import React, { useState, useEffect } from 'react';
import ProductVariantService from '../../API/ProductVariantService';

const VariantSelector = ({ productId, variants, onVariantSelect }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [error, setError] = useState(null);

  // Lấy danh sách màu sắc và kích thước từ variants
  const colors = [...new Set(variants.map(v => v.color?.name || v.color))];
  const allSizes = [...new Set(variants.map(v => v.size?.name || v.size))];

  useEffect(() => {
    if (selectedColor) {
      // Lọc kích thước có sẵn cho màu đã chọn
      const sizesForColor = variants
        .filter(v => (v.color?.name || v.color) === selectedColor && v.stock > 0)
        .map(v => v.size?.name || v.size);
      setAvailableSizes(sizesForColor);
      
      // Reset kích thước đã chọn nếu không có sẵn
      if (!sizesForColor.includes(selectedSize)) {
        setSelectedSize(null);
      }
    } else {
      setAvailableSizes([]);
      setSelectedSize(null);
    }
  }, [selectedColor, variants]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setError(null);
  };

  const handleSizeSelect = async (size) => {
    setSelectedSize(size);
    setError(null);

    try {
      // Tìm variant tương ứng
      const variant = variants.find(
        v => (v.color?.name || v.color) === selectedColor && (v.size?.name || v.size) === size
      );

      if (variant) {
        onVariantSelect(variant);
      }
    } catch (err) {
      setError('Không thể chọn biến thể này. Vui lòng thử lại.');
      console.error('Error selecting variant:', err);
    }
  };

  // Hàm helper để lấy mã màu
  const getColorCode = (colorName) => {
    // Map tên màu sang mã màu
    const colorMap = {
      'Đỏ': '#FF0000',
      'Xanh dương': '#0000FF',
      'Xanh lá': '#00FF00',
      'Đen': '#000000',
      'Trắng': '#FFFFFF',
      'Vàng': '#FFFF00',
      'Hồng': '#FFC0CB',
      'Tím': '#800080',
      'Cam': '#FFA500',
      'Nâu': '#A52A2A',
      'Xám': '#808080',
      'Be': '#F5F5DC'
    };

    return colorMap[colorName] || '#CCCCCC'; // Màu mặc định nếu không tìm thấy
  };

  return (
    <div className="space-y-6">
      {/* Chọn màu sắc */}
      <div>
        <h3 className="text-sm font-medium text-gray-900">Màu sắc</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`relative rounded-full p-1 ${
                selectedColor === color
                  ? 'ring-2 ring-blue-500'
                  : 'hover:opacity-75'
              }`}
              title={color}
            >
              <span className="block h-8 w-8 rounded-full border border-gray-300 bg-white">
                <span
                  className="block h-full w-full rounded-full"
                  style={{ backgroundColor: getColorCode(color) }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chọn kích thước */}
      {selectedColor && (
        <div>
          <h3 className="text-sm font-medium text-gray-900">Kích thước</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {allSizes.map((size) => {
              const isAvailable = availableSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`relative rounded-md px-3 py-2 text-sm font-medium ${
                    selectedSize === size
                      ? 'bg-blue-500 text-white'
                      : isAvailable
                      ? 'bg-white text-gray-900 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  } border border-gray-300`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Thông báo lỗi */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Hướng dẫn chọn */}
      {!selectedColor && (
        <p className="text-sm text-gray-500">Vui lòng chọn màu sắc</p>
      )}
      {selectedColor && !selectedSize && (
        <p className="text-sm text-gray-500">Vui lòng chọn kích thước</p>
      )}
    </div>
  );
};

export default VariantSelector; 