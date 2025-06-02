import React from 'react';

const CategoryTable = ({ categories, handleToggleCategoryStatus, setSelectedCategory, setShowUpdateModal, handleDeleteCategory }) => {
    return (
        <div className="overflow-x-auto bg-white shadow-xl rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên danh mục</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Slug</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Danh mục cha</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hoạt động</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category.slug}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {category.parentId ? `ID: ${category.parentId}` : 'Không'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {category.active ? 'Có' : 'Không'}
                </span>
                            <button
                                onClick={() => handleToggleCategoryStatus(category.id)}
                                className="ml-3 text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                                title="Chuyển đổi trạng thái hoạt động"
                            >
                                Chuyển đổi
                            </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                                onClick={() => {
                                    setSelectedCategory(category);
                                    setShowUpdateModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800 mr-4 transition duration-150"
                                title="Chỉnh sửa danh mục"
                            >
                                Sửa
                            </button>
                            <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="text-red-600 hover:text-red-800 transition duration-150"
                                title="Xóa danh mục"
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

export default CategoryTable;
