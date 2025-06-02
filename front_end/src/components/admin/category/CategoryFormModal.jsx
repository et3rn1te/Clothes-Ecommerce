import React, { useState, useEffect } from 'react'; // Import useEffect
import CategoryService from '../../../API/CategoryService'; // Import CategoryService

const CategoryFormModal = ({ title, category, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: category ? category.name : '',
        slug: category ? category.slug : '',
        parentId: category ? category.parentId : '', // Thay đổi thành chuỗi rỗng để phù hợp với select
        active: category ? category.active : true,
    });
    const [errors, setErrors] = useState({});
    const [allCategories, setAllCategories] = useState([]); // State để lưu trữ tất cả danh mục

    // useEffect để tải tất cả danh mục khi component được mount
    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const response = await CategoryService.getAllCategories({ page: 0, size: 1000 }); // Lấy tất cả danh mục
                // Lọc bỏ danh mục hiện tại khỏi danh sách để tránh chọn chính nó làm cha
                const filteredCategories = response.data.content.filter(cat => cat.id !== (category ? category.id : null));
                setAllCategories(filteredCategories);
            } catch (err) {
                console.error('Lỗi khi tải danh sách danh mục:', err);
                // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
            }
        };
        fetchAllCategories();
    }, [category]); // Chạy lại khi 'category' thay đổi (khi mở modal chỉnh sửa)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Tên danh mục là bắt buộc.';
        if (!formData.slug) newErrors.slug = 'Slug là bắt buộc.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Chuyển đổi parentId thành số hoặc null nếu là chuỗi rỗng
            const dataToSubmit = {
                ...formData,
                parentId: formData.parentId ? Number(formData.parentId) : null,
            };
            onSubmit(dataToSubmit);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                            Tên danh mục: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập tên danh mục"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="slug">
                            Slug: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Nhập slug (ví dụ: thoi-trang-nam)"
                        />
                        {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="parentId">
                            Danh mục cha (tùy chọn):
                        </label>
                        <select
                            id="parentId"
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                            className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border-gray-300"
                        >
                            <option value="">-- Không có danh mục cha --</option>
                            {allCategories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center mb-6">
                        <input
                            type="checkbox"
                            id="active"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label className="text-gray-700 text-base font-semibold" htmlFor="active">
                            Hoạt động
                        </label>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            {category ? 'Cập nhật danh mục' : 'Tạo danh mục'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryFormModal;
