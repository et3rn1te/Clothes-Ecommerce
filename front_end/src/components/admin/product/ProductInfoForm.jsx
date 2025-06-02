import React, { useState, useEffect } from 'react';
import CategoryService from '../../../API/CategoryService';
import BrandService from '../../../API/BrandService';

const ProductInfoForm = ({ formData, setFormData, errors, setErrors, onSubmit, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);

    // Tải danh mục và thương hiệu
    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                const categoryRes = await CategoryService.getAllCategories();
                setCategories(categoryRes.data.content || []);
                const brandRes = await BrandService.getAllBrands();
                setBrands(brandRes.data || []);
            } catch (err) {
                console.error('Lỗi khi tải danh mục hoặc thương hiệu:', err);
                // showCustomMessage('Lỗi khi tải danh mục hoặc thương hiệu.', 'error'); // Cần truyền showCustomMessage từ cha
            }
        };
        fetchCategoriesAndBrands();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleCategoryChange = (e) => {
        const { options } = e.target;
        const selectedCategories = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                selectedCategories.push(Number(options[i].value));
            }
        }
        setFormData((prevData) => ({
            ...prevData,
            categoryIds: selectedCategories,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, categoryIds: '' }));
    };

    return (
        <form onSubmit={onSubmit}>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin sản phẩm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Tên sản phẩm */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                        Tên sản phẩm: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nhập tên sản phẩm"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                {/* Slug */}
                <div>
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
                        placeholder="Nhập slug (ví dụ: san-pham-moi)"
                    />
                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>
                {/* Giá gốc */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="basePrice">
                        Giá gốc: <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="basePrice"
                        name="basePrice"
                        value={formData.basePrice}
                        onChange={handleChange}
                        step="0.01"
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.basePrice ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Ví dụ: 99.99"
                    />
                    {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>}
                </div>
                {/* Thương hiệu */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="brandId">
                        Thương hiệu: <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="brandId"
                        name="brandId"
                        value={formData.brandId}
                        onChange={handleChange}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.brandId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Chọn thương hiệu</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brandId && <p className="text-red-500 text-xs mt-1">{errors.brandId}</p>}
                </div>
                {/* Giới tính */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="genderId">
                        Giới tính: <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="genderId"
                        name="genderId"
                        value={formData.genderId}
                        onChange={handleChange}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.genderId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="1">Nam</option>
                        <option value="2">Nữ</option>
                        <option value="3">Unisex</option>
                    </select>
                    {errors.genderId && <p className="text-red-500 text-xs mt-1">{errors.genderId}</p>}
                </div>
                {/* Danh mục */}
                <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="categoryIds">
                        Danh mục (chọn nhiều): <span className="text-red-500">*</span>
                    </label>
                    <select
                        multiple
                        id="categoryIds"
                        name="categoryIds"
                        value={formData.categoryIds.map(String)}
                        onChange={handleCategoryChange}
                        className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 h-32 ${errors.categoryIds ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="" disabled>Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.categoryIds && <p className="text-red-500 text-xs mt-1">{errors.categoryIds}</p>}
                </div>
            </div>

            {/* Mô tả sản phẩm */}
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
                    Mô tả:
                </label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border-gray-300"
                    placeholder="Nhập mô tả chi tiết sản phẩm"
                ></textarea>
            </div>

            {/* Checkbox Nổi bật */}
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-gray-700 text-base font-semibold" htmlFor="featured">
                    Sản phẩm nổi bật
                </label>
            </div>

            {/* Checkbox Hoạt động */}
            <div className="flex items-center mb-8">
                <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-gray-700 text-base font-semibold" htmlFor="active">
                    Sản phẩm hoạt động
                </label>
            </div>

            {/* Nút lưu sản phẩm chính */}
            <div className="flex justify-end gap-4 mb-8 border-b pb-4">
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
                    {formData.id ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
                </button>
            </div>
        </form>
    );
};

export default ProductInfoForm;
