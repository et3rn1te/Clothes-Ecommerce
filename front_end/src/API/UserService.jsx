import axiosClient from './axiosClient';

const UserService = {
    // Lấy thông tin profile của user hiện tại
    getUserProfile: async () => {
        try {
            const response = await axiosClient.get('/users/me');
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin profile
    updateUserProfile: async (data) => {
        try {
            const response = await axiosClient.put('/users/me', data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Đổi mật khẩu
    changePassword: async (data) => {
        try {
            const response = await axiosClient.put('/users/me/password', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật avatar
    updateAvatar: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosClient.put('/users/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default UserService; 