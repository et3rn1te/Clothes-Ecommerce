import React, { useState, useEffect } from 'react';
import ProductService from '../../API/ProductService';
import ProductCard from '../common/ProductCard';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductService.getFeaturedProducts({
        page: 0,
        size: 8,
        sort: 'createdAt,desc'
      });
      setProducts(response.data.content);
      setError(null);
    } catch (err) {
      setError('Không thể tải sản phẩm nổi bật');
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchFeaturedProducts}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Sản phẩm nổi bật
        </h2>
        
        {products.length === 0 ? (
          <p className="text-center text-gray-500">Không có sản phẩm nổi bật</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedProducts; 