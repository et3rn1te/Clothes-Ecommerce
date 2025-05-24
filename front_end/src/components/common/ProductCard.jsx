import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get image URL from primaryImage with placeholder fallback
  const getImageUrl = () => {
    if (product.primaryImage?.imageUrl) {
      return product.primaryImage.imageUrl;
    }
    return 'https://via.placeholder.com/600x800?text=No+Image'; // Using a placeholder service
  };

  // Get unique colors from product variants
  const getUniqueColors = () => {
    if (!product.variants || product.variants.length === 0) return [];
    
    // Create a Map to store unique colors by their ID
    const uniqueColorsMap = new Map();
    
    product.variants.forEach(variant => {
      if (variant.color && variant.active) {
        uniqueColorsMap.set(variant.color.id, variant.color);
      }
    });
    
    // Convert Map values to array and sort by name
    return Array.from(uniqueColorsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const uniqueColors = getUniqueColors();

  // Get available sizes from product variants
  const getAvailableSizes = () => {
    if (!product.variants || product.variants.length === 0) return [];
    
    // Create a Map to store unique sizes by their ID
    const uniqueSizesMap = new Map();
    
    product.variants.forEach(variant => {
      if (variant.size && variant.active && variant.stockQuantity > 0) {
        uniqueSizesMap.set(variant.size.id, {
          id: variant.size.id,
          name: variant.size.name,
          available: true,
          variantId: variant.id
        });
      }
    });
    
    // Convert Map values to array and sort by size name
    return Array.from(uniqueSizesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  const availableSizes = getAvailableSizes();

  // Placeholder data structure for colors and sizes (ASSUMING BACKEND PROVIDES THIS IN ProductSummary)
  // You will need to replace this with actual data from your product prop
  const placeholderColors = product.colors || [
    { id: 1, name: 'Light Gray', hexCode: '#D3D3D3' },
    { id: 2, name: 'Brown', hexCode: '#A52A2A' },
    { id: 3, name: 'Black', hexCode: '#000000' },
  ].filter(color => color.name.toLowerCase() === 'light gray' || color.name.toLowerCase() === 'brown' || color.name.toLowerCase() === 'black'); // Basic filtering based on placeholder names

  // Assuming product might have a simplified list of available sizes or variants
  // You will need to map your actual variant data to get available sizes and their stock
  const placeholderAvailableSizes = [
    { size: 'S', available: true },
    { size: 'M', available: true },
    { size: 'XL', available: true },
    { size: '2XL', available: true },
    { size: '3XL', available: true },
    // { size: 'L', available: false }, // Example of unavailable size
  ];

  // State to manage the visibility of the quick add overlay on hover
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transform transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ảnh sản phẩm */}
      <Link
        to={`/products/${product.slug}`}
        className="w-full h-72 overflow-hidden bg-gray-200"
      >
        <img
          src={getImageUrl()}
          alt={product.primaryImage?.altText || product.name}
          className="h-full w-full object-cover object-center"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/600x800?text=Error'; // Placeholder for error
          }}
        />
        {/* Quick Add Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 opacity-75 transition-opacity duration-300">
            <div className="text-center">
              <p className="text-white text-sm font-semibold mb-4">Thêm nhanh vào giỏ hàng +</p>
              <div className="grid grid-cols-3 gap-2">
                {availableSizes.map(sizeInfo => (
                  <button
                    key={sizeInfo.id}
                    className="px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // TODO: Implement quick add to cart logic here
                      console.log(`Quick add ${product.name} size ${sizeInfo.name} (variant: ${sizeInfo.variantId})`);
                    }}
                  >
                    {sizeInfo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Link>

      {/* Thông tin sản phẩm và màu sắc */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        {/* Color Swatches */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center space-x-1 mb-2">
            {uniqueColors.map(color => (
              <div
                key={color.id}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: color.hexCode || color.name.toLowerCase() }}
                title={color.name}
              ></div>
            ))}
          </div>
        )}

        {/* Product Name */}
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-medium text-gray-900 hover:underline"
        >
          {product.name}
        </Link>

        {/* Giá */}
        <div className="flex items-center">
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(product.basePrice)}
          </p>
          {/* You might add a compare at price here if available */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 