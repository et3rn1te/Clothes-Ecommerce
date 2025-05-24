import React, { useState, useEffect } from 'react';
import ProductService from '../../API/ProductService';
import ProductVariantService from '../../API/ProductVariantService';

const ProductInfo = ({ product, variants: initialVariants, onAddToCart, selectedColor, selectedSize, selectedVariant, onVariantSelectionChange }) => {
  const [quantity, setQuantity] = useState(1);
  const [variantsByColor, setVariantsByColor] = useState({});
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  useEffect(() => {
    if (initialVariants && initialVariants.length > 0) {
      const colorMap = {};
      const colors = new Set();

      initialVariants.forEach(variant => {
        const colorName = variant.color?.name || 'Default Color';
        const sizeName = variant.size?.name || 'Default Size';
        colors.add({ id: variant.color?.id, name: colorName });

        if (!colorMap[colorName]) {
          colorMap[colorName] = {};
        }
        colorMap[colorName][sizeName] = variant;
      });

      setVariantsByColor(colorMap);
      setAvailableColors(Array.from(colors).sort((a, b) => a.name.localeCompare(b.name)));
    }
  }, [initialVariants]);

  useEffect(() => {
    if (selectedColor && variantsByColor[selectedColor]) {
      const sizes = Object.keys(variantsByColor[selectedColor]).sort();
      setAvailableSizes(sizes);
    } else {
      setAvailableSizes([]);
    }
  }, [selectedColor, variantsByColor]);

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant]);

  const handleColorSelect = (colorName) => {
    const sizes = Object.keys(variantsByColor[colorName] || {}).sort();
    const newSize = sizes.length > 0 ? sizes[0] : null;
    const newVariant = (colorName && newSize) ? variantsByColor[colorName][newSize] : null;
    onVariantSelectionChange(colorName, newSize, newVariant);
  };

  const handleSizeSelect = (sizeName) => {
    const colorName = selectedColor;
    const newVariant = (colorName && sizeName) ? variantsByColor[colorName][sizeName] : null;
    onVariantSelectionChange(colorName, sizeName, newVariant);
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, selectedVariant?.stockQuantity || 1));
    setQuantity(newQuantity);
  };

  const handleAddToCartClick = () => {
    if (selectedVariant && quantity > 0) {
      onAddToCart({
        ...selectedVariant,
        quantity,
        product: {
          id: product.id,
          name: product.name,
          basePrice: product.basePrice,
          primaryImage: product.primaryImage
        }
      });
    } else {
      console.log('Please select a color and size.');
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const currentPrice = selectedVariant?.price !== undefined && selectedVariant?.price !== null ? selectedVariant.price : product.basePrice;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
        <div className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.632l6.632-3.316m0 9.948a3 3 0 110-5.996 3 3 0 010 5.996z" />
          </svg>
          Chia sẻ
        </div>
      </div>

      <div>
        <p className="text-3xl text-red-600 font-semibold">{formatPrice(currentPrice)}</p>
        {product.basePrice !== currentPrice && (
          <p className="text-lg text-gray-500 line-through">{formatPrice(product.basePrice)}</p>
        )}
        <div className="mt-2 text-sm text-green-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Freeship
        </div>
      </div>

      <div className="space-y-4 p-4 bg-gray-50 rounded-md">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Mã giảm giá</h3>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-white text-gray-500 text-sm">
              Mã:
            </span>
            <input type="text" value="GIAM30K" readOnly className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 text-sm" />
            <button className="ml-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600">Áp dụng</button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Khuyến mãi</h3>
          <div className="text-sm text-gray-600">
            <div className="flex items-center mb-1">
              <span className="inline-block bg-orange-500 text-white text-xs px-2 py-0.5 rounded mr-2">HOT</span>
              Tặng găng tay chống tia UV
            </div>
            <div className="flex items-center">
              <span className="inline-block bg-blue-500 text-white text-xs px-2 py-0.5 rounded mr-2">Ưu đãi</span>
              Mua 1 tặng 1 tất
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Màu sắc: <span className="font-semibold">{selectedColor || 'Chọn màu'}</span></h3>
        <div className="flex items-center space-x-3">
          {availableColors.map(color => (
            <button
              key={color.id || color.name}
              className={`w-8 h-8 rounded-full border-2 ${selectedColor === color.name ? 'ring-2 ring-blue-500 ring-offset-2' : 'border-gray-300'}`}
              style={{ backgroundColor: color.name.toLowerCase().replace(/s/g, '') }}
              aria-label={color.name}
              onClick={() => handleColorSelect(color.name)}
            >
            </button>
          ))}
        </div>
      </div>

      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Kích thước: <span className="font-semibold">{selectedSize || 'Chọn kích thước'}</span></h3>
          <a href="#" className="text-sm text-blue-600 hover:underline ml-auto">Hướng dẫn chọn size</a>
          <div className="flex items-center space-x-2 mt-2">
            {availableSizes.map(size => (
              <button
                key={size}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  selectedSize === size
                    ? 'bg-blue-600 text-white'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${!variantsByColor[selectedColor]?.[size]?.stockQuantity || variantsByColor[selectedColor][size].stockQuantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleSizeSelect(size)}
                disabled={!selectedColor || !variantsByColor[selectedColor]?.[size]?.stockQuantity || variantsByColor[selectedColor][size].stockQuantity <= 0}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedVariant && (
        <div className="flex items-center space-x-4 border-t border-gray-200 pt-6">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-3 py-1.5 text-gray-700 disabled:opacity-50"
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border-l border-r border-gray-300 focus:outline-none text-sm"
              readOnly
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= (selectedVariant?.stockQuantity || 1)}
              className="px-3 py-1.5 text-gray-700 disabled:opacity-50"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={!selectedVariant || quantity <= 0 || (selectedVariant?.stockQuantity || 0) < quantity}
            className={`flex-1 rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2
              ${selectedVariant && quantity > 0 && (selectedVariant?.stockQuantity || 0) >= quantity
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Thêm vào giỏ
          </button>
        </div>
      )}

      {selectedVariant && selectedVariant.stockQuantity !== undefined && (
        <p className="mt-2 text-sm text-gray-500">
          Còn {selectedVariant.stockQuantity} sản phẩm trong kho
        </p>
      )}

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-sm font-medium text-gray-900">Mô tả sản phẩm</h3>
        <div className="space-y-6 text-base text-gray-700 mt-2">
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo; 