import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ProductService from '../API/ProductService';

// Currency formatter
const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const ProductListPage = () => {
  
  const navigate = useNavigate();
  
  // States
  const { categorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 12,
    totalElements: 0,
    totalPages: 0,
    last: false
  });

  // Filter states
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [currentPage, setCurrentPage] = useState(0);

  // Load initial data
  useEffect(() => {
    loadColors();
    loadSizes();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [categorySlug, selectedColors, selectedSizes, priceRange, sortBy, currentPage]);

  const loadColors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/colors');
      const data = await response.json();
      setColors(data);
    } catch (error) {
      console.error('Error loading colors:', error);
    }
  };

  const loadSizes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sizes');
      const data = await response.json();
      setSizes(data);
    } catch (error) {
      console.error('Error loading sizes:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const filters = {
        page: currentPage,
        size: pagination.pageSize,
        sort: sortBy,
        colorIds: selectedColors,
        sizeIds: selectedSizes,
        minPrice: priceRange.min,
        maxPrice: priceRange.max
      };

      const response = await ProductService.getProductsByCategory(categorySlug, filters);
      const data = response.data;
      console.log(data);

      setProducts(data.content);
      setPagination({
        pageNo: data.pageNo,
        pageSize: data.pageSize,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        last: data.last
      });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorFilter = (colorId) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    );
    setCurrentPage(0);
  };

  const handleSizeFilter = (sizeId) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    );
    setCurrentPage(0);
  };

  const handlePriceFilter = (min, max) => {
    setPriceRange({ min, max });
    setCurrentPage(0);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(0);
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Màu sắc
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorFilter(color.id)}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color.id)
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-300'
                      } transition-all duration-200`}
                    style={{ backgroundColor: color.hexCode }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Size
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => handleSizeFilter(size.id)}
                    className={`px-3 py-2 text-sm border rounded ${selectedSizes.includes(size.id)
                      ? 'border-gray-800 bg-gray-800 text-white'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      } transition-colors duration-200`}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Giá
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  />
                </div>
                <button
                  onClick={() => handlePriceFilter(priceRange.min, priceRange.max)}
                  className="w-full px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {/* Quick Price Filters */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Khoảng giá
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Dưới 300k', min: '', max: '300000' },
                  { label: '300k - 500k', min: '300000', max: '500000' },
                  { label: 'Trên 500k', min: '500000', max: '' }
                ].map((range, index) => (
                  <button
                    key={index}
                    onClick={() => handlePriceFilter(range.min, range.max)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
              <p className="text-gray-600">{pagination.totalElements} sản phẩm</p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
              >
                <option value="createdAt,desc">Mới nhất</option>
                <option value="basePrice,asc">Giá tăng dần</option>
                <option value="basePrice,desc">Giá giảm dần</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            </div>
          )}

          {/* Product Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.slug)}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.primaryImage?.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.featured && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        New Arrival
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{product.brandName}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(product.basePrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>

                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = currentPage <= 2 ? i : currentPage - 2 + i;
                  if (page >= pagination.totalPages) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border text-sm rounded ${currentPage === page
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {page + 1}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={pagination.last}
                  className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;