import { useVariantSelection } from '../../hooks/useVariantSelection';

const ProductVariantSelector = ({ product, onVariantChange }) => {
  const {
    selectedColor,
    selectedSize,
    availableSizes,
    handleColorChange,
    handleSizeChange,
    isVariantAvailable,
    selectedVariant,
    isLoading
  } = useVariantSelection(product, onVariantChange);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Lấy danh sách màu sắc duy nhất từ các biến thể
  const uniqueColors = Array.from(new Set(
    product.variants
      .filter(v => v.active)
      .map(v => JSON.stringify(v.color))
  )).map(str => JSON.parse(str));

  return (
    <div className="space-y-6">
      {/* Chọn màu sắc */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Màu sắc
        </h3>
        <div className="flex flex-wrap gap-2">
          {uniqueColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorChange(color)}
              className={`relative p-1 rounded-full border-2 ${
                selectedColor?.id === color.id
                  ? 'border-blue-500'
                  : 'border-transparent'
              }`}
              disabled={!color.available}
            >
              <span
                className="block w-8 h-8 rounded-full"
                style={{ backgroundColor: color.hexCode }}
                title={color.name}
              />
              {!color.available && (
                <span className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chọn kích thước */}
      {availableSizes.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Kích thước
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeChange(size)}
                disabled={!isVariantAvailable(selectedColor, size)}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  selectedSize?.id === size.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${
                  !isVariantAvailable(selectedColor, size)
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Thông tin biến thể đã chọn */}
      {selectedVariant && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Đã chọn: {selectedColor?.name} - {selectedSize?.name}
              </p>
              <p className="text-sm font-medium text-gray-900">
                Mã biến thể: {selectedVariant.sku}
              </p>
            </div>
            <p className="text-sm font-medium text-gray-900">
              Số lượng: {selectedVariant.stockQuantity}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariantSelector; 