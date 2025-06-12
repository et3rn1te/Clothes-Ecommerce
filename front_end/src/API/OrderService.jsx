import { update } from "lodash";
import axiosClient from "./axiosClient";

const OrderService = {
    updateOrder: async(orderId,statusId,token)=>{
        return axiosClient.put('/order/update',{orderId,statusId},
            {headers:{Authorization: `Bearer ${token}`}}
        );
    },

}
export default OrderService;