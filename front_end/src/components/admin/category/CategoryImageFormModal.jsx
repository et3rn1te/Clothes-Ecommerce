import React, { useState, useEffect } from 'react';
import CategoryImageService from '../services/CategoryImageService'; // Import CategoryImageService

const CategoryImageFormModal = ({ title, categoryId, image, onSubmit, onClose, showCustomMessage }) => {
    const [formData, setFormData] = useState({
        altText: image?.altText || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (image) {
            setFormData({
                altText: image.altText || '',
            });
        }
    }, [image]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        if (type === 'file') {
            setImageFile(e.target.files[0]);
            setErrors((prev) => ({ ...prev, imageFile: '' }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
            setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
        }
    };

    const validateForm = () => {
        let newErrors = {};
        if (!image && !imageFile) newErrors.imageFile = 'File hình ảnh là bắt buộc.';
        if (formData.altText.length > 100) newErrors.altText = 'Alt text không được vượt quá 100 ký tự.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formDataToSend = new FormData();
        if (imageFile) {
            formDataToSend.append('imageFile', imageFile);
        }
        formDataToSend.append('altText', formData.altText);
        formDataToSend.append('categoryId', categoryId);

        try {
            if (image && image.id) {
                await CategoryImageService.updateImage(image.id, formDataToSend);
                showCustomMessage('Hình ảnh danh mục đã được cập nhật!', 'success');
            } else {
                await CategoryImageService.createImage(categoryId, formDataToSend);
                showCustomMessage('Hình ảnh danh mục đã được thêm thành công!', 'success');
            }
            onSubmit(); // Gọi hàm onSubmit để parent component tải lại dữ liệu
            onClose();
        } catch (err) {
            console.error('Lỗi khi lưu hình ảnh danh mục:', err);
            showCustomMessage('Không thể lưu hình ảnh danh mục. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="imageFile">
                            File hình ảnh: {image && <span className="text-gray-500 text-xs">(Để trống nếu không muốn thay đổi ảnh)</span>}
                        </label>
                        <input
                            type="file"
                            id="imageFile"
                            name="imageFile"
                            onChange={handleChange}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.imageFile ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.imageFile && <p className="text-red-500 text-xs mt-1">{errors.imageFile}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="altText">
                            Alt Text:
                        </label>
                        <input
                            type="text"
                            id="altText"
                            name="altText"
                            value={formData.altText}
                            onChange={handleChange}
                            className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.altText ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Mô tả hình ảnh"
                        />
                        {errors.altText && <p className="text-red-500 text-xs mt-1">{errors.altText}</p>}
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Lưu hình ảnh
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryImageFormModal;
