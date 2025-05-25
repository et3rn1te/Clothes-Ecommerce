import { useState } from 'react';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductInfo from '../components/product/ProductInfo';
import ProductVariantSelector from '../components/product/ProductVariantSelector';
import { useCart } from '../hooks/useCart';

const ProductDetailPage = () => {
  const { product, loading, error } = useProductDetail();
  const { addToCart } = useCart();
  const [toast, setToast] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  const showToast = (title, description, status) => {
    setToast({ title, description, status });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedVariant) {
      showToast('Thông báo', 'Vui lòng chọn màu sắc và kích thước', 'warning');
      return;
    }

    if (selectedVariant.stockQuantity <= 0) {
      showToast('Thông báo', 'Sản phẩm này đã hết hàng', 'error');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: selectedVariant.price,
      image: product.images[0]?.imageUrl,
      variant: selectedVariant,
      quantity: 1,
    });

    showToast('Thành công', 'Đã thêm sản phẩm vào giỏ hàng', 'success');
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          toast.status === 'success' ? 'bg-green-100 text-green-800' :
          toast.status === 'error' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          <h3 className="font-bold">{toast.title}</h3>
          <p>{toast.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Phần hình ảnh sản phẩm */}
        <div>
          {loading ? (
            <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <ProductImageGallery 
              images={product?.images || []} 
              selectedColor={selectedVariant?.color}
            />
          )}
        </div>

        {/* Phần thông tin sản phẩm */}
        <div>
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse mt-8"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse mt-4"></div>
            </div>
          ) : (
            <div>
              <ProductInfo product={product} />
              
              <div className="mt-8">
                <ProductVariantSelector
                  product={product}
                  onVariantChange={handleVariantChange}
                />
              </div>

              <button
                className={`w-full mt-8 px-6 py-3 rounded-lg font-semibold text-white transition-colors
                  ${loading || !product || !product.active
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                onClick={handleAddToCart}
                disabled={loading || !product || !product.active}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 