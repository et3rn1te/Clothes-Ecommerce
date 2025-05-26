import axiosClient from './axiosClient';

const ProductImageService = {
    // Tạo hình ảnh mới cho sản phẩm
    createImage: async (productId, formData) => {
        try {
            const response = await axiosClient.post(
                `/products/${productId}/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error(`Lỗi khi tạo hình ảnh cho sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Cập nhật thông tin hình ảnh
    updateImage: async (imageId, formData) => {
        try {
            const response = await axiosClient.put(
                `/products/images/${imageId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response;
        } catch (error) {
            console.error(`Lỗi khi cập nhật hình ảnh ${imageId}:`, error);
            throw error;
        }
    },

    // Xóa hình ảnh
    deleteImage: async (imageId) => {
        try {
            const response = await axiosClient.delete(`/products/images/${imageId}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi xóa hình ảnh ${imageId}:`, error);
            throw error;
        }
    },

    // Lấy thông tin chi tiết hình ảnh theo ID
    getImageById: async (imageId) => {
        try {
            const response = await axiosClient.get(`/products/images/${imageId}`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy thông tin hình ảnh ${imageId}:`, error);
            throw error;
        }
    },

    // Lấy danh sách hình ảnh của sản phẩm
    getImagesByProduct: async (productId) => {
        try {
            const response = await axiosClient.get(`/products/${productId}/images`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi lấy danh sách hình ảnh của sản phẩm ${productId}:`, error);
            throw error;
        }
    },

    // Chuyển đổi trạng thái hình ảnh
    toggleImageStatus: async (imageId) => {
        try {
            const response = await axiosClient.patch(`/products/images/${imageId}/toggle`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi chuyển đổi trạng thái hình ảnh ${imageId}:`, error);
            throw error;
        }
    },

    // Đặt hình ảnh làm ảnh chính
    setPrimaryImage: async (imageId) => {
        try {
            const response = await axiosClient.patch(`/products/images/${imageId}/set-primary`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi đặt hình ảnh ${imageId} làm ảnh chính:`, error);
            throw error;
        }
    },

    // Xóa tất cả hình ảnh của sản phẩm
    deleteImagesByProduct: async (productId) => {
        try {
            const response = await axiosClient.delete(`/products/${productId}/images`);
            return response;
        } catch (error) {
            console.error(`Lỗi khi xóa tất cả hình ảnh của sản phẩm ${productId}:`, error);
            throw error;
        }
    }
};

export default ProductImageService; 