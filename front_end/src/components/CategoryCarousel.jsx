import React, { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CategoryCard from './CategoryCard';

const CategoryCarousel = ({ title, categories, genderSlug }) => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = 300; // Adjust scroll amount as needed
    if (carouselRef.current) {
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  if (!categories || categories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <div className="mb-8">
      {/* Tiêu đề danh mục cha */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 px-6">{title}</h2>

      <div className="relative">
        {/* Nút cuộn trái */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors duration-300 z-10 ml-3"
          aria-label="Cuộn sang trái"
        >
          <FaChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        {/* Danh sách cuộn ngang */}
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto custom-scrollbar py-4 px-6"
        >
          {categories.map((category) => (
            <div key={category.id} className="flex-none w-64">
              <CategoryCard category={category} genderSlug={genderSlug} />
            </div>
          ))}
        </div>

        {/* Nút cuộn phải */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-colors duration-300 z-10 mr-3"
          aria-label="Cuộn sang phải"
        >
          <FaChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default CategoryCarousel; 