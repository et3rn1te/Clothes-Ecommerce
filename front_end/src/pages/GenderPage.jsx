import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryCarousel from '../components/CategoryCarousel';
import GenderService from '../API/GenderService';

const GenderPage = () => {
  const { genderSlug } = useParams();
  const [categoriesByParent, setCategoriesByParent] = useState({});
  const [genderInfo, setGenderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy thông tin giới tính
        const genderResponse = await GenderService.getGenderBySlug(genderSlug);
        setGenderInfo(genderResponse.data.result);

        // Lấy TẤT CẢ danh mục theo giới tính
        const categoriesResponse = await GenderService.getCategoriesByGenderSlug(genderSlug);
        const allCategories = categoriesResponse.data;

        // Nhóm danh mục con theo danh mục cha
        const parentCategories = allCategories.filter(cat => cat.parentId === null);
        const groupedCategories = {};

        parentCategories.forEach(parentCat => {
          groupedCategories[parentCat.id] = {
            ...parentCat,
            subCategories: allCategories.filter(cat => cat.parentId === parentCat.id)
          };
        });

        setCategoriesByParent(groupedCategories);

      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genderSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const parentCategoryIds = Object.keys(categoriesByParent);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            {genderInfo?.name || 'Danh mục sản phẩm'}
          </h1>
          {genderInfo?.description && (
            <p className="text-gray-300 max-w-2xl">
              {genderInfo.description}
            </p>
          )}
        </div>
      </div>

      {/* Categories Carousels */}
      <div className="container mx-auto py-8">
        {parentCategoryIds.map(parentId => {
          const parentCat = categoriesByParent[parentId];
          return (
            <CategoryCarousel
              key={parentCat.id}
              title={parentCat.name}
              categories={parentCat.subCategories}
              genderSlug={genderSlug}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GenderPage; 