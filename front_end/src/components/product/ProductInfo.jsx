import { formatCurrency } from '../../utils/format';

const ProductInfo = ({ product }) => {
  if (!product) return null;

  const {
    name,
    basePrice,
    brand,
    gender,
    categories,
    description,
    variants,
    featured,
    active
  } = product;

  // Tính giá thấp nhất và cao nhất từ các biến thể
  const prices = variants
    .filter(v => v.active)
    .map(v => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const hasPriceRange = minPrice !== maxPrice;

  return (
    <div className="space-y-6">
      {/* Tên sản phẩm */}
      <h1 className="text-3xl font-bold text-gray-900">
        {name}
      </h1>

      {/* Thương hiệu và danh mục */}
      <div className="flex flex-wrap gap-2">
        {brand && (
          <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
            {brand.name}
          </span>
        )}
        {categories?.map(category => (
          <span key={category.id} className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
            {category.name}
          </span>
        ))}
        {gender && (
          <span className="px-3 py-1 text-sm font-medium text-purple-800 bg-purple-100 rounded-full">
            {gender.name}
          </span>
        )}
        {featured && (
          <span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
            Nổi bật
          </span>
        )}
      </div>

      {/* Giá sản phẩm */}
      <div>
        {hasPriceRange ? (
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
            </span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(minPrice)}
          </span>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* Mã sản phẩm và trạng thái */}
      <div className="flex justify-between items-center">
        <span className="text-gray-600">
          Mã sản phẩm: {variants[0]?.sku}
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
          active 
            ? 'text-green-800 bg-green-100' 
            : 'text-red-800 bg-red-100'
        }`}>
          {active ? 'Còn hàng' : 'Hết hàng'}
        </span>
      </div>

      {/* Mô tả sản phẩm */}
      {description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Mô tả sản phẩm
          </h3>
          <p className="text-gray-600 whitespace-pre-line">
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductInfo; 