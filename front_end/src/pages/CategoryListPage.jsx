import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CategoryService from '../API/CategoryService';

const CategoryListPage = () => {
  const { genderSlug } = useParams(); // Lấy genderSlug từ URL params
  const navigate = useNavigate(); // Hook để navigation
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tải danh mục theo giới tính
  const loadCategories = async (gender) => {
    try {
      setLoading(true);
      setError(null);
      const response = await CategoryService.getCategoriesByGenderSlug(gender);
      setCategories(response.data || []);
    } catch (err) {
      setError('Không thể tải danh mục. Vui lòng thử lại sau.');
      console.error('Lỗi khi tải danh mục:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effect để tải danh mục khi thay đổi giới tính từ URL
  useEffect(() => {
    if (genderSlug) {
      loadCategories(genderSlug);
    }
  }, [genderSlug]);

  // Xử lý click vào danh mục
  const handleCategoryClick = (categorySlug) => {
    navigate(`/collections/${categorySlug}`);
  };

  // Component CategoryCard
  const CategoryCard = ({ category, index }) => {
    // Tạo gradient màu khác nhau cho mỗi card
    const gradients = [
      'from-blue-400 to-blue-600',
      'from-gray-700 to-gray-900',
      'from-amber-400 to-orange-500',
      'from-purple-500 to-purple-700',
      'from-teal-400 to-cyan-600',
      'from-gray-600 to-gray-800'
    ];

    const gradient = gradients[index % gradients.length];

    return (
      <div
        className="group cursor-pointer"
        onClick={() => handleCategoryClick(category.slug)}
      >
        <div className={`aspect-square bg-gradient-to-br ${gradient} rounded-lg overflow-hidden relative transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg`}>
          {/* Placeholder cho hình ảnh sản phẩm */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-white bg-opacity-30 rounded"></div>
            </div>
          </div>

          {/* Overlay với hiệu ứng hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

          {/* Indicator khi hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
              Xem sản phẩm
            </div>
          </div>
        </div>

        {/* Tên danh mục */}
        <div className="mt-4 text-center">
          <h3 className="text-sm font-bold text-gray-900 tracking-wide group-hover:text-blue-600 transition-colors duration-200">
            {category.name}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => loadCategories(genderSlug)}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Thử lại
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy danh mục
            </h3>
            <p className="text-gray-600">
              Chưa có danh mục nào cho giới tính "{genderSlug}"
            </p>
          </div>
        ) : (
          <>
            {/* Grid danh mục - responsive 2-3-6 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryListPage;