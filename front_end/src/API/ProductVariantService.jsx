import axiosClient from './axiosClient';

const ProductVariantService = {
  // Tạo biến thể mới cho sản phẩm
  createVariant: async (productId, variantData) => {
    try {
      const response = await axiosClient.post(
        `/products/${productId}/variants`,
        variantData
      );
      return response;
    } catch (error) {
      console.error(`Lỗi khi tạo biến thể cho sản phẩm ${productId}:`, error);
      throw error;
    }
  },

  // Cập nhật thông tin biến thể
  updateVariant: async (variantId, variantData) => {
    try {
      const response = await axiosClient.put(
        `/products/variants/${variantId}`,
        variantData
      );
      return response;
    } catch (error) {
      console.error(`Lỗi khi cập nhật biến thể ${variantId}:`, error);
      throw error;
    }
  },

  // Xóa biến thể
  deleteVariant: async (variantId) => {
    try {
      const response = await axiosClient.delete(`/products/variants/${variantId}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi xóa biến thể ${variantId}:`, error);
      throw error;
    }
  },

  // Lấy thông tin chi tiết biến thể theo ID
  getVariantById: async (variantId) => {
    try {
      const response = await axiosClient.get(`/products/variants/${variantId}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin biến thể ${variantId}:`, error);
      throw error;
    }
  },

  // Lấy danh sách biến thể của sản phẩm
  getVariantsByProduct: async (productId) => {
    try {
      const response = await axiosClient.get(`/products/${productId}/variants`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách biến thể của sản phẩm ${productId}:`, error);
      throw error;
    }
  },

  // Chuyển đổi trạng thái biến thể
  toggleVariantStatus: async (variantId) => {
    try {
      const response = await axiosClient.patch(`/products/variants/${variantId}/toggle`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi chuyển đổi trạng thái biến thể ${variantId}:`, error);
      throw error;
    }
  },

  // Kiểm tra biến thể đã tồn tại chưa
  checkVariantExists: async (productId, colorId, sizeId) => {
    try {
      const response = await axiosClient.get(
        `/products/${productId}/variants/check-exists`,
        {
          params: {
            colorId,
            sizeId
          }
        }
      );
      return response;
    } catch (error) {
      console.error(`Lỗi khi kiểm tra biến thể tồn tại:`, error);
      throw error;
    }
  },

  // Lấy biến thể theo mã SKU
  getVariantBySku: async (sku) => {
    try {
      const response = await axiosClient.get(`/products/variants/sku/${sku}`);
      return response;
    } catch (error) {
      console.error(`Lỗi khi lấy biến thể theo SKU ${sku}:`, error);
      throw error;
    }
  }
};

export default ProductVariantService; 