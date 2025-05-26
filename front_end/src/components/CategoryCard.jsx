import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

// URL hình ảnh placeholder tạm thời
const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/1080/1920';

const CategoryCard = ({ category, genderSlug }) => {
  return (
    <Link 
      to={`/${genderSlug}/${category.slug}`}
      className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group flex flex-col cursor-pointer h-full"
    >
      {/* Hình ảnh danh mục và overlay */}
      <div className="relative w-full h-80 rounded-t-xl overflow-hidden">
        <img
          src={category?.imageUrl || PLACEHOLDER_IMAGE_URL}
          alt={category?.name || 'Category Image'}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {/* Overlay và Icon */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="p-3 rounded-full bg-white text-gray-800 hover:bg-blue-900 hover:text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50">
            <FaArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Thông tin danh mục */}
      <div className="p-4 w-full text-left flex flex-col flex-grow">
        {/* Tên danh mục */}
        <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
          {category?.name || 'Tên danh mục'}
        </h3>
        
        {/* Mô tả danh mục (nếu có) */}
        {category?.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {category.description}
          </p>
        )}

        {/* Badge số lượng sản phẩm */}
        {category?.productCount > 0 && (
          <div className="mt-auto pt-2">
            <span className="inline-block bg-blue-100 text-blue-900 text-sm font-medium px-3 py-1 rounded-full">
              {category.productCount} sản phẩm
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard; 