import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiMail } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../component/ProductCard";

const Shop = () => {
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  // States for API data
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: "",
    material: "",
    priceRange: "",
    sortBy: ""
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);
  const [direction, setDirection] = useState(0);

  const filterOptions = {
    categories: ["Áo", "Quần", "Đầm", "Phụ kiện"],
    genders: ["Nam", "Nữ", "Unisex"],
    colors: ["Trắng", "Đen", "Xanh", "Đỏ"],
    sizes: ["S", "M", "L", "XL"],
    materials: ["Cotton", "Polyester", "Linen", "Denim"],
    priceRanges: ["0-50", "51-100", "101-200", "201+"],
    sortOptions: ["Mới nhất", "Bán chạy nhất", "Giá thấp đến cao", "Giá cao đến thấp", "Giảm giá"]
  };

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('http://localhost:8080/api/products/all');
        if (!productsResponse.ok) {
          throw new Error(`HTTP error! Status: ${productsResponse.status}`);
        }
        const productsResult = await productsResponse.json();
        
        // Check API response format and set data
        if (productsResult.code === 0) {
          setProducts(productsResult.data);
          setFilteredProducts(productsResult.data);
        } else {
          throw new Error(productsResult.message || 'Đã xảy ra lỗi khi tải sản phẩm');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message || "Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // For debugging - Log products structure
  useEffect(() => {
    if (products.length > 0) {
      console.log("Products data structure:", products[0]);
    }
  }, [products]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  useEffect(() => {
    if (products.length === 0) return;
    
    let result = [...products];

    if (filters.category) {
      result = result.filter(product => product.category === filters.category);
    }
    if (filters.gender) {
      result = result.filter(product => product.gender === filters.gender);
    }
    if (filters.color) {
      result = result.filter(product => product.color === filters.color);
    }
    if (filters.size) {
      result = result.filter(product => 
        product.sizes && product.sizes.some(size => size === filters.size)
      );
    }
    if (filters.material) {
      result = result.filter(product => product.material === filters.material);
    }
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        }
        return product.price >= min;
      });
    }
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "Mới nhất":
          result = [...result].sort((a, b) => (b.new === true) - (a.new === true));
          break;
        case "Bán chạy nhất":
          result = [...result].sort((a, b) => (b.bestSeller === true) - (a.bestSeller === true));
          break;
        case "Giá thấp đến cao":
          result = [...result].sort((a, b) => a.price - b.price);
          break;
        case "Giá cao đến thấp":
          result = [...result].sort((a, b) => b.price - a.price);
          break;
        case "Giảm giá":
          result = [...result].sort((a, b) => b.discount - a.discount);
          break;
        default:
          break;
      }
    }

    setFilteredProducts(result);
  }, [filters, products]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu sản phẩm...</p>
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
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex gap-8">
          <div className="w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Bộ lọc sản phẩm</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Danh mục</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("category", e.target.value)}
                  value={filters.category}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Giới tính</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  value={filters.gender}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Màu sắc</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("color", e.target.value)}
                  value={filters.color}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Kích thước</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                  value={filters.size}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Chất liệu</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("material", e.target.value)}
                  value={filters.material}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.materials.map(material => (
                    <option key={material} value={material}>{material}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Khoảng giá</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("priceRange", e.target.value)}
                  value={filters.priceRange}
                >
                  <option value="">Tất cả</option>
                  {filterOptions.priceRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Sắp xếp theo</h4>
                <select 
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  value={filters.sortBy}
                >
                  <option value="">Mặc định</option>
                  {filterOptions.sortOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-8">Sản phẩm</h2>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;