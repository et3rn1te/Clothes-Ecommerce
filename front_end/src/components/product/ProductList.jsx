import React, { useState, useEffect } from 'react';
import ProductCard from '../common/ProductCard';
import Pagination from '../common/Pagination';
import ProductService from '../../API/ProductService';

const ProductList = ({ 
  title, 
  fetchFunction, 
  fetchParams = {}, 
  itemsPerPage = 12 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, fetchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchFunction({
        ...fetchParams,
        page: currentPage,
        size: itemsPerPage,
        sort: 'name,asc'
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={fetchProducts}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {title && (
        <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ProductList; 