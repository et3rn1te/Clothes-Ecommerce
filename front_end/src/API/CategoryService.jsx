import axiosClient from './axiosClient';

const CategoryService = {
    getAllCategories: async (params) => {
        try {
            // const queryParams = new URLSearchParams({
            //     page: params.page || 0,
            //     size: params.size || 6,
            //     sort: params.sort || 'name,asc'
            // });

            // Original fetch for all categories - might not be needed anymore if only using subcategories
            // Keeping for now if getAllCategories is used elsewhere
            const response = await fetch(`http://localhost:8080/api/categories`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Add default images for categories that don't have images (still useful if getAllCategories is used)
            const categoryImages = {
                "Men's Fashion": 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=300&fit=crop',
                "Women's Fashion": 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
                "Accessories": 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
                "Men's T-Shirts": 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
                "Men's Jeans": 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop',
                "Women's Dresses": 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop',
                "Women's Skirts": 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=300&fit=crop',
                "Bags": 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
                "Hats": 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=300&fit=crop'
            };

            // Enhance categories with images and filter only parent categories for main display
            const enhancedContent = data.content
                .filter(category => category.parentId === null) // Only show main categories
                .map(category => ({
                    ...category,
                    imageUrl: categoryImages[category.name] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop'
                }));

            return {
                data: {
                    ...data,
                    content: enhancedContent
                }
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    // New method to get subcategories by parent ID
    getSubCategoriesByParentId: async (parentId) => {
        try {
            // Assuming your backend endpoint is /api/categories/{parentId}/subcategories
            const response = await axiosClient.get(`/categories/${parentId}/subcategories`);
            return response;
        } catch (error) {
            console.error(`Error fetching subcategories for parent ID ${parentId}:`, error);
            throw error;
        }
    },

    // New method to get category by name
    getCategoryByName: async (name) => {
        try {
            // Assuming your backend endpoint is /api/categories/name/{name}
            const response = await axiosClient.get(`/categories/name/${name}`);
            return response;
        } catch (error) {
            console.error(`Error fetching category by name ${name}:`, error);
            throw error;
        }
    },

    // New method to get category by slug
    getCategoryBySlug: async (slug) => {
        try {
            const response = await axiosClient.get(`/categories/slug/${slug}`);
            return response;
        } catch (error) {
            console.error(`Error fetching category by slug ${slug}:`, error);
            throw error;
        }
    },

    // New method to check if a slug exists
    checkSlugExists: async (slug) => {
        try {
            const response = await axiosClient.get('/categories/check-slug', {
                params: { slug }
            });
            return response;
        } catch (error) {
            console.error(`Error checking if slug ${slug} exists:`, error);
            throw error;
        }
    }
};

export default CategoryService; 