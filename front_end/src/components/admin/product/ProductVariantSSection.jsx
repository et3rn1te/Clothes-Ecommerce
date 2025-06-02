import React, { useState, useEffect } from 'react';
import ProductVariantService from '../../../API/ProductVariantService';

// Mock Services (Giả lập) cho Size và Color - Trong thực tế bạn sẽ import các service thật
const SizeService = {
    getAllSizes: async () => {
        return {
            data: {
                content: [
                    { id: 1, name: 'S' },
                    { id: 2, name: 'M' },
                    { id: 3, name: 'L' },
                    { id: 4, name: 'XL' },
                ],
            },
        };
    },
};

const ColorService = {
    getAllColors: async () => {
        return {
            data: {
                content: [
                    { id: 1, name: 'Red' },
                    { id: 2, name: 'Blue' },
                    { id: 3, name: 'Green' },
                    { id: 4, name: 'Black' },
                    { id: 5, name: 'White' },
                ],
            },
        };
    },
};


const ProductVariantsSection = ({ productId, showCustomMessage, showConfirmation, variants, setVariants }) => {
    const [editingVariant, setEditingVariant] = useState(null);
    const [showVariantForm, setShowVariantForm] = useState(false);
    const [variantFormErrors, setVariantFormErrors] = useState({});
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);

    // Tải biến thể, kích thước và màu sắc khi component mount hoặc productId thay đổi
    useEffect(() => {
        const fetchVariantData = async () => {
            try {
                if (productId) {
                    const variantsRes = await ProductVariantService.getVariantsByProduct(productId);
                    setVariants(variantsRes.data.content || []);
                }
                const sizeRes = await SizeService.getAllSizes();
                setAvailableSizes(sizeRes.data.content || []);
                const colorRes = await ColorService.getAllColors();
                setAvailableColors(colorRes.data.content || []);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu biến thể:', err);
                showCustomMessage('Lỗi khi tải biến thể hoặc dữ liệu liên quan.', 'error');
            }
        };
        fetchVariantData();
    }, [productId, showCustomMessage, setVariants]);

    const handleVariantFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditingVariant((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setVariantFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateVariantForm = (variantData) => {
        let newErrors = {};
        if (!variantData.sku) newErrors.sku = 'SKU là bắt buộc.';
        if (!variantData.price || parseFloat(variantData.price) <= 0) newErrors.price = 'Giá phải lớn hơn 0.';
        if (variantData.stockQuantity === null || variantData.stockQuantity < 0) newErrors.stockQuantity = 'Số lượng tồn kho không hợp lệ.';
        if (!variantData.colorId) newErrors.colorId = 'Màu sắc là bắt buộc.';
        if (!variantData.sizeId) newErrors.sizeId = 'Kích thước là bắt buộc.';
        setVariantFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveVariant = async (e) => {
        e.preventDefault();
        if (!editingVariant) return;

        if (!productId) {
            showCustomMessage('Vui lòng tạo sản phẩm chính trước khi thêm biến thể.', 'error');
            return;
        }

        const variantData = {
            ...editingVariant,
            productId: productId,
            price: parseFloat(editingVariant.price),
            stockQuantity: parseInt(editingVariant.stockQuantity, 10),
            colorId: Number(editingVariant.colorId),
            sizeId: Number(editingVariant.sizeId),
            weightInKg: editingVariant.weightInKg ? parseFloat(editingVariant.weightInKg) : null,
        };

        if (!validateVariantForm(variantData)) return;

        try {
            if (editingVariant.id) {
                await ProductVariantService.updateVariant(editingVariant.id, variantData);
                showCustomMessage('Biến thể đã được cập nhật thành công!', 'success');
            } else {
                await ProductVariantService.createVariant(productId, variantData);
                showCustomMessage('Biến thể đã được tạo thành công!', 'success');
            }
            const updatedVariants = await ProductVariantService.getVariantsByProduct(productId);
            setVariants(updatedVariants.data.content || []);
            setShowVariantForm(false);
            setEditingVariant(null);
            setVariantFormErrors({});
        } catch (err) {
            console.error('Lỗi khi lưu biến thể:', err);
            showCustomMessage('Không thể lưu biến thể. Vui lòng thử lại.', 'error');
        }
    };

    const handleDeleteVariant = (variantId) => {
        showConfirmation('Bạn có chắc chắn muốn xóa biến thể này không?', async () => {
            try {
                await ProductVariantService.deleteVariant(variantId);
                const updatedVariants = await ProductVariantService.getVariantsByProduct(productId);
                setVariants(updatedVariants.data.content || []);
                showCustomMessage('Biến thể đã được xóa thành công!', 'success');
            } catch (err) {
                console.error('Lỗi khi xóa biến thể:', err);
                showCustomMessage('Không thể xóa biến thể. Vui lòng thử lại.', 'error');
            }
        });
    };

    const handleToggleVariantStatus = async (variantId) => {
        try {
            await ProductVariantService.toggleVariantStatus(variantId);
            const updatedVariants = await ProductVariantService.getVariantsByProduct(productId);
            setVariants(updatedVariants.data.content || []);
            showCustomMessage('Trạng thái biến thể đã được chuyển đổi!', 'success');
        } catch (err) {
            console.error('Lỗi khi chuyển đổi trạng thái biến thể:', err);
            showCustomMessage('Không thể chuyển đổi trạng thái biến thể. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Biến thể sản phẩm</h3>
            <button
                onClick={() => {
                    setEditingVariant({ // Reset form cho biến thể mới
                        sku: '', price: '', stockQuantity: '', weightInKg: '',
                        sizeId: '', colorId: '', active: true,
                    });
                    setShowVariantForm(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 mb-4"
            >
                Thêm biến thể mới
            </button>

            {showVariantForm && (
                <form onSubmit={handleSaveVariant} className="bg-gray-50 p-6 rounded-lg shadow-inner mb-6">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">{editingVariant?.id ? 'Chỉnh sửa biến thể' : 'Thêm biến thể'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">SKU:</label>
                            <input
                                type="text"
                                name="sku"
                                value={editingVariant?.sku || ''}
                                onChange={handleVariantFormChange}
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${variantFormErrors.sku ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="SKU"
                            />
                            {variantFormErrors.sku && <p className="text-red-500 text-xs mt-1">{variantFormErrors.sku}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Giá:</label>
                            <input
                                type="number"
                                name="price"
                                value={editingVariant?.price || ''}
                                onChange={handleVariantFormChange}
                                step="0.01"
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${variantFormErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Giá"
                            />
                            {variantFormErrors.price && <p className="text-red-500 text-xs mt-1">{variantFormErrors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Số lượng tồn kho:</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={editingVariant?.stockQuantity || ''}
                                onChange={handleVariantFormChange}
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${variantFormErrors.stockQuantity ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Số lượng"
                            />
                            {variantFormErrors.stockQuantity && <p className="text-red-500 text-xs mt-1">{variantFormErrors.stockQuantity}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Cân nặng (kg):</label>
                            <input
                                type="number"
                                name="weightInKg"
                                value={editingVariant?.weightInKg || ''}
                                onChange={handleVariantFormChange}
                                step="0.01"
                                className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                                placeholder="Cân nặng"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Kích thước:</label>
                            <select
                                name="sizeId"
                                value={editingVariant?.sizeId || ''}
                                onChange={handleVariantFormChange}
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${variantFormErrors.sizeId ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Chọn kích thước</option>
                                {availableSizes.map(size => (
                                    <option key={size.id} value={size.id}>{size.name}</option>
                                ))}
                            </select>
                            {variantFormErrors.sizeId && <p className="text-red-500 text-xs mt-1">{variantFormErrors.sizeId}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Màu sắc:</label>
                            <select
                                name="colorId"
                                value={editingVariant?.colorId || ''}
                                onChange={handleVariantFormChange}
                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${variantFormErrors.colorId ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Chọn màu sắc</option>
                                {availableColors.map(color => (
                                    <option key={color.id} value={color.id}>{color.name}</option>
                                ))}
                            </select>
                            {variantFormErrors.colorId && <p className="text-red-500 text-xs mt-1">{variantFormErrors.colorId}</p>}
                        </div>
                    </div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="variantActive"
                            name="active"
                            checked={editingVariant?.active || false}
                            onChange={handleVariantFormChange}
                            className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label className="text-gray-700 text-sm font-semibold" htmlFor="variantActive">
                            Hoạt động
                        </label>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => { setShowVariantForm(false); setEditingVariant(null); setVariantFormErrors({}); }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            Lưu biến thể
                        </button>
                    </div>
                </form>
            )}

            {variants.length > 0 ? (
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">SKU</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tồn kho</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Kích thước</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Màu sắc</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hoạt động</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {variants.map((variant) => (
                            <tr key={variant.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{variant.sku}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{variant.stockQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {availableSizes.find(s => s.id === variant.sizeId)?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {availableColors.find(c => c.id === variant.colorId)?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${variant.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {variant.active ? 'Có' : 'Không'}
                    </span>
                                    <button
                                        onClick={() => handleToggleVariantStatus(variant.id)}
                                        className="ml-2 text-blue-600 hover:text-blue-800 text-xs"
                                        title="Chuyển đổi trạng thái"
                                    >
                                        Chuyển đổi
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => { setEditingVariant(variant); setShowVariantForm(true); }}
                                        className="text-indigo-600 hover:text-indigo-800 mr-2"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => handleDeleteVariant(variant.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !showVariantForm && <p className="text-center text-gray-600 mt-4">Chưa có biến thể nào.</p>
            )}
        </div>
    );
};

export default ProductVariantsSection;
