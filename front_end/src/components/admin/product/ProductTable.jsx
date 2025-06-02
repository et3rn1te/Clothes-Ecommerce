import React from 'react';

const ProductTable = ({ products, handleToggleStatus, handleToggleFeatured, setSelectedProduct, setShowUpdateModal, handleDeleteProduct }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá gốc</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hoạt động</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nổi bật</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.basePrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {product.active ? 'Có' : 'Không'}
                </span>
                            <button
                                onClick={() => handleToggleStatus(product.id)}
                                className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                                title="Chuyển đổi trạng thái hoạt động"
                            >
                                Chuyển đổi
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {product.featured ? 'Có' : 'Không'}
                </span>
                            <button
                                onClick={() => handleToggleFeatured(product.id)}
                                className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                                title="Chuyển đổi trạng thái nổi bật"
                            >
                                Chuyển đổi
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setShowUpdateModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 mr-4 transition duration-150"
                                title="Chỉnh sửa sản phẩm"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800 transition duration-150"
                                title="Xóa sản phẩm"
                            >
                                Xóa
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;
