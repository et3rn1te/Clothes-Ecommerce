import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../API/ProductService';
import ProductCard from '../components/ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// URL hình ảnh placeholder tạm thời
const PLACEHOLDER_IMAGE_URL = 'https://picsum.photos/1080/1920';

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeaturedProducts, setLoadingFeaturedProducts] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);

  // Ref cho container sản phẩm để cuộn
  const productsContainerRef = useRef(null);

  const navigate = useNavigate();

  // Fetch featured products on component mount
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
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

  if (loadingFeaturedProducts) {
    return <div className="loading text-center py-8 text-xl font-semibold">Đang tải dữ liệu trang chủ...</div>;
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
      <section className="featured-products-section mb-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
          <p className="text-gray-600">Khám phá những sản phẩm được yêu thích nhất</p>
        </div>

        {loadingFeaturedProducts ? (
          <div className="loading text-center">Đang tải sản phẩm nổi bật...</div>
        ) : errorFeatured ? (
          <div className="error text-center text-red-500">Lỗi: {errorFeatured}</div>
        ) : featuredProducts.length > 0 ? (
          <div className="relative">
            {/* Nút cuộn trái */}
            <button
              onClick={() => scrollProducts('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none z-10 ml-4 transition-all duration-300 hover:scale-110"
              aria-label="Cuộn sang trái"
            >
              <FaChevronLeft className="h-6 w-6" />
            </button>

            {/* Danh sách sản phẩm cuộn ngang */}
            <div
              ref={productsContainerRef}
              className="flex overflow-x-auto space-x-8 pb-8 px-4 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {featuredProducts.map(product => (
                <div key={product.id} className="flex-none w-72 transform transition-all duration-300 hover:scale-105">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Nút cuộn phải */}
            <button
              onClick={() => scrollProducts('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none z-10 mr-4 transition-all duration-300 hover:scale-110"
              aria-label="Cuộn sang phải"
            >
              <FaChevronRight className="h-6 w-6" />
            </button>

            {/* Gradient overlay cho hiệu ứng fade */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        ) : (
          <div className="text-center text-gray-600">Không có sản phẩm nổi bật nào.</div>
        )}
      </section>
    </div>
  );
}

export default HomePage; 