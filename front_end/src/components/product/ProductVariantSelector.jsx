import React, { useState, useEffect } from 'react';

const ProductVariantSelector = ({ product, onVariantChange }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);

  // Cập nhật danh sách size theo màu
  useEffect(() => {
    if (selectedColor) {
      const sizes = product.variants
        .filter(variant => variant.color.id === selectedColor.id)
        .map(variant => variant.size);
      setAvailableSizes(sizes);
    } else {
      setAvailableSizes([]);
    }
    setSelectedSize(null);
    onVariantChange(null);
  }, [selectedColor]);

  // Chọn variant
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = product.variants.find(
        v => v.color.id === selectedColor.id && v.size.id === selectedSize.id
      );
      onVariantChange(variant || null);
    }
  }, [selectedColor, selectedSize]);

  return (
    <div className="space-y-6">
      {/* Color Picker */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Màu sắc</h4>
        <div className="flex gap-3">
          {Array.from(new Set(product.variants.map(v => v.color.id)))
            .map(colorId => {
              const color = product.variants.find(v => v.color.id === colorId).color;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor?.id === color.id ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hexCode }}
                  title={color.name}
                />
              );
            })}
        </div>
      </div>

      {/* Size Picker */}
      {selectedColor && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Kích thước</h4>
          <div className="flex gap-3 flex-wrap">
            {availableSizes.map(size => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${
                  selectedSize?.id === size.id
                    ? 'bg-gray-800 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector;
