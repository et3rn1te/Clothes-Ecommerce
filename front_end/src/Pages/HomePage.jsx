import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../component/ProductCard";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  
  // States for API data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8080/api/categories/all');
        if (!categoriesResponse.ok) {
          throw new Error(`HTTP error! Status: ${categoriesResponse.status}`);
        }
        const categoriesResult = await categoriesResponse.json();
        
        // Fetch featured products
        const productsResponse = await fetch('http://localhost:8080/api/products/all');
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
      <section className="relative h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Fresh & Organic
            </h1>
            <p className="text-xl mb-8 animate-fade-in-delay">
              Quality products delivered to your doorstep
            </p>
            <Link to="/shop">
              <button className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition duration-300">
                Shop Now
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Popular Categories</h2>
        <div className="relative">
          <button 
            onClick={prevCategory}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={currentCategoryIndex === 0}
          >
            <FiChevronLeft className="h-6 w-6" />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.slice(currentCategoryIndex, currentCategoryIndex + 4).map((category) => (
            <Link 
              to={`/category/${category.id}`} 
              key={category.id}
              className="relative overflow-hidden rounded-lg group cursor-pointer"
            >
              <img
                src={category.imageUrl || "/api/placeholder/400/320"}
                alt={category.name}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-white text-2xl font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
          </div>
          <button 
            onClick={nextCategory}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg z-10 hover:bg-gray-100 dark:hover:bg-gray-700"
            disabled={currentCategoryIndex >= categories.length - 4}
          >
            <FiChevronRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16 bg-gray-50 dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;