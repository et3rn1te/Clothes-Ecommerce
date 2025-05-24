import axiosClient from "./axiosClient";

const addOrder = async (body,token) => {
    return await axiosClient.post('/order/add',body,{
        headers : {
            Authorization: `Bearer ${token}`
        }
    });
}

export {addOrder};