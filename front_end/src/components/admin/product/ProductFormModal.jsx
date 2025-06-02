// src/components/admin/product/ProductFormModal.jsx
import React, { useState, useEffect } from 'react';
import ProductInfoForm from './ProductInfoForm';

// Import các service cần thiết để tải dữ liệu dropdown
import CategoryService from '../../../API/CategoryService';
import BrandService from '../../../API/BrandService';
import GenderService from '../../../API/GenderService';

// Import react-hook-form và yup
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Schema validation chính cho ProductFormModal
const productFormSchema = yup.object().shape({
    name: yup.string().required('Tên sản phẩm là bắt buộc').min(3, 'Tên sản phẩm phải có ít nhất 3 ký tự').max(100, 'Tên sản phẩm không quá 100 ký tự'),
    description: yup.string().max(2000, 'Mô tả không quá 2000 ký tự').nullable(),
    basePrice: yup.number().required('Giá gốc là bắt buộc').typeError('Giá gốc phải là số').min(0.01, 'Giá gốc phải lớn hơn 0'),
    slug: yup.string().required('Slug là bắt buộc'),
    brandId: yup.number().required('Thương hiệu là bắt buộc').typeError('Thương hiệu là bắt buộc').min(1, 'Thương hiệu không hợp lệ'),
    genderId: yup.number().required('Giới tính là bắt buộc').typeError('Giới tính là bắt buộc').min(1, 'Giới tính không hợp lệ'),
    categoryIds: yup.array().min(1, 'Phải chọn ít nhất một danh mục').required('Danh mục là bắt buộc').typeError('Danh mục là bắt buộc'),
    featured: yup.boolean().required(),
    active: yup.boolean().required(),
});


const ProductFormModal = ({ title, product, onSubmit, onClose, showCustomMessage }) => {
    // States cho dữ liệu dropdown
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [genders, setGenders] = useState([]);

    // Khởi tạo react-hook-form
    const methods = useForm({
        resolver: yupResolver(productFormSchema),
        defaultValues: product ? {
            ...product,
            brandId: product.brand?.id || '', // Lấy ID từ đối tượng brand
            genderId: product.gender?.id || '', // Lấy ID từ đối tượng gender
            categoryIds: product.categories?.map(cat => cat.id) || [], // Lấy mảng IDs từ categories
            description: product.description || '', // Đảm bảo description không null/undefined
        } : {
            name: '', description: '', basePrice: '', slug: '',
            brandId: '', genderId: '', categoryIds: [],
            featured: false, active: true,
        },
    });

    const { handleSubmit, reset } = methods;

    // useEffect để fetch brands, categories, genders
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [brandRes, categoryRes, genderRes] = await Promise.all([
                    BrandService.getAllBrands(),
                    CategoryService.getAllCategories({ page: 0, size: 1000 }),
                    GenderService.getAllGenders(),
                ]);

                setBrands(brandRes.data);
                setCategories(categoryRes.data.content);
                setGenders(genderRes.data);

                // Reset form with fetched data if product is for update
                if (product) {
                    reset({
                        ...product,
                        brandId: product.brand?.id || '',
                        genderId: product.gender?.id || '',
                        categoryIds: product.categories?.map(cat => cat.id) || [],
                        description: product.description || '',
                    });
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err);
                showCustomMessage("Không thể tải dữ liệu cần thiết.", "error");
            }
        };

        fetchData();
    }, [product, reset, showCustomMessage]);


    // Xử lý submit form sản phẩm chính
    const handleSubmitMainProduct = (data) => {
        const dataToSubmit = {
            name: data.name,
            description: data.description || null,
            basePrice: parseFloat(data.basePrice),
            slug: data.slug,
            brandId: Number(data.brandId),
            genderId: Number(data.genderId),
            categoryIds: data.categoryIds.map(id => Number(id)),
            featured: data.featured,
            active: data.active,
        };

        console.log("Data to submit from ProductFormModal:", dataToSubmit);
        onSubmit(product ? product.id : null, dataToSubmit);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleSubmitMainProduct)}>
                        {/* --- Thông tin sản phẩm chính --- */}
                        <ProductInfoForm
                            brands={brands}
                            categories={categories}
                            genders={genders}
                        />

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {product ? 'Cập nhật' : 'Thêm sản phẩm'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default ProductFormModal;
