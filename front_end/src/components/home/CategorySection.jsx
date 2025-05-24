import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from '../../API/CategoryService';

const CategorySection = () => {
  // State for fetching categories
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for active parent category (using placeholder IDs)
  // *** IMPORTANT: Replace these placeholder IDs (1 and 2) with actual IDs from your database ***
  const PARENT_CATEGORY_MEN_ID = 1; 
  const PARENT_CATEGORY_WOMEN_ID = 2;

  const [activeParentCategoryId, setActiveParentCategoryId] = useState(PARENT_CATEGORY_MEN_ID); // Default to ĐỒ NAM

  // Effect to fetch subcategories when activeParentCategoryId changes
  useEffect(() => {
    fetchSubCategories(activeParentCategoryId);
  }, [activeParentCategoryId]); // Dependency array includes activeParentCategoryId

  // Function to fetch subcategories
  const fetchSubCategories = async (parentId) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await CategoryService.getSubCategoriesByParentId(parentId);
      setSubCategories(response.data); // Assuming response.data is the list of subcategories
    } catch (err) {
      setError("Không thể tải danh mục con. Vui lòng thử lại sau.");
      console.error("Error fetching subcategories:", err);
      setSubCategories([]); // Clear subcategories on error
    } finally {
      setLoading(false);
    }
  };

  // Removed static productTypes data
  // const productTypes = [ ... ];

  // --- Rendering Logic ---

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-24 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          {/* Optionally add a retry button */}
          <button
            onClick={() => fetchSubCategories(activeParentCategoryId)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (subCategories.length === 0 && !loading) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">Không có danh mục con nào</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Category Tabs */}
        <div className="flex justify-center space-x-6 mb-12">
          <button
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 ${
              activeParentCategoryId === PARENT_CATEGORY_MEN_ID
                ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveParentCategoryId(PARENT_CATEGORY_MEN_ID)}
          >
            ĐỒ NAM
          </button>
          <button
            className={`px-8 py-3 rounded-full font-semibold text-lg transition-colors duration-300 ${
              activeParentCategoryId === PARENT_CATEGORY_WOMEN_ID
                ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveParentCategoryId(PARENT_CATEGORY_WOMEN_ID)}
          >
            ĐỒ NỮ
          </button>
        </div>

        {/* Product Types Grid - Displaying fetched subcategories */} 
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {subCategories.map((category, index) => (
            <Link
              // Assuming category object has 'id', 'name', 'imageUrl' properties
              // Update link to use the new URL structure /category/{category.name}
              to={`/category/${encodeURIComponent(category.name.toLowerCase())}`}
              key={category.id || index} // Use category.id as key if available
              className="block text-center group cursor-pointer"
            >
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-100 mb-4">
                {/* Use actual category image URL */} 
                {category.imageUrl && (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {/* Fallback or placeholder if no image */} 
                {!category.imageUrl && (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-medium">
                        {category.name}
                    </div>
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;