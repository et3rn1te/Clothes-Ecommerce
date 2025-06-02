import React, { useState, useEffect } from 'react';
import CategoryService from '../../API/CategoryService';
import CategoryFormModal from '../../components/admin/category/CategoryFormModal';
import CategoryTable from '../../components/admin/category/CategoryTable';
import Pagination from '../../components/common/Pagination';
import CategorySearchBar from '../../components/admin/category/CategorySearchBar';

const CategoryManagementPage = () => {
    // State để lưu trữ danh sách danh mục
    const [categories, setCategories] = useState([]);
    // State cho trạng thái tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State cho lỗi (nếu có)
    const [error, setError] = useState(null);
    // State cho trang hiện tại của phân trang
    const [page, setPage] = useState(0);
    // State cho số lượng danh mục trên mỗi trang
    const [size, setSize] = useState(10);
    // State cho tổng số trang
    const [totalPages, setTotalPages] = useState(0);
    // State cho từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    // State để hiển thị/ẩn modal tạo danh mục
    const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
    // State để hiển thị/ẩn modal cập nhật danh mục
    const [showUpdateCategoryModal, setShowUpdateCategoryModal] = useState(false);
    // State để lưu trữ danh mục được chọn khi cập nhật
    const [selectedCategory, setSelectedCategory] = useState(null);
    // State để hiển thị/ẩn thông báo tùy chỉnh
    const [message, setMessage] = useState('');
    // State cho loại thông báo (thành công, lỗi)
    const [messageType, setMessageType] = useState('');

    // Hàm để hiển thị thông báo tùy chỉnh
    const showCustomMessage = (msg, type = 'success') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000); // Ẩn thông báo sau 3 giây
    };

    // Hàm để lấy danh sách danh mục từ API
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await CategoryService.getAllCategories({
                page,
                size,
                name: searchTerm, // Giả sử API tìm kiếm theo tên
                sort: 'createdAt,desc'
            });
            setCategories(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError('Không thể tải danh sách danh mục. Vui lòng thử lại.');
            showCustomMessage('Không thể tải danh sách danh mục.', 'error');
            console.error('Lỗi khi tải danh mục:', err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect hook để gọi fetchCategories khi page, size hoặc searchTerm thay đổi
    useEffect(() => {
        fetchCategories();
    }, [page, size, searchTerm]);

    // Xử lý thay đổi trang
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Xử lý tạo danh mục mới
    const handleCreateCategory = async (categoryData) => {
        try {
            await CategoryService.createCategory(categoryData);
            setShowCreateCategoryModal(false);
            fetchCategories();
            showCustomMessage('Danh mục đã được tạo thành công!', 'success');
        } catch (err) {
            showCustomMessage('Không thể tạo danh mục. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi tạo danh mục:', err);
        }
    };

    // Xử lý cập nhật danh mục
    const handleUpdateCategory = async (id, categoryData) => {
        try {
            await CategoryService.updateCategory(id, categoryData);
            setShowUpdateCategoryModal(false);
            setSelectedCategory(null);
            fetchCategories();
            showCustomMessage('Danh mục đã được cập nhật thành công!', 'success');
        } catch (err) {
            showCustomMessage('Không thể cập nhật danh mục. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi cập nhật danh mục:', err);
        }
    };

    // Xử lý xóa danh mục
    const handleDeleteCategory = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
            try {
                await CategoryService.deleteCategory(id);
                fetchCategories();
                showCustomMessage('Danh mục đã được xóa thành công!', 'success');
            } catch (err) {
                showCustomMessage('Không thể xóa danh mục. Vui lòng thử lại.', 'error');
                console.error('Lỗi khi xóa danh mục:', err);
            }
        }
    };

    // Xử lý chuyển đổi trạng thái danh mục
    const handleToggleCategoryStatus = async (id) => {
        try {
            await CategoryService.toggleCategoryStatus(id);
            fetchCategories();
            showCustomMessage('Trạng thái danh mục đã được chuyển đổi!', 'success');
        } catch (err) {
            showCustomMessage('Không thể chuyển đổi trạng thái danh mục.', 'error');
            console.error('Lỗi khi chuyển đổi trạng thái:', err);
        }
    };

    return (
        <div className="container mx-auto p-4 font-sans antialiased">
            {/* Custom Message Box */}
            {message && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message}
                </div>
            )}

            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Quản lý danh mục</h1>

            {/* Thanh tìm kiếm và nút thêm danh mục */}
            <CategorySearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowCreateModal={setShowCreateCategoryModal}
            />

            {/* Hiển thị trạng thái tải và lỗi */}
            {loading && <p className="text-center text-gray-600 text-lg py-8">Đang tải danh mục...</p>}
            {error && <p className="text-center text-red-500 text-lg py-8">{error}</p>}

            {/* Hiển thị khi không có danh mục */}
            {!loading && !error && categories.length === 0 && (
                <p className="text-center text-gray-600 text-lg py-8">Không tìm thấy danh mục nào.</p>
            )}

            {/* Bảng hiển thị danh sách danh mục */}
            {!loading && !error && categories.length > 0 && (
                <CategoryTable
                    categories={categories}
                    handleToggleCategoryStatus={handleToggleCategoryStatus}
                    setSelectedCategory={setSelectedCategory}
                    setShowUpdateModal={setShowUpdateCategoryModal}
                    handleDeleteCategory={handleDeleteCategory}
                />
            )}

            {/* Điều khiển phân trang */}
            {!loading && !error && categories.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Modal tạo danh mục mới */}
            {showCreateCategoryModal && (
                <CategoryFormModal
                    title="Thêm danh mục mới"
                    onSubmit={handleCreateCategory}
                    onClose={() => setShowCreateCategoryModal(false)}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {/* Modal cập nhật danh mục */}
            {showUpdateCategoryModal && selectedCategory && (
                <CategoryFormModal
                    title="Cập nhật danh mục"
                    category={selectedCategory}
                    onSubmit={handleUpdateCategory}
                    onClose={() => {
                        setShowUpdateCategoryModal(false);
                        setSelectedCategory(null);
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}
        </div>
    );
};

export default CategoryManagementPage;
