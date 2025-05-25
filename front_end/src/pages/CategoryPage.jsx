import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ProductService from '../API/ProductService';
import CategoryService from '../API/CategoryService';
import ProductCard from '../components/ProductCard';

function CategoryPage() {
  const { genderSlug, categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin danh mục
        const categoryResponse = await CategoryService.getCategoryBySlug(categorySlug);
        setCategory(categoryResponse.data);

        // Lấy danh sách sản phẩm theo danh mục
        const page = searchParams.get('page') || 0;
        const size = searchParams.get('size') || 12;
        const sort = searchParams.get('sort') || 'createdAt,desc';

        const productsResponse = await ProductService.getProductsByCategory(
          categorySlug,
          genderSlug,
          page,
          size,
          sort
        );
        setProducts(productsResponse.data.content);
      } catch (err) {
        setError('Không thể tải dữ liệu danh mục và sản phẩm.');
        console.error('Error fetching category and products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (genderSlug && categorySlug) {
      fetchCategoryAndProducts();
    }
  }, [genderSlug, categorySlug, searchParams]);

  if (loading) {
    return <div className="loading text-center py-8 text-xl font-semibold">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error text-center text-red-500 py-8 text-xl font-semibold">Lỗi: {error}</div>;
  }

  return (
    <div className="category-page container mx-auto px-4 py-8">
      {/* Header của trang danh mục */}
      <div className="category-header mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category?.name}</h1>
        <p className="text-gray-600">{category?.description}</p>
      </div>

      {/* Grid sản phẩm */}
      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Thông báo khi không có sản phẩm */}
      {products.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy sản phẩm nào trong danh mục này.
        </div>
      )}
    </div>
  );
}

export default CategoryPage; 