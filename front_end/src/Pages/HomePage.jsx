import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../component/ProductCard";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  // States for API data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8080/api/categories/popular');
        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
        }
        const categoriesResult = await categoriesResponse.json();

        // Fetch featured products
        const productsResponse = await fetch('http://localhost:8080/api/products/featured');
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! Status: ${productsResponse.status}`);
        }
        const productsResult = await productsResponse.json();

        // Check API response format and set data
        if (categoriesResult.code === 0) {
          setCategories(categoriesResult.data);
        } else {
          throw new Error(categoriesResult.message || 'Đã xảy ra lỗi khi tải danh mục');
        }

        if (productsResult.code === 0) {
          setProducts(productsResult.data);
        } else {
          throw new Error(productsResult.message || 'Đã xảy ra lỗi khi tải sản phẩm');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message || "Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextCategory = () => {
    if (currentCategoryIndex < categories.length - 4) {
      setCurrentCategoryIndex(prev => prev + 1);
    }
  };

  const prevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 p-6 rounded-lg">
          <h2 className="text-red-800 text-xl font-semibold">Đã xảy ra lỗi</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Fallback if no data
  if (categories.length === 0 || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white dark:bg-gray-800 md:hidden">
          <div className="flex flex-col p-4 space-y-4">
            <Link to="/" className="text-lg">Home</Link>
            <Link to="/shop" className="text-lg">Shop</Link>
            <Link to="/categories" className="text-lg">Categories</Link>
            <Link to="/contact" className="text-lg">Contact</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="w-full bg-gray-100 py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          {/* Text left */}
          <div className="flex-1 mb-8 md:mb-0">
            <p className="uppercase tracking-widest text-gray-500 mb-2">Spring / Summer Collection 2024</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Get up to <span className="text-red-500">30% Off</span><br />New Arrivals
            </h1>
            <button className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold shadow hover:bg-red-600 transition">
              Shop Now
            </button>
          </div>
          {/* Image right */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=facearea&w=500&q=80"
              alt="Model"
              className="w-80 h-96 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category, idx) => (
            <div
              key={category.id}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transition"
              onClick={() => navigate(`/category/${category.name}`)}
            >
              <img
                src={category.thumbnailUrl || '/api/placeholder/400/300'}
                alt={category.name}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <span className="bg-white bg-opacity-90 px-6 py-2 rounded-full text-lg font-semibold tracking-wide shadow text-gray-900">
                  {category.name.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;