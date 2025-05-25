import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import GenderService from '../API/GenderService';
import CategoryService from '../API/CategoryService';
import ProductService from '../API/ProductService';
import ProductCard from '../components/ProductCard'; // Import ProductCard component
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Import Chevron icons

// URL hình ảnh placeholder tạm thời
const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/1080/1920';
const CATEGORY_ICON_PLACEHOLDER = 'https://via.placeholder.com/80x80?text=Icon'; // Placeholder cho icon danh mục

function HomePage() {
  const [genders, setGenders] = useState([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [categoriesByGender, setCategoriesByGender] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingGenders, setLoadingGenders] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingFeaturedProducts, setLoadingFeaturedProducts] = useState(true);
  const [error, setError] = useState(null);
  const [errorFeatured, setErrorFeatured] = useState(null);

  // Ref cho container sản phẩm để cuộn
  const productsContainerRef = useRef(null);

  const navigate = useNavigate();

  // Fetch genders on component mount
  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await GenderService.getAllGenders();
        setGenders(response.data);
        // Automatically select the first gender if available
        if (response.data.length > 0) {
          setSelectedGender(response.data[0]);
        }
      } catch (err) {
        setError('Không thể tải dữ liệu giới tính.');
        console.error('Error fetching genders:', err);
      } finally {
        setLoadingGenders(false);
      }
    };

    fetchGenders();
  }, []);

  // Fetch categories when selectedGender changes
  useEffect(() => {
    if (selectedGender) {
      const fetchCategories = async () => {
        setLoadingCategories(true);
        setError(null);
        try {
          const response = await GenderService.getCategoriesByGenderSlug(selectedGender.slug);
          console.log('Categories data:', response.data);
          setCategoriesByGender(response.data);
        } catch (err) {
          setError(`Không thể tải danh mục cho ${selectedGender.name}.`);
          console.error(`Error fetching categories for ${selectedGender.name}:`, err);
        } finally {
          setLoadingCategories(false);
        }
      };

      fetchCategories();
    }
  }, [selectedGender]);

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // API returns PageResponse, access content array
        const response = await ProductService.getFeaturedProducts();
        setFeaturedProducts(response.data.content);
      } catch (err) {
        console.error('Error fetching sản phẩm nổi bật:', err);
        setErrorFeatured('Không thể tải sản phẩm nổi bật.');
      } finally {
        setLoadingFeaturedProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []); // Run only once on mount


  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  // Hàm xử lý cuộn sang trái/phải
  const scrollProducts = (direction) => {
    if (productsContainerRef.current) {
      const scrollAmount = 300; // Điều chỉnh lượng cuộn theo ý muốn
      if (direction === 'left') {
        productsContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        productsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Sửa lại hàm xử lý click vào danh mục
  const handleCategoryClick = (category) => {
    console.log('Clicked category:', category);
    if (selectedGender && category && category.slug) {
      console.log('Navigating to:', `/${selectedGender.slug}/${category.slug}`);
      navigate(`/${selectedGender.slug}/${category.slug}`);
    } else {
      console.error('Missing required data for navigation:', { selectedGender, category });
    }
  };

  // Combine loading states for initial full page load check
  const isLoadingInitial = loadingGenders || loadingFeaturedProducts;

  if (isLoadingInitial) {
    return <div className="loading text-center py-8 text-xl font-semibold">Đang tải dữ liệu trang chủ...</div>;
  }

  if (error) {
    return <div className="error text-center text-red-500 py-8 text-xl font-semibold">Lỗi: {error}</div>;
  }

  return (
    <div className="homepage container mx-auto px-4 py-8">

      {/* Banner quảng cáo WOWBOX */}
      <section
        className="wowbox-banner relative text-white text-center py-16 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-blue-700 shadow-lg"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${PLACEHOLDER_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Nội dung banner WOWBOX */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">WOWBOX CHỈ VỚI 149K</h2>
          <p className="text-lg md:text-xl opacity-90 mb-6">Số lượng giới hạn 200 box / ngày</p>
          <button className="mt-4 px-8 py-3 bg-white text-blue-700 font-bold rounded-full shadow-xl hover:bg-gray-100 transition duration-300 text-lg uppercase tracking-wide">MUA NGAY &rarr;</button>
        </div>
      </section>

      {/* Gender and Category Navigation */}
      <section className="gender-category-navigation mb-8">
        {/* Gender Navigation */}
        <div className="gender-navigation flex justify-center mb-6 space-x-4 md:space-x-8">
          {genders.map(gender => (
            <button
              key={gender.id}
              className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold text-sm md:text-base transition duration-200 ${
                selectedGender?.id === gender.id ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              onClick={() => handleGenderSelect(gender)}
            >
              {gender.name.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Categories Section - Updated with click handler */}
        {selectedGender && (
          <div className="categories-section text-center mb-8">
            <h2 className="text-2xl font-semibold mb-4">Danh mục {selectedGender.name}:</h2>
            {loadingCategories ? (
              <div className="loading text-center">Đang tải danh mục...</div>
            ) : (
              <div className="flex flex-wrap justify-center gap-6">
                {categoriesByGender.length > 0 ? (
                  categoriesByGender.map(category => (
                    <div 
                      key={category.id} 
                      className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity duration-200"
                      onClick={() => handleCategoryClick(category)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleCategoryClick(category);
                        }
                      }}
                    >
                      {/* Category Icon/Image */}
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-2 shadow-md hover:shadow-lg transition-shadow duration-200">
                        <img
                          src={category.imageUrl || CATEGORY_ICON_PLACEHOLDER}
                          alt={category.name || 'Category Icon'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Category Name */}
                      <p className="text-sm font-medium text-gray-700 text-center line-clamp-1">{category.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-600">Không có danh mục nào cho giới tính này.</div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Men Wear / Women Active Sections - Using Grid for 2 columns */}
      <section className="style-sections grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Men Wear Section */}
        <div
          className="men-wear-section relative h-80 rounded-lg overflow-hidden flex items-center justify-center shadow-lg"
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${PLACEHOLDER_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
           {/* Overlay và nội dung */}
           <div className="relative z-10 text-white text-center">
             <h2 className="text-3xl font-bold mb-4">MEN WEAR</h2>
             <button className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-full shadow hover:bg-gray-200 transition duration-300">MUA NGAY</button>
           </div>
        </div>
        {/* Women Active Section */}
        <div
          className="women-active-section relative h-80 rounded-lg overflow-hidden flex items-center justify-center shadow-lg"
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${PLACEHOLDER_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
           {/* Overlay và nội dung */}
           <div className="relative z-10 text-white text-center">
             <h2 className="text-3xl font-bold mb-4">WOMEN ACTIVE</h2>
             <button className="px-6 py-2 bg-white text-gray-800 font-semibold rounded-full shadow hover:bg-gray-200 transition duration-300">MUA NGAY</button>
           </div>
        </div>
      </section>

      {/* Casualwear Collection Banner */}
       <section
        className="casualwear-banner relative text-white text-center py-16 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-purple-700 via-purple-800 to-purple-700 shadow-lg"
         style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${PLACEHOLDER_IMAGE_URL})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Nội dung banner Casualwear */}
        <div className="relative z-10">
           <h2 className="text-4xl md:text-5xl font-extrabold mb-4">CASUALWEAR COLLECTION</h2>
           <p className="text-lg md:text-xl opacity-90 mb-6">Nhập COOLNEW giảm 30k cho đơn từ 299k</p>
           <button className="mt-4 px-8 py-3 bg-white text-purple-700 font-bold rounded-full shadow-xl hover:bg-gray-100 transition duration-300 text-lg uppercase tracking-wide">MUA NGAY &rarr;</button>
        </div>
      </section>

      {/* Featured Products Section - Carousel Layout */}
      <section className="featured-products-section mb-8 relative">
        <h2 className="text-3xl font-semibold text-center mb-6">Sản phẩm nổi bật:</h2>
        {loadingFeaturedProducts ? (
          <div className="loading text-center">Đang tải sản phẩm nổi bật...</div>
        ) : errorFeatured ? (
          <div className="error text-center text-red-500">Lỗi: {errorFeatured}</div>
        ) : featuredProducts.length > 0 ? (
          <div className="relative">
            {/* Nút cuộn trái */}
            <button
              onClick={() => scrollProducts('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 text-blue-900 p-2 rounded-full shadow-md hover:bg-opacity-100 focus:outline-none z-10 ml-2"
            >
              <FaChevronLeft className="h-6 w-6" />
            </button>

            {/* Danh sách sản phẩm cuộn ngang */}
            <div
              ref={productsContainerRef}
              className="flex overflow-x-auto space-x-6 pb-4 no-scrollbar"
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="flex-none w-64">
                   <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Nút cuộn phải */}
             <button
              onClick={() => scrollProducts('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 text-blue-900 p-2 rounded-full shadow-md hover:bg-opacity-100 focus:outline-none z-10 mr-2"
            >
              <FaChevronRight className="h-6 w-6" />
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-600">Không có sản phẩm nổi bật nào.</div>
        )}
      </section>

      {/* Các section khác nếu có */}

    </div>
  );
}

export default HomePage; 