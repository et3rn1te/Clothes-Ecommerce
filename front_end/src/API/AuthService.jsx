import axiosClient from "./axiosClient";

const signIn = async (body) => {
    return await axiosClient.post('/auth/login', body);
};

const register = async (body) => {
    return await axiosClient.post('', body);
};

export { signIn ,register};