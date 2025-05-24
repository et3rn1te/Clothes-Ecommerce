import axiosClient from './axiosClient';

const ProductVariantService = {
  // Lấy danh sách biến thể của sản phẩm
  getVariantsByProduct: (productId) => {
    return axiosClient.get(`/products/${productId}/variants`);
  },

  // Lấy chi tiết một biến thể
  getVariantById: (variantId) => {
    return axiosClient.get(`/products/variants/${variantId}`);
  },

  // Lấy biến thể theo SKU
  getVariantBySku: (sku) => {
    return axiosClient.get(`/products/${sku}`);
  },

  // Kiểm tra biến thể tồn tại
  checkVariantExists: (productId, colorId, sizeId) => {
    return axiosClient.get(`/products/${productId}/variants/check-exists`, {
      params: { colorId, sizeId }
    });
  }
};

export default ProductVariantService; 