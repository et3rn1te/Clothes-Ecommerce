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
    },

    // Xóa mềm người dùng (chỉ dành cho admin)
    // Endpoint: DELETE /users/{userId}
    deleteUser: async (userId) => {
        try {
            const response = await axiosClient.delete(`/users/${userId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // --- Các phương thức dành cho Admin ---

    // Thêm người dùng mới bởi Admin
    adminCreateUser: async (userData) => {
        try {
            const response = await axiosClient.post('/users/admin/create', userData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Cập nhật thông tin người dùng bởi Admin
    adminUpdateUser: async (userId, updatedData) => {
        try {
            const response = await axiosClient.put(`/users/admin/${userId}`, updatedData);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Đặt lại mật khẩu người dùng bởi Admin
    adminResetUserPassword: async (userId, newPassword) => {
        try {
            const response = await axiosClient.put(`/users/admin/${userId}/reset-password?newPassword=${newPassword}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Tìm kiếm người dùng bởi Admin (không phân biệt tài khoản bị vô hiệu hóa)
    // Endpoint: GET /users/admin/search?keyword={keyword}&page={page}&size={size}&sort={sort}
    adminSearchUsers: async (keyword = '', page = 0, size = 10, sort = '') => {
        try {
            const params = new URLSearchParams({ page, size });
            if (keyword) params.append('keyword', keyword);
            if (sort) params.append('sort', sort);

            const response = await axiosClient.get(`/users/admin/search?${params.toString()}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Lấy tất cả người dùng (Admin) - Thường được dùng chung với adminSearchUsers khi không có keyword
    // Endpoint: GET /users/all (Nếu vẫn muốn giữ riêng endpoint này cho getAll)
    // Lưu ý: Nếu adminSearchUsers đã bao gồm việc trả về tất cả khi keyword rỗng, phương thức này có thể không cần thiết.
    // Nếu bạn muốn giữ cả 2, thì đây là cách implement
    adminGetAllUsers: async (page = 0, size = 10, sort = '') => {
        try {
            const params = new URLSearchParams({ page, size });
            if (sort) params.append('sort', sort);

            const response = await axiosClient.get(`/users/all?${params.toString()}`);
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default UserService;