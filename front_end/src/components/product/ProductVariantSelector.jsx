import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

const ProductVariantSelector = ({ variants, selectedColor, selectedSize, onVariantChange }) => {
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    if (variants && variants.length > 0) {
      // Extract unique colors
      const colors = variants.reduce((acc, variant) => {
        if (variant.color && !acc.find(c => c.id === variant.color.id)) {
          acc.push(variant.color);
        }
        return acc;
      }, []);
      setAvailableColors(colors);

      // Extract unique sizes
      const sizes = variants.reduce((acc, variant) => {
        if (variant.size && !acc.find(s => s.id === variant.size.id)) {
          acc.push(variant.size);
        }
        return acc;
      }, []);
      setAvailableSizes(sizes);
    }
  }, [variants]);

  useEffect(() => {
    // Find matching variant when color or size changes
    if (selectedColor && selectedSize && variants) {
      const variant = variants.find(v => 
        v.color?.name === selectedColor && v.size?.name === selectedSize
      );
      
      if (variant) {
        setSelectedVariant(variant);
        onVariantChange?.({
          color: selectedColor,
          size: selectedSize,
          variant: variant
        });
      }
    }
  }, [selectedColor, selectedSize, variants, onVariantChange]);

  const handleColorSelect = (color) => {
    const newSelectedColor = color.name;
    
    // Find available sizes for this color
    const sizesForColor = variants
      .filter(v => v.color?.name === newSelectedColor)
      .map(v => v.size?.name)
      .filter(Boolean);

    // If current selected size is not available for this color, select first available
    const newSelectedSize = sizesForColor.includes(selectedSize) 
      ? selectedSize 
      : sizesForColor[0];

    const variant = variants.find(v => 
      v.color?.name === newSelectedColor && v.size?.name === newSelectedSize
    );

    if (variant) {
      setSelectedVariant(variant);
      onVariantChange?.({
        color: newSelectedColor,
        size: newSelectedSize,
        variant: variant
      });
    }
  };

  const handleSizeSelect = (size) => {
    const newSelectedSize = size.name;
    
    // Find available colors for this size
    const colorsForSize = variants
      .filter(v => v.size?.name === newSelectedSize)
      .map(v => v.color?.name)
      .filter(Boolean);

    // If current selected color is not available for this size, select first available
    const newSelectedColor = colorsForSize.includes(selectedColor) 
      ? selectedColor 
      : colorsForSize[0];

    const variant = variants.find(v => 
      v.color?.name === newSelectedColor && v.size?.name === newSelectedSize
    );

    if (variant) {
      setSelectedVariant(variant);
      onVariantChange?.({
        color: newSelectedColor,
        size: newSelectedSize,
        variant: variant
      });
    }
  };

  const isColorAvailable = (color) => {
    return variants.some(v => 
      v.color?.name === color.name && 
      v.stockQuantity > 0 && 
      v.active
    );
  };

  const isSizeAvailable = (size) => {
    return variants.some(v => 
      v.size?.name === size.name && 
      v.stockQuantity > 0 && 
      v.active &&
      (!selectedColor || v.color?.name === selectedColor)
    );
  };

  const getStockForCurrentSelection = () => {
    if (selectedVariant) {
      return selectedVariant.stockQuantity;
    }
    return 0;
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return 'Liên hệ';
    }
    return price.toLocaleString('vi-VN') + '₫';
  };

  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-100">
      {/* Color Selection */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Màu sắc</h3>
            {selectedColor && (
              <span className="text-sm text-gray-600">
                Đã chọn: <span className="font-medium">{selectedColor}</span>
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const isSelected = selectedColor === color.name;
              const isAvailable = isColorAvailable(color);
              
              return (
                <button
                  key={color.id}
                  onClick={() => isAvailable && handleColorSelect(color)}
                  disabled={!isAvailable}
                  className={`relative w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-gray-800 scale-110 shadow-lg'
                      : isAvailable
                      ? 'border-gray-300 hover:border-gray-400 hover:scale-105'
                      : 'border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                  style={{ backgroundColor: color.hexCode || '#cccccc' }}
                  title={`${color.name} ${!isAvailable ? '(Hết hàng)' : ''}`}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check 
                        size={16} 
                        className={color.hexCode === '#000000' || color.hexCode === '#FFFFFF' 
                          ? (color.hexCode === '#000000' ? 'text-white' : 'text-black')
                          : 'text-white'
                        } 
                      />
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-0.5 bg-red-500 rotate-45"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Kích thước</h3>
            {selectedSize && (
              <span className="text-sm text-gray-600">
                Đã chọn: <span className="font-medium">{selectedSize}</span>
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size.name;
              const isAvailable = isSizeAvailable(size);
              
              return (
                <button
                  key={size.id}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 ${
                    isSelected
                      ? 'border-gray-800 bg-gray-800 text-white shadow-lg'
                      : isAvailable
                      ? 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                  title={!isAvailable ? 'Hết hàng' : ''}
                >
                  {size.name}
                  {!isAvailable && (
                    <span className="ml-1 text-xs">(Hết)</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Giá:</span>
              <span className="ml-2 font-semibold text-red-600">
                {formatPrice(selectedVariant.price)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tồn kho:</span>
              <span className={`ml-2 font-semibold ${
                getStockForCurrentSelection() > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {getStockForCurrentSelection()} sản phẩm
              </span>
            </div>
            {selectedVariant.weightInKg && (
              <div>
                <span className="text-gray-600">Trọng lượng:</span>
                <span className="ml-2 text-gray-800">
                  {selectedVariant.weightInKg}kg
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600">SKU:</span>
              <span className="ml-2 text-gray-800 font-mono text-xs">
                {selectedVariant.sku || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Size Guide */}
      <div className="pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          📏 Hướng dẫn chọn size
        </button>
      </div>
    </div>
  );
};

export default ProductVariantSelector;