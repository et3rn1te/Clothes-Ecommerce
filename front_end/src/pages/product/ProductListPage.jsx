import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import ProductService from '../../API/ProductService';
import ProductCard from '../../components/common/ProductCard';
import Pagination from '../../components/common/Pagination';
import CategoryService from '../../API/CategoryService';

const ProductListPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state for subcategories
  const [subcategories, setSubcategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);

  const navigate = useNavigate();

  // Effect to fetch current category details and subcategories
  useEffect(() => {
      const fetchCategoryDetails = async () => {
          if (slug) {
              try {
                  const categoryResponse = await CategoryService.getCategoryBySlug(slug);
                  const category = categoryResponse.data;
                  setCurrentCategory(category);

                  // If it's a parent category (check if it has subcategories or no parent itself)
                  if (category && !category.parentId) { 
                       // Fetch subcategories
                       const subcategoriesResponse = await CategoryService.getSubCategoriesByParentId(category.id);
                       // Add placeholder images if your backend doesn't provide them directly
                       const subcategoriesWithImages = subcategoriesResponse.data.map(subcat => ({
                           ...subcat,
                           // Replace with actual image URL from backend if available
                           imageUrl: subcat.imageUrl || 'https://via.placeholder.com/150x150?text=' + encodeURIComponent(subcat.name)
                       }));
                       setSubcategories(subcategoriesWithImages);
                   } else {
                       setSubcategories([]); 
                   }

              } catch (err) {
                  console.error('Error fetching category details or subcategories:', err);
                  setSubcategories([]);
                  setCurrentCategory(null);
              }
          }
      };

      fetchCategoryDetails();
  }, [slug]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseParams = {
        page: currentPage,
        size: 12,
      };

      let response;
      if (slug) {
        // Use the category slug to fetch products
        const category = await CategoryService.getCategoryBySlug(slug);
        response = await ProductService.getProductsByCategory(category.data.id, baseParams);
      } else {
        response = await ProductService.getAllProducts(baseParams);
      }

      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);

      if (slug && response.data.content.length === 0) {
        setError(`Không tìm thấy sản phẩm nào trong danh mục '${currentCategory?.name || slug}'`);
      }
    } catch (err) {
      const categoryNotFound = err.response && err.response.status === 404;

      if (slug && categoryNotFound) {
        setError(`Danh mục '${slug}' không tìm thấy.`);
      } else {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
      }
      
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, slug, currentCategory]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, slug, fetchProducts]);

  const handlePageChange = (page) => {
    setSearchParams(prev => {
      prev.set('page', page);
      return prev;
    });
  };

  // Handle click on a subcategory card
  const handleSubcategoryClick = (subcategorySlug) => {
      navigate(`/categories/${subcategorySlug}`);
  };

  return (
    <div className="container mx-auto px-0 py-0">
       {/* Placeholder for the top banner */}
       <div className="w-full h-96 bg-blue-200 flex items-center justify-center text-2xl font-bold text-gray-700 mb-8">
           {currentCategory?.name || 'All Products'}
       </div>

      {/* Display Subcategories Horizontally */}
      {subcategories.length > 0 && (
          <div className="container mx-auto px-4 py-4">
               {/* Optional: Add a title for the subcategories section if needed */}
               {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">Shop by Category</h2> */}
               {/* Horizontal scrollable container */}
               <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                   {subcategories.map(subcategory => (
                       <div
                           key={subcategory.id}
                           className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 cursor-pointer"
                           onClick={() => handleSubcategoryClick(subcategory.slug)}
                       >
                           <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                               <img
                                   src={subcategory.imageUrl}
                                   alt={subcategory.name}
                                   className="h-full w-full object-cover object-center"
                                   onError={(e) => { // Handle image error
                                       e.target.onerror = null;
                                       e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                                   }}
                               />
                           </div>
                           <p className="mt-2 text-sm font-medium text-center text-gray-900 truncate">{subcategory.name}</p>
                       </div>
                   ))}
               </div>
          </div>
      )}

      {/* Main Product List Area */}
      {/* Removed the sidebar column */} 
      <div className="container mx-auto px-4 py-8">
          {/* Removed SortOptions */}
          {/* <div className="flex justify-end mb-6">
            <SortOptions
              currentSort={sort}
              onSortChange={handleSortChange}
            />
          </div> */}

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Thử lại
              </button>
            </div>
          ) : products.length === 0 && (/* filters.categoryId !== null || filters.categoryName !== null */ slug !== null) ? (
            <div className="text-center py-16">
              {/* Adjusted text slightly */}
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào trong danh mục {slug}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
            </>
          )}
        </div>
      </div>
  );
};

export default ProductListPage; 