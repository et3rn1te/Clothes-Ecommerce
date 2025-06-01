import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiStar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, pagination.size]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/products?page=${pagination.page}&size=${pagination.size}`
      );
      const data = await response.json();
      setProducts(data.content);
      setPagination({
        ...pagination,
        totalElements: data.totalElements,
        totalPages: data.totalPages
      });
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await fetch(`/products/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchProducts();
      toast.success('Đã cập nhật trạng thái sản phẩm');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái sản phẩm');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await fetch(`/products/${id}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      fetchProducts();
      toast.success('Đã cập nhật trạng thái nổi bật');
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái nổi bật');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await fetch(`/products/${id}`, {
          method: 'DELETE'
        });
        fetchProducts();
        toast.success('Đã xóa sản phẩm');
      } catch (error) {
        toast.error('Lỗi khi xóa sản phẩm');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admin/products/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <FiPlus className="mr-2" />
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Hình ảnh
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Tên sản phẩm
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Giá
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Trạng thái
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Nổi bật
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="whitespace-nowrap px-3 py-4">
                        <img
                          src={product.primaryImage?.imageUrl || '/placeholder.png'}
                          alt={product.name}
                          className="h-10 w-10 rounded-full"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(product.basePrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            product.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.active ? (
                            <FiToggleRight className="mr-1" />
                          ) : (
                            <FiToggleLeft className="mr-1" />
                          )}
                          {product.active ? 'Đang bán' : 'Ngừng bán'}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        <button
                          onClick={() => handleToggleFeatured(product.id)}
                          className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                            product.featured
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <FiStar className={`mr-1 ${product.featured ? 'fill-current' : ''}`} />
                          {product.featured ? 'Nổi bật' : 'Bình thường'}
                        </button>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FiEdit2 className="inline-block" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 0}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Trước
          </button>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages - 1}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{products.length}</span> trong{' '}
              <span className="font-medium">{pagination.totalElements}</span> sản phẩm
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 0}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Trước
              </button>
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPagination({ ...pagination, page: index })}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    pagination.page === index
                      ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages - 1}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Sau
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList; 