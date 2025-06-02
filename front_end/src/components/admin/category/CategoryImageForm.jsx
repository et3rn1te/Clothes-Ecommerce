import React, { useState, useEffect } from 'react';
import CategoryImageService from '../../../API/CategoryImageService';

const CategoryImageForm = ({ categoryId, showCustomMessage }) => {
    const [images, setImages] = useState([]);
    const [editingImage, setEditingImage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [altText, setAltText] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            if (categoryId) {
                try {
                    const res = await CategoryImageService.getImagesByCategoryId(categoryId);
                    setImages(res.data.content || []);
                } catch (error) {
                    console.error("Lỗi khi tải hình ảnh danh mục:", error);
                    showCustomMessage("Không thể tải hình ảnh danh mục.", "error");
                }
            }
        };
        fetchImages();
    }, [categoryId, showCustomMessage]);

    const validateForm = () => {
        let errors = {};
        if (!editingImage && !imageFile) {
            errors.imageFile = 'File hình ảnh là bắt buộc.';
        }
        if (altText && altText.length > 100) {
            errors.altText = 'Alt text không được vượt quá 100 ký tự.';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmitImage = async (e) => {
        e.preventDefault();
        if (!categoryId) {
            showCustomMessage("Vui lòng tạo danh mục chính trước khi thêm hình ảnh.", "error");
            return;
        }

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        if (imageFile) {
            formData.append('imageFile', imageFile);
        }
        formData.append('altText', altText);
        formData.append('categoryId', categoryId);

        try {
            if (editingImage) {
                await CategoryImageService.updateImage(editingImage.id, formData);
                showCustomMessage("Cập nhật hình ảnh danh mục thành công!", "success");
            } else {
                await CategoryImageService.createImage(categoryId, formData);
                showCustomMessage("Thêm hình ảnh danh mục thành công!", "success");
            }
            // Tải lại danh sách ảnh
            const updatedImages = await CategoryImageService.getImagesByCategoryId(categoryId);
            setImages(updatedImages.data.content || []);

            // Reset form
            setEditingImage(null);
            setImageFile(null);
            setAltText('');
            setFormErrors({});
            setShowForm(false);
        } catch (error) {
            console.error("Lỗi khi lưu hình ảnh danh mục:", error);
            showCustomMessage("Lỗi khi lưu hình ảnh danh mục. Vui lòng thử lại.", "error");
        }
    };

    const handleDeleteImage = async (imageId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này không?')) {
            try {
                await CategoryImageService.deleteImage(imageId);
                const updatedImages = await CategoryImageService.getImagesByCategoryId(categoryId);
                setImages(updatedImages.data.content || []);
                showCustomMessage("Xóa hình ảnh danh mục thành công!", "success");
            } catch (error) {
                console.error("Lỗi khi xóa hình ảnh danh mục:", error);
                showCustomMessage("Lỗi khi xóa hình ảnh danh mục. Vui lòng thử lại.", "error");
            }
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Hình ảnh danh mục</h3>
            {categoryId ? (
                <>
                    <button
                        type="button"
                        onClick={() => { setEditingImage(null); setImageFile(null); setAltText(''); setFormErrors({}); setShowForm(true); }}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-4"
                    >
                        Thêm hình ảnh mới
                    </button>

                    {showForm && (
                        <form onSubmit={handleSubmitImage} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                            <h4 className="text-xl font-semibold mb-4 text-gray-800">{editingImage ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh'}</h4>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="categoryImageFile">
                                    File hình ảnh: {editingImage && <span className="text-gray-500 text-xs">(Để trống nếu không muốn thay đổi ảnh)</span>}
                                </label>
                                <input
                                    type="file"
                                    id="categoryImageFile"
                                    name="imageFile"
                                    onChange={(e) => setImageFile(e.target.files[0])}
                                    className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.imageFile ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {formErrors.imageFile && <p className="text-red-500 text-xs mt-1">{formErrors.imageFile}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="categoryAltText">
                                    Alt Text:
                                </label>
                                <input
                                    type="text"
                                    id="categoryAltText"
                                    name="altText"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.altText ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Mô tả hình ảnh"
                                />
                                {formErrors.altText && <p className="text-red-500 text-xs mt-1">{formErrors.altText}</p>}
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowForm(false); setEditingImage(null); setImageFile(null); setAltText(''); setFormErrors({}); }}
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
                    )}

                    {images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                            {images.map((image) => (
                                <div key={image.id} className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                                    <img
                                        src={image.imageUrl || `https://placehold.co/150x150/e0e0e0/000000?text=No+Image`}
                                        alt={image.altText || 'Category image'}
                                        className="w-full h-32 object-cover"
                                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/e0e0e0/000000?text=No+Image`; }}
                                    />
                                    <div className="p-2 text-center text-sm">
                                        <p className="truncate">{image.altText || 'Không có mô tả'}</p>
                                        <div className="flex justify-center mt-2 space-x-2">
                                            <button
                                                onClick={() => { setEditingImage(image); setAltText(image.altText); setShowForm(true); }}
                                                className="text-indigo-600 hover:text-indigo-800 text-xs"
                                                title="Chỉnh sửa hình ảnh"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteImage(image.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Xóa hình ảnh"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !showForm && <p className="text-center text-gray-600 mt-4">Chưa có hình ảnh nào cho danh mục này.</p>
                    )}
                </>
            ) : (
                <p className="text-center text-gray-600 mt-4">Vui lòng tạo danh mục trước để thêm hình ảnh.</p>
            )}
        </div>
    );
};

export default CategoryImageForm;
