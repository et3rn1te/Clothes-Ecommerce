import React, { useState, useEffect } from 'react';
import ProductInfoForm from './ProductInfoForm'; // Component mới
import ProductVariantsSection from './ProductVariantsSection'; // Component mới
import ProductImagesSection from './ProductImageSection.jsx';     // Component mới

const ProductFormModal = ({ title, product, onSubmit, onClose, showCustomMessage }) => {
    // State cho thông tin sản phẩm chính
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        slug: '',
        brandId: '',
        genderId: '',
        categoryIds: [],
        featured: false,
        active: true,
    });
    const [errors, setErrors] = useState({});

    // States cho biến thể sản phẩm và hình ảnh (được quản lý trong các component con)
    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]);

    // State cho hộp thoại xác nhận tùy chỉnh
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);

    // useEffect để điền dữ liệu sản phẩm vào form khi ở chế độ cập nhật
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                basePrice: product.basePrice || '',
                slug: product.slug || '',
                brandId: product.brandId || '',
                genderId: product.genderId || '',
                categoryIds: product.categoryIds || [],
                featured: product.featured,
                active: product.active,
            });
            // Khi chỉnh sửa sản phẩm, tải các biến thể và hình ảnh của nó
            // Logic tải này sẽ được chuyển vào ProductVariantsSection và ProductImagesSection
            // và được kích hoạt bởi prop `productId` hoặc `product` của chúng.
        } else {
            // Reset form khi tạo sản phẩm mới
            setFormData({
                name: '', description: '', basePrice: '', slug: '',
                brandId: '', genderId: '', categoryIds: [],
                featured: false, active: true,
            });
            setVariants([]); // Reset biến thể
            setImages([]);   // Reset hình ảnh
        }
        setErrors({}); // Reset lỗi
    }, [product]);

    // Hàm validate form sản phẩm chính
    const validateProductForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Tên sản phẩm là bắt buộc.';
        if (!formData.basePrice || parseFloat(formData.basePrice) <= 0) newErrors.basePrice = 'Giá gốc phải lớn hơn 0.';
        if (!formData.slug) newErrors.slug = 'Slug là bắt buộc.';
        if (!formData.brandId) newErrors.brandId = 'Thương hiệu là bắt buộc.';
        if (!formData.genderId) newErrors.genderId = 'Giới tính là bắt buộc.';
        if (formData.categoryIds.length === 0) newErrors.categoryIds = 'Danh mục là bắt buộc.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý submit form sản phẩm chính
    const handleSubmitMainProduct = async (e) => {
        e.preventDefault();
        if (validateProductForm()) {
            const dataToSubmit = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                brandId: Number(formData.brandId),
                genderId: Number(formData.genderId),
            };
            onSubmit(product ? product.id : null, dataToSubmit);
        }
    };

    // Hàm hiển thị hộp thoại xác nhận tùy chỉnh
    const showConfirmation = (message, action) => {
        setConfirmDialogMessage(message);
        setOnConfirmAction(() => action);
        setShowConfirmDialog(true);
    };

    const handleConfirm = () => {
        if (onConfirmAction) {
            onConfirmAction();
        }
        setShowConfirmDialog(false);
        setOnConfirmAction(null);
    };

    const handleCancelConfirm = () => {
        setShowConfirmDialog(false);
        setOnConfirmAction(null);
    };


    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>

                {/* Form thông tin sản phẩm chính */}
                <ProductInfoForm
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                    setErrors={setErrors}
                    onSubmit={handleSubmitMainProduct}
                    onClose={onClose}
                />

                {/* Quản lý Biến thể và Hình ảnh chỉ hiển thị khi cập nhật sản phẩm */}
                {product && (
                    <>
                        {/* Phần quản lý Biến thể */}
                        <ProductVariantsSection
                            productId={product.id}
                            showCustomMessage={showCustomMessage}
                            showConfirmation={showConfirmation}
                            variants={variants}
                            setVariants={setVariants}
                        />

                        {/* Phần quản lý Hình ảnh */}
                        <ProductImagesSection
                            productId={product.id}
                            showCustomMessage={showCustomMessage}
                            showConfirmation={showConfirmation}
                            images={images}
                            setImages={setImages}
                        />
                    </>
                )}

                {/* Custom Confirmation Dialog */}
                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm text-center">
                            <p className="text-lg font-semibold mb-6 text-gray-800">{confirmDialogMessage}</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={handleConfirm}
                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={handleCancelConfirm}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-5 rounded-lg shadow-md transition duration-300"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFormModal;
