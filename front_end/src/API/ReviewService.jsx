import axiosClient from "./axiosClient";
const ReviewService = {
    addReview: async(body)=> {
        try {
            const response = await axiosClient.post('/review/add',body);
            return response;
        } catch (error) {
            throw error;
        }
    },
    getReviews: async (productId) => {
        try {
            const response = await axiosClient.get('/review/comments/'+productId);
            return response;
        } catch (error) {
            throw error;
        }
    },
}

