// src/components/admin/product/ProductImageFormModal.jsx
import React, { useState, useEffect } from 'react';
import ProductImageService from '../../../API/ProductImageService';
import CustomMessageBox from '../../common/CustomMessageBox'; // Đảm bảo đã import

const ProductImageFormModal = ({ productId, onClose, showCustomMessage }) => {
    const [images, setImages] = useState([]);
    const [editingImage, setEditingImage] = useState(null);
    const [showImageForm, setShowImageForm] = useState(false);
    const [imageFile, setImageFile] = useState(null); // File để upload
    const [imageFormErrors, setImageFormErrors] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            if (productId) {
                try {
                    const res = await ProductImageService.getImagesByProduct(productId);
                    console.log("Dữ liệu hình ảnh fetch được (res.data):", res); // LOG QUAN TRỌNG: Kiểm tra dữ liệu này
                    // Đã sửa lỗi: Truy cập trực tiếp res.data vì API trả về mảng trực tiếp, không phải trong .content
                    setImages(res || []); // res đã là mảng dữ liệu từ service
                    if (res && res.length === 0) {
                        console.warn("Không tìm thấy hình ảnh nào cho sản phẩm này.");
                    }
                } catch (error) {
                    console.error("Lỗi khi tải hình ảnh sản phẩm:", error);
                    showCustomMessage("Không thể tải hình ảnh sản phẩm. Vui lòng kiểm tra console.", "error");
                }
            } else {
                console.warn("productId không tồn tại khi cố gắng tải hình ảnh.");
            }
        };
        fetchImages();
    }, [productId, showCustomMessage]);


    // Hàm hiển thị hộp thoại xác nhận (giả định có sẵn từ CustomMessageBox hoặc một context khác)
    // Trong môi trường thực tế, bạn cần có một component hoặc hook để quản lý xác nhận
    const showConfirmation = (message, onConfirm) => {
        if (window.confirm(message)) {
            onConfirm();
        }
    };

    const handleImageFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'file') {
            setImageFile(e.target.files[0]);
            setImageFormErrors((prev) => ({ ...prev, imageFile: '' }));
        } else {
            setEditingImage((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
            setImageFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateImageForm = (imageData, file) => {
        let newErrors = {};
        if (!imageData.id && !file) newErrors.imageFile = 'File hình ảnh là bắt buộc khi tạo mới.';
        if (imageData.altText && imageData.altText.length > 100) newErrors.altText = 'Alt text không được vượt quá 100 ký tự.';
        setImageFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveImage = async (e) => {
        e.preventDefault();
        if (!editingImage && !imageFile) return;

        if (!productId) {
            showCustomMessage('Vui lòng tạo sản phẩm chính trước khi thêm hình ảnh.', 'error');
            return;
        }

        const imageData = {
            altText: editingImage?.altText || '',
            primary: editingImage?.primary || false,
            productId: productId,
        };

        if (!validateImageForm(imageData, imageFile)) return;

        try {
            const formDataToSend = new FormData();
            if (imageFile) {
                formDataToSend.append('imageFile', imageFile);
            }
            formDataToSend.append('altText', imageData.altText);
            formDataToSend.append('primary', imageData.primary);
            formDataToSend.append('productId', imageData.productId);


            if (editingImage?.id) {
                await ProductImageService.updateImage(editingImage.id, formDataToSend);
                showCustomMessage('Hình ảnh đã được cập nhật thành công!', 'success');
            } else {
                await ProductImageService.createImage(productId, formDataToSend);
                showCustomMessage('Hình ảnh đã được tạo thành công!', 'success');
            }
            // Tải lại danh sách hình ảnh sau khi lưu
            const updatedImages = await ProductImageService.getImagesByProduct(productId);
            setImages(updatedImages || []); // Đã sửa: updatedImages là mảng trực tiếp
            setShowImageForm(false);
            setEditingImage(null);
            setImageFile(null);
            setImageFormErrors({});
        } catch (err) {
            console.error('Lỗi khi lưu hình ảnh:', err);
            showCustomMessage('Không thể lưu hình ảnh. Vui lòng thử lại.', 'error');
        }
    };

    const handleDeleteImage = (imageId) => {
        showConfirmation('Bạn có chắc chắn muốn xóa hình ảnh này không?', async () => {
            try {
                await ProductImageService.deleteImage(imageId);
                // Tải lại danh sách hình ảnh sau khi xóa
                const updatedImages = await ProductImageService.getImagesByProduct(productId);
                setImages(updatedImages || []); // Đã sửa: updatedImages là mảng trực tiếp
                showCustomMessage('Hình ảnh đã được xóa thành công!', 'success');
            } catch (err) {
                console.error('Lỗi khi xóa hình ảnh:', err);
                showCustomMessage('Không thể xóa hình ảnh. Vui lòng thử lại.', 'error');
            }
        });
    };

    const handleSetPrimaryImage = async (imageId) => {
        try {
            await ProductImageService.setPrimaryImage(imageId);
            // Tải lại danh sách hình ảnh sau khi đặt ảnh chính
            const updatedImages = await ProductImageService.getImagesByProduct(productId);
            setImages(updatedImages || []); // Đã sửa: updatedImages là mảng trực tiếp
            showCustomMessage('Ảnh chính đã được đặt thành công!', 'success');
        } catch (err) {
            console.error('Lỗi khi đặt ảnh chính:', err);
            showCustomMessage('Không thể đặt ảnh chính. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Quản lý Hình ảnh Sản phẩm</h2>

                <button
                    onClick={() => {
                        setEditingImage({ altText: '', primary: false }); // Reset form cho hình ảnh mới
                        setImageFile(null); // Xóa file đã chọn trước đó
                        setImageFormErrors({}); // Xóa lỗi form
                        setShowImageForm(true); // Hiển thị form thêm/sửa ảnh
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-4"
                >
                    Thêm hình ảnh mới
                </button>

                {showImageForm && (
                    <form onSubmit={handleSaveImage} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                        <h4 className="text-xl font-semibold mb-4 text-gray-800">{editingImage?.id ? 'Chỉnh sửa hình ảnh' : 'Thêm hình ảnh'}</h4>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="imageFile">
                                File hình ảnh: {editingImage?.id && <span className="text-gray-500 text-xs">(Để trống nếu không muốn thay đổi ảnh)</span>}
                            </label>
                            <input
                                type="file"
                                id="imageFile"
                                name="imageFile"
                                onChange={handleImageFormChange}
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${imageFormErrors.imageFile ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {imageFormErrors.imageFile && <p className="text-red-500 text-xs mt-1">{imageFormErrors.imageFile}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="altText">
                                Alt Text:
                            </label>
                            <input
                                type="text"
                                id="altText"
                                name="altText"
                                value={editingImage?.altText || ''}
                                onChange={handleImageFormChange}
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${imageFormErrors.altText ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Mô tả hình ảnh"
                            />
                            {imageFormErrors.altText && <p className="text-red-500 text-xs mt-1">{imageFormErrors.altText}</p>}
                        </div>
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="primaryImage"
                                name="primary"
                                checked={editingImage?.primary || false}
                                onChange={handleImageFormChange}
                                className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label className="text-gray-700 text-sm font-semibold" htmlFor="primaryImage">
                                Đặt làm ảnh chính
                            </label>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => { setShowImageForm(false); setEditingImage(null); setImageFile(null); setImageFormErrors({}); }}
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

                {/* Phần hiển thị danh sách hình ảnh */}
                {images.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {images.map((image) => (
                            <div key={image.id} className="relative border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
                                <img
                                    src={image.imageUrl || `https://placehold.co/150x150/e0e0e0/000000?text=No+Image`}
                                    alt={image.altText || 'Product image'}
                                    className="w-full h-32 object-cover"
                                    onError={(e) => { // Xử lý lỗi tải ảnh
                                        e.target.onerror = null; // Ngăn chặn vòng lặp vô hạn nếu ảnh placeholder cũng lỗi
                                        e.target.src = `https://placehold.co/150x150/e0e0e0/000000?text=Error+Loading+Image`;
                                        console.error("Lỗi tải ảnh từ URL:", image.imageUrl); // Log lỗi cụ thể
                                    }}
                                />
                                {image.primary && (
                                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Chính
                  </span>
                                )}
                                <div className="p-2 text-center text-sm">
                                    <p className="truncate">{image.altText || 'Không có mô tả'}</p>
                                    <div className="flex justify-center mt-2 space-x-2">
                                        <button
                                            onClick={() => { setEditingImage(image); setShowImageForm(true); }}
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
                                        {!image.primary && (
                                            <button
                                                onClick={() => handleSetPrimaryImage(image.id)}
                                                className="text-green-600 hover:text-green-800 text-xs"
                                                title="Đặt làm ảnh chính"
                                            >
                                                Đặt chính
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !showImageForm && <p className="text-center text-gray-600 mt-4">Chưa có hình ảnh nào.</p>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductImageFormModal;
