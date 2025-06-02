import React from 'react';

const ProductSearchBar = ({ searchTerm, setSearchTerm, setShowCreateModal }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <input
                type="text"
                placeholder="Tìm kiếm sản phẩm theo tên..."
                className="p-3 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
                Thêm sản phẩm mới
            </button>
        </div>
    );
};

export default ProductSearchBar;
