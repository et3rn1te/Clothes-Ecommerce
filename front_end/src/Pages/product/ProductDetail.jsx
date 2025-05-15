import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy ID sản phẩm từ URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        // Sử dụng ID từ URL trong API request
        const response = await fetch(`http://localhost:8080/api/products/product/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.code === 0) {
          setProduct(result.data);
        } else {
          throw new Error(result.message || 'Đã xảy ra lỗi khi tải sản phẩm');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || "Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    } else {
      setError("Không tìm thấy ID sản phẩm trong URL");
      setLoading(false);
    }
  }, [id]); // Thêm id vào dependencies để useEffect chạy lại khi id thay đổi

  const handleChangeQuantity = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCart = () => {
    if (product.inventory === 0) {
      alert('Sản phẩm đã hết hàng!');
      return;
    }
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin sản phẩm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <a href="#" className="text-gray-500 hover:text-gray-700">Trang chủ</a>
        <span className="mx-2 text-gray-500">/</span>
        <a href="#" className="text-gray-500 hover:text-gray-700">{product.category.name}</a>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={product.images.length > 0 ? product.images[selectedImage].url : "/api/placeholder/400/400"} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-4 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <div 
                key={image.id}
                className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setSelectedImage(index)}
              >
                <img 
                  src={image.url} 
                  alt={`${product.name} - Ảnh ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">Thương hiệu: {product.brand}</p>
            <p className="text-gray-500">Danh mục: {product.category.name}</p>
          </div>

          <div className="border-t border-b py-4">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </span>
            </div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inventory > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.inventory > 0 ? 'Còn hàng' : 'Hết hàng'}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Mô tả sản phẩm</h3>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Số lượng:
                </label>
                <div className="flex border border-gray-300 rounded-md">
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={quantity}
                    onChange={handleChangeQuantity}
                    className="w-12 text-center focus:outline-none"
                  />
                  <button 
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-md font-medium text-white ${product.inventory > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
              >
                {product.inventory > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 gap-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Mã sản phẩm:</span>
                <span className="text-sm font-medium">#{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Danh mục:</span>
                <span className="text-sm font-medium">{product.category.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;