import React, { useState, useEffect } from "react";
import ProductCard from "../../component/ProductCard";

const categoryOptions = ["Tất cả", "Áo", "Quần", "Đầm", "Phụ kiện"];
const priceOptions = [
  { label: "Tất cả", value: "" },
  { label: "Dưới 200.000đ", value: "0-200000" },
  { label: "200.000đ - 500.000đ", value: "200000-500000" },
  { label: "500.000đ - 1.000.000đ", value: "500000-1000000" },
  { label: "Trên 1.000.000đ", value: "1000000-99999999" }
];

const PRODUCTS_PER_PAGE = 8;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [price, setPrice] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsResponse = await fetch('http://localhost:8080/api/products/all');
        const productsResult = await productsResponse.json();
        if (productsResult.code === 0) setProducts(productsResult.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = [...products];
    if (search.trim()) {
      result = result.filter(p => p.name.toLowerCase().includes(search.trim().toLowerCase()));
    }
    if (category !== "Tất cả") {
      result = result.filter(p => p.category?.name === category);
    }
    if (price) {
      const [min, max] = price.split("-").map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }
    setFiltered(result);
    setPage(1); // Reset về trang đầu khi filter thay đổi
  }, [products, search, category, price]);

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const pagedProducts = filtered.slice((page - 1) * PRODUCTS_PER_PAGE, page * PRODUCTS_PER_PAGE);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div><p className="mt-4 text-gray-600">Đang tải dữ liệu sản phẩm...</p></div></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><div className="text-center text-red-600">{error}</div></div>;
  if (products.length === 0) return <div className="flex items-center justify-center min-h-screen"><div className="text-center"><p className="text-gray-600">Không tìm thấy sản phẩm</p></div></div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-16 flex gap-8">
        {/* Sidebar filter */}
        <aside className="w-64 bg-gray-50 border border-gray-100 rounded-lg p-6 h-fit">
          <h3 className="text-lg font-bold mb-6">Bộ lọc</h3>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tên sản phẩm..." className="w-full border rounded px-3 py-2" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Thể loại</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border rounded px-3 py-2">
              {categoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Giá tiền</label>
            <select value={price} onChange={e => setPrice(e.target.value)} className="w-full border rounded px-3 py-2">
              {priceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </aside>
        {/* Product grid */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-center mb-12">Tất cả sản phẩm</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pagedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100 disabled:opacity-50">Trước</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i+1} onClick={() => setPage(i+1)} className={`px-4 py-2 rounded border ${page === i+1 ? 'bg-gray-900 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}>{i+1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded border bg-gray-50 hover:bg-gray-100 disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;