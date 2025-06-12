import React, { useContext, useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiShoppingBag, FiStar, FiInfo ,FiChevronUp,FiX} from "react-icons/fi";
import axiosClient from "../API/axiosClient";
import { introspect } from "../API/AuthService";
import { handler } from "@tailwindcss/aspect-ratio";
import OrderService from "../API/OrderService";
import { FavoriteContext } from "../components/FavoriteContext/FavoriteContext";
import ReviewService from "../API/ReviewService";

const cancelReasons = [
  "Thay đổi địa chỉ giao hàng",
  "Thay đổi phương thức thanh toán",
  "Tìm thấy sản phẩm giá tốt hơn",
  "Đổi ý không muốn mua nữa",
  "Lý do khác"
];
const OrderHistory = () => {
  const { session } = useContext(FavoriteContext);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderList,setOrderList] =useState([]);
  
  const checkToken = async (token) => {
    try {
      const response = await introspect({token});
      console.log(response.data.result.valid);
      return response.data.result.valid;
    } catch (error) {
      console.error("Lỗi kiểm tra token:", error);
      return false; // Nếu có lỗi thì coi token không hợp lệ
    }
  };
  useEffect(() => {
    const check = async () => {
      const session = JSON.parse(localStorage.getItem("session"));
      if (session && session !== "undefined") {
        const isValid = await checkToken(session.token);
        console.log("Token valid:", isValid);
        if (isValid) {
          await axiosClient.get('/order/individual/'+session.currentUser.id,{
            headers: {
              Authorization: `Bearer ${session.token}`
            }
          })
            .then((res)=>{
              const { code, message, result } = res.data;
              setOrderList(result);
            })
        } else {
          setCartItems([]);
        }
      }
    };
    check();
  },[selectedStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipping":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getPaymentColor = (status) => {
    switch (status) {
      case "VN PAY":
        return "bg-green-100 text-green-800";
      case "COD":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Đã giao";
      case "processing":
        return "Đang xử lý";
      case "cancelled":
        return "Đã hủy";
      case "shipping":
        return "Đang giao";
      default:
        return status;
    }
  };

  const filteredOrders = orderList.filter(order => {
    const matchesStatus = selectedStatus === "all" || order.statusName === selectedStatus;
    // const matchesSearch = order.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //   order.products.some(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    // return matchesStatus && matchesSearch;
    return matchesStatus;
  });
  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // Added: Handle cancel order click
  const handleCancelClick = (order) => {
    // console.log(order);
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  // Added: Handle order cancellation confirmation
  const handleConfirmCancel = () => {
    OrderService.updateOrder(selectedOrder.order.idOrder,5,session.token);
    setShowCancelModal(false);
    setSelectedOrder(null);
    setCancelReason("");
  };
  const handleReviewClick = (product) => {
    setSelectedProduct(product);
    setShowReviewModal(true);
    setReviewRating(0);
    setReviewComment("");
  };

  // Added: Handle review submission
  const handleSubmitReview = () => {
    console.log("Review submitted", {
      productId: selectedProduct.id,
      rating: reviewRating,
      comment: reviewComment
    });
    ReviewService.addReview(selectedProduct.id,session.currentUser.id,reviewRating,reviewComment,session.token);
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReviewRating(0);
    setReviewComment("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Lịch Sử Đơn Hàng</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-48">
            <select
              className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="processing">Đang xử lý</option>
              <option value="shipping">Đang giao</option>
              <option value="completed">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">Không tìm thấy đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.idOrder} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 cursor-pointer" onClick={() => toggleOrderExpand(order.idOrder)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Ngày đặt hàng : {order.dateOrder}</span>
                      {expandedOrders[order.idOrder] ? (
                        <FiChevronUp className="text-gray-500" />
                      ) : (
                        <FiChevronDown className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentColor(order.paymentMethodTypePayment)}`}>
                        {order.paymentMethodTypePayment}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.statusName)}`}>
                        {getStatusText(order.statusName)}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedOrders[order.idOrder] && (
                  <>
                  {order.orderDetails.map((product) => (
                    <div key={product.id} className="p-4 flex items-center border-b border-gray-100">
                      <img
                        src={product.idProduct.images?.[0]?.imageUrl || '/default-image.jpg'}
                        alt={product.idProduct.product.name}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900">{product.idProduct.product.name}</h3>
                        <p className="text-sm text-gray-500">Kích thước:{product.idProduct.size.name},Màu:{product.idProduct.color.name}</p>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm text-gray-500">x{product.quantity}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">${product.totalPrice.toFixed(2)}</span>
                            {order.statusName === "completed" && (
                              <button 
                                onClick={() => handleReviewClick(product)}
                                className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                              >
                                Đánh giá
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-lg font-medium text-gray-900">
                      20000
                      {/* ${order.totalPrice.toFixed(2)} */}
                      </span>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-between items-center">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Mua lại
                        </button>
                        {order.status === "completed" && (
                          <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                            Đánh giá
                          </button>
                        )}
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Chi tiết
                        </button>
                      </div>
                      {order.statusName === "processing" && (
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto" onClick={() => handleCancelClick({order})}>
                          Hủy đơn hàng
                        </button>
                      )}
                    </div>
                  </div>
                
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Xác nhận hủy đơn hàng</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vui lòng chọn lý do hủy đơn:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn lý do</option>
                {cancelReasons.map((reason, index) => (
                  <option key={index} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason}
                className={`px-4 py-2 rounded-lg text-white ${cancelReason ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Đánh giá sản phẩm</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">{selectedProduct?.name}</p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`text-2xl ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <FiStar className="w-6 h-6 fill-current" />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Nhập đánh giá của bạn..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!reviewRating}
                className={`px-4 py-2 rounded-lg text-white ${reviewRating ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;