import axiosClient from './axiosClient';

const ProductService = {
  getAllProducts: (params) => {
    return axiosClient.get('/products', { params });
  },

  getFeaturedProducts: (params) => {
    return axiosClient.get('/products/featured', { params });
  },

  getProductById: (id) => {
    return axiosClient.get(`/products/${id}`);
  },

  getProductBySlug: (slug) => {
    return axiosClient.get(`/products/slug/${slug}`);
  },

  checkSlugExists: (slug) => {
    return axiosClient.get('/products/check-slug', {
      params: { slug }
    });
  },

  searchProducts: (keyword, params) => {
    return axiosClient.get('/products/search', {
      params: {
        keyword,
        ...params
      }
    });
  },

  getProductsByBrand: (brandId) => {
    return axiosClient.get(`/products/brand/${brandId}`);
  },

  getProductsByCategory: (categoryId) => {
    return axiosClient.get(`/products/category/${categoryId}`);
  },

  getProductsByGender: (genderId) => {
    return axiosClient.get(`/products/gender/${genderId}`);
  },

  getProductsByCategoryName: (categoryName, params) => {
    return axiosClient.get(`/products/category/name/${encodeURIComponent(categoryName)}`, {
      params: {
        ...params
      }
    });
  }
};

export default ProductService; 