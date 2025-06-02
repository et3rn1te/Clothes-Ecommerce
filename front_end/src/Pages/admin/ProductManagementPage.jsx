import React, { useState, useEffect } from 'react';
import ProductService from '../../API/ProductService';
import ProductFormModal from '../../components/admin/product/ProductFormModal';
import ProductTable from '../../components/admin/product/ProductTable';
import Pagination from '../../components/common/Pagination';
import ProductSearchBar from '../../components/admin/product/ProductSearchBar';
// CategoryFormModal đã được di chuyển sang CategoryManagementPage
// import CategoryFormModal from '../../components/admin/product/CategoryFormModal';

const ProductManagementPage = () => {
    // State để lưu trữ danh sách sản phẩm
    const [products, setProducts] = useState([]);
    // State cho trạng thái tải dữ liệu
    const [loading, setLoading] = useState(true);
    // State cho lỗi (nếu có)
    const [error, setError] = useState(null);
    // State cho trang hiện tại của phân trang
    const [page, setPage] = useState(0);
    // State cho số lượng sản phẩm trên mỗi trang
    const [size, setSize] = useState(10);
    // State cho tổng số trang
    const [totalPages, setTotalPages] = useState(0);
    // State cho từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    // State để hiển thị/ẩn modal tạo sản phẩm
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    // State để hiển thị/ẩn modal cập nhật sản phẩm
    const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);
    // State để lưu trữ sản phẩm được chọn khi cập nhật
    const [selectedProduct, setSelectedProduct] = useState(null);
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

    // Hàm để lấy danh sách sản phẩm từ API
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            let response;
            if (searchTerm) {
                // Nếu có từ khóa tìm kiếm, sử dụng API searchProducts
                response = await ProductService.searchProducts(searchTerm, {
                    page,
                    size,
                    sort: 'createdAt,desc' // Sắp xếp mặc định theo thời gian tạo giảm dần
                });
            } else {
                // Nếu không có từ khóa tìm kiếm, sử dụng API getAllProducts
                response = await ProductService.getAllProducts({
                    page,
                    size,
                    sort: 'createdAt,desc' // Sắp xếp mặc định theo thời gian tạo giảm dần
                });
            }
            setProducts(response.data.content); // Cập nhật danh sách sản phẩm
            setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
        } catch (err) {
            setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại.');
            showCustomMessage('Không thể tải danh sách sản phẩm.', 'error');
            console.error('Lỗi khi tải sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    // useEffect hook để gọi fetchProducts khi page, size hoặc searchTerm thay đổi
    useEffect(() => {
        fetchProducts();
    }, [page, size, searchTerm]);

    // Xử lý thay đổi trang cho component Pagination của bạn
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Xử lý tạo sản phẩm mới
    const handleCreateProduct = async (productData) => {
        try {
            // Gọi API createProduct từ ProductService
            await ProductService.createProduct(productData);
            setShowCreateProductModal(false); // Đóng modal
            fetchProducts(); // Tải lại danh sách sản phẩm
            showCustomMessage('Sản phẩm đã được tạo thành công!', 'success');
        } catch (err) {
            setError('Không thể tạo sản phẩm. Vui lòng kiểm tra dữ liệu.');
            showCustomMessage('Không thể tạo sản phẩm. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi tạo sản phẩm:', err);
        }
    };

    // Xử lý cập nhật sản phẩm
    const handleUpdateProduct = async (id, productData) => {
        try {
            // Gọi API updateProduct từ ProductService
            await ProductService.updateProduct(id, productData);
            setShowUpdateProductModal(false); // Đóng modal
            setSelectedProduct(null); // Xóa sản phẩm đã chọn
            fetchProducts(); // Tải lại danh sách sản phẩm
            showCustomMessage('Sản phẩm đã được cập nhật thành công!', 'success');
        } catch (err) {
            setError('Không thể cập nhật sản phẩm. Vui lòng kiểm tra dữ liệu.');
            showCustomMessage('Không thể cập nhật sản phẩm. Vui lòng kiểm tra dữ liệu.', 'error');
            console.error('Lỗi khi cập nhật sản phẩm:', err);
        }
    };

    // Xử lý xóa sản phẩm
    const handleDeleteProduct = async (id) => {
        // Sử dụng modal tùy chỉnh thay vì window.confirm
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
            try {
                // Gọi API deleteProduct từ ProductService
                await ProductService.deleteProduct(id);
                fetchProducts(); // Tải lại danh sách sản phẩm
                showCustomMessage('Sản phẩm đã được xóa thành công!', 'success');
            } catch (err) {
                setError('Không thể xóa sản phẩm. Vui lòng thử lại.');
                showCustomMessage('Không thể xóa sản phẩm. Vui lòng thử lại.', 'error');
                console.error('Lỗi khi xóa sản phẩm:', err);
            }
        }
    };

    // Xử lý chuyển đổi trạng thái hoạt động của sản phẩm
    const handleToggleStatus = async (id) => {
        try {
            // Gọi API toggleProductStatus từ ProductService
            await ProductService.toggleProductStatus(id);
            fetchProducts(); // Tải lại danh sách sản phẩm
            showCustomMessage('Trạng thái sản phẩm đã được chuyển đổi!', 'success');
        } catch (err) {
            setError('Không thể chuyển đổi trạng thái sản phẩm.');
            showCustomMessage('Không thể chuyển đổi trạng thái sản phẩm.', 'error');
            console.error('Lỗi khi chuyển đổi trạng thái:', err);
        }
    };

    // Xử lý chuyển đổi trạng thái nổi bật của sản phẩm
    const handleToggleFeatured = async (id) => {
        try {
            // Gọi API toggleFeaturedStatus từ ProductService
            await ProductService.toggleFeaturedStatus(id);
            fetchProducts(); // Tải lại danh sách sản phẩm
            showCustomMessage('Trạng thái nổi bật của sản phẩm đã được chuyển đổi!', 'success');
        } catch (err) {
            setError('Không thể chuyển đổi trạng thái nổi bật.');
            showCustomMessage('Không thể chuyển đổi trạng thái nổi bật.', 'error');
            console.error('Lỗi khi chuyển đổi nổi bật:', err);
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

            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Quản lý sản phẩm</h1>

            {/* Thanh tìm kiếm và nút thêm sản phẩm */}
            <ProductSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setShowCreateModal={setShowCreateProductModal}
            />

            {/* Hiển thị trạng thái tải và lỗi */}
            {loading && <p className="text-center text-gray-600 text-lg py-8">Đang tải sản phẩm...</p>}
            {error && <p className="text-center text-red-500 text-lg py-8">{error}</p>}

            {/* Hiển thị khi không có sản phẩm */}
            {!loading && !error && products.length === 0 && (
                <p className="text-center text-gray-600 text-lg py-8">Không tìm thấy sản phẩm nào.</p>
            )}

            {/* Bảng hiển thị danh sách sản phẩm */}
            {!loading && !error && products.length > 0 && (
                <ProductTable
                    products={products}
                    handleToggleStatus={handleToggleStatus}
                    handleToggleFeatured={handleToggleFeatured}
                    setSelectedProduct={setSelectedProduct}
                    setShowUpdateModal={setShowUpdateProductModal}
                    handleDeleteProduct={handleDeleteProduct}
                />
            )}

            {/* Điều khiển phân trang */}
            {!loading && !error && products.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Modal tạo sản phẩm mới */}
            {showCreateProductModal && (
                <ProductFormModal
                    title="Thêm sản phẩm mới"
                    product={null} // Không có sản phẩm để chỉnh sửa khi tạo mới
                    onSubmit={handleCreateProduct}
                    onClose={() => setShowCreateProductModal(false)}
                    showCustomMessage={showCustomMessage}
                />
            )}

            {/* Modal cập nhật sản phẩm */}
            {showUpdateProductModal && selectedProduct && (
                <ProductFormModal
                    title="Cập nhật sản phẩm"
                    product={selectedProduct}
                    onSubmit={handleUpdateProduct}
                    onClose={() => {
                        setShowUpdateProductModal(false);
                        setSelectedProduct(null);
                    }}
                    showCustomMessage={showCustomMessage}
                />
            )}
        </div>
    );
};

export default ProductManagementPage;
