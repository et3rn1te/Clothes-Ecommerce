import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Star, Heart, ShoppingBag } from 'lucide-react';
import ProductService from '../../API/ProductService';
import ColorFilter from '../../components/filters/ColorFilter';
import SizeFilter from '../../components/filters/SizeFilter';
import PriceFilter from '../../components/filters/PriceFilter';
import ProductCard from '../../components/product/ProductCard';
import Pagination from '../../components/common/Pagination';

// Currency formatter
const formatCurrency = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const ProductListPage = () => {
  const navigate = useNavigate();
  const { categorySlug } = useParams();

  // States
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
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Load initial data
  useEffect(() => {
    loadColors();
    loadSizes();
  }, []);

  // Load products when filters change
  useEffect(() => {
    loadProducts();
  }, [categorySlug, selectedColors, selectedSizes, priceRange, sortBy, currentPage, searchQuery]);

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
        maxPrice: priceRange.max,
        search: searchQuery
      };

      const response = await ProductService.getProductsByCategory(categorySlug, filters);
      const data = response.data;

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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadProducts();
  };

  const clearAllFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setCurrentPage(0);
  };

  const getActiveFiltersCount = () => {
    return selectedColors.length + selectedSizes.length +
        (priceRange.min || priceRange.max ? 1 : 0) +
        (searchQuery ? 1 : 0);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Bộ Sưu Tập Thời Trang
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Khám phá những xu hướng thời trang mới nhất với phong cách hiện đại và chất lượng cao
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="w-full lg:w-80">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/50 p-6 sticky top-6">
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Bộ Lọc</h3>
                    {getActiveFiltersCount() > 0 && (
                        <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                    )}
                  </div>
                  {getActiveFiltersCount() > 0 && (
                      <button
                          onClick={clearAllFilters}
                          className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Xóa tất cả
                      </button>
                  )}
                </div>

                {/* Search Filter */}
                <div className="mb-6">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all duration-200"
                    />
                  </form>
                </div>

                {/* Color Filter */}
                <div className="mb-6">
                  <ColorFilter
                      colors={colors}
                      selectedColors={selectedColors}
                      onColorSelect={handleColorFilter}
                  />
                </div>

                {/* Size Filter */}
                <div className="mb-6">
                  <SizeFilter
                      sizes={sizes}
                      selectedSizes={selectedSizes}
                      onSizeSelect={handleSizeFilter}
                  />
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <PriceFilter
                      priceRange={priceRange}
                      onPriceRangeChange={setPriceRange}
                      onPriceFilter={handlePriceFilter}
                  />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">
                      Hiển thị <span className="font-semibold text-gray-900">{pagination.totalElements}</span> sản phẩm
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${
                            viewMode === 'grid'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-amber-600'
                        }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${
                            viewMode === 'list'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-amber-600'
                        }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
                  >
                    <option value="createdAt,desc">Mới nhất</option>
                    <option value="basePrice,asc">Giá tăng dần</option>
                    <option value="basePrice,desc">Giá giảm dần</option>
                    <option value="name,asc">Tên A-Z</option>
                    <option value="name,desc">Tên Z-A</option>
                  </select>

                  {/* Mobile Filter Toggle */}
                  <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                  >
                    <Filter className="w-4 h-4" />
                    Lọc
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                  <div className="flex justify-center items-center py-20">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent absolute top-0"></div>
                    </div>
                  </div>
              )}

              {/* Products Grid */}
              {!loading && (
                  <div className={`grid gap-6 ${
                      viewMode === 'grid'
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                          : 'grid-cols-1'
                  }`}>
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onClick={handleProductClick}
                            viewMode={viewMode}
                        />
                    ))}
                  </div>
              )}

              {/* Empty State */}
              {!loading && products.length === 0 && (
                  <div className="text-center py-20">
                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <ShoppingBag className="w-12 h-12 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác để tìm thấy sản phẩm bạn mong muốn.
                    </p>
                    {getActiveFiltersCount() > 0 && (
                        <button
                            onClick={clearAllFilters}
                            className="mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                        >
                          Xóa tất cả bộ lọc
                        </button>
                    )}
                  </div>
              )}

              {/* Pagination */}
              {!loading && products.length > 0 && (
                  <div className="mt-12">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={setCurrentPage}
                    />
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductListPage;