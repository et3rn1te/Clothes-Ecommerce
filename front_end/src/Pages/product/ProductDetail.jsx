import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiChevronLeft } from 'react-icons/fi';
import ProductCard from '../../component/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/products/product/${id}`);
        const result = await response.json();
        if (result.code === 0) setProduct(result.data);
        // Gợi ý sản phẩm cùng danh mục
        if (result.data?.category?.name) {
          const suggestRes = await fetch(`http://localhost:8080/api/products/search?category=${result.data.category.name}`);
          const suggestData = await suggestRes.json();
          if (suggestData.code === 0) setSuggested(suggestData.data.filter(p => p.id !== result.data.id).slice(0, 4));
        }
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    if (id) fetchProductData();
    else { setError("Không tìm thấy ID sản phẩm trong URL"); setLoading(false); }
  }, [id]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const handleAddToCart = () => {
    if (product.quantity === 0) return alert('Sản phẩm đã hết hàng!');
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div><p className="mt-4 text-gray-600">Đang tải thông tin sản phẩm...</p></div></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><div className="text-center text-red-600">{error}</div></div>;
  if (!product) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><p className="text-gray-600">Không tìm thấy thông tin sản phẩm</p></div></div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <button onClick={() => navigate(-1)} className="flex items-center hover:text-gray-900"><FiChevronLeft className="mr-1" />Quay lại</button>
          <span className="mx-2">/</span>
          <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="hover:underline cursor-pointer" onClick={() => navigate(`/category/${product.category.id}`)}>{product.category.name}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-semibold">{product.name}</span>
        </div>
        {/* Main layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Image left */}
          <div>
            <div className="bg-gray-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center h-[420px]">
              <img src={product.images?.[selectedImage]?.url || '/api/placeholder/400/400'} alt={product.name} className="object-contain h-full w-full" />
            </div>
            <div className="flex gap-3 mt-2">
              {product.images?.map((img, idx) => (
                <button key={img.id} onClick={() => setSelectedImage(idx)} className={`w-16 h-16 rounded border ${selectedImage === idx ? 'border-gray-900' : 'border-gray-200'} overflow-hidden focus:outline-none`}>
                  <img src={img.url} alt={product.name + idx} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>
          {/* Info right */}
          <div className="flex flex-col justify-between h-full">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="text-gray-500 mb-4">{product.brand}</div>
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold text-red-500 mr-4">{formatPrice(product.price)}</span>
                {product.discount > 0 && <span className="text-base text-gray-400 line-through">{formatPrice(product.price * (1 + product.discount / 100))}</span>}
              </div>
              <div className="mb-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <label htmlFor="quantity" className="text-sm text-gray-700">Số lượng:</label>
                <input type="number" id="quantity" min="1" max={product.quantity} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(product.quantity, parseInt(e.target.value)||1)))} className="w-16 border rounded px-2 py-1 text-center" />
              </div>
              <button onClick={handleAddToCart} disabled={product.quantity === 0} className={`w-full py-3 rounded-full font-semibold text-white text-lg flex items-center justify-center gap-2 ${product.quantity > 0 ? 'bg-gray-900 hover:bg-red-500 transition' : 'bg-gray-300 cursor-not-allowed'}`}>
                <FiShoppingCart />
                {product.quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h2>
              <p className="text-gray-700 whitespace-pre-line text-base">{product.description}</p>
            </div>
          </div>
        </div>
        {/* Gợi ý sản phẩm */}
        {suggested.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold mb-6">Bạn có thể thích</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {suggested.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;