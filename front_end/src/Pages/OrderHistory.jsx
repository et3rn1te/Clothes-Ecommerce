import React, { useContext, useEffect, useState } from "react";
import { FiSearch, FiChevronDown, FiShoppingBag, FiStar, FiInfo, FiChevronUp, FiX, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiClock, FiCalendar, FiCreditCard, FiMapPin } from "react-icons/fi";
import { introspect } from "../API/AuthService";
import axiosClient from "../API/axiosClient";

const cancelReasons = [
  "Thay đổi địa chỉ giao hàng",
  "Thay đổi phương thức thanh toán",
  "Tìm thấy sản phẩm giá tốt hơn",
  "Đổi ý không muốn mua nữa",
  "Lý do khác"
];

const OrderHistory = () => {
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [orderList, setOrderList] = useState([]);
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

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "shipping":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPaymentColor = (status) => {
    switch (status) {
      case "VN PAY":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "COD":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="w-4 h-4" />;
      case "processing":
        return <FiClock className="w-4 h-4" />;
      case "cancelled":
        return <FiXCircle className="w-4 h-4" />;
      case "shipping":
        return <FiTruck className="w-4 h-4" />;
      default:
        return <FiPackage className="w-4 h-4" />;
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
    return matchesStatus;
  });

  const toggleOrderExpand = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCancelClick = (order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    // OrderService.updateOrder(selectedOrder.order.idOrder,5,session.token);
    console.log("Order cancelled");
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

  const handleSubmitReview = () => {
    console.log("Review submitted", {
      productId: selectedProduct.id,
      rating: reviewRating,
      comment: reviewComment
    });
    setShowReviewModal(false);
    setSelectedProduct(null);
    setReviewRating(0);
    setReviewComment("");
  };

  const calculateOrderTotal = (orderDetails) => {
    return orderDetails.reduce((total, item) => total + item.totalPrice, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Lịch Sử Đơn Hàng
          </h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng theo tên sản phẩm..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative w-full lg:w-64">
              <select
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy đơn hàng nào</h3>
            <p className="text-gray-600">Hãy thử thay đổi bộ lọc tìm kiếm</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.idOrder} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Order Header */}
                <div 
                  className="p-6 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
                  onClick={() => toggleOrderExpand(order.idOrder)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">#{order.idOrder}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{order.dateOrder}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedOrders[order.idOrder] ? (
                          <FiChevronUp className="text-gray-400 w-5 h-5" />
                        ) : (
                          <FiChevronDown className="text-gray-400 w-5 h-5" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getPaymentColor(order.paymentMethodTypePayment)}`}>
                        <FiCreditCard className="w-4 h-4" />
                        {order.paymentMethodTypePayment}
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.statusName)}`}>
                        {getStatusIcon(order.statusName)}
                        {getStatusText(order.statusName)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                {expandedOrders[order.idOrder] && (
                  <div className="divide-y divide-gray-100">
                    {/* Products */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FiPackage className="w-5 h-5" />
                        Sản phẩm đã đặt
                      </h4>
                      <div className="space-y-4">
                        {order.orderDetails.map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                            <div className="relative">
                              <img
                                src={product.idProduct.images?.[0]?.imageUrl || '/default-image.jpg'}
                                alt={product.idProduct.product.name}
                                className="w-20 h-20 rounded-xl object-cover shadow-md"
                              />
                              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                                {product.quantity}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">{product.idProduct.product.name}</h5>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                  {product.idProduct.color.name}
                                </span>
                                <span>Size: {product.idProduct.size.name}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900">${product.totalPrice.toFixed(2)}</div>
                              {order.statusName === "completed" && (
                                <button 
                                  onClick={() => handleReviewClick(product)}
                                  className="mt-2 px-3 py-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                  <FiStar className="w-4 h-4 inline mr-1" />
                                  Đánh giá
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-lg font-semibold text-gray-700">Tổng tiền:</span>
                        <span className="text-2xl font-bold text-gray-900">
                          ${calculateOrderTotal(order.orderDetails).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 justify-between items-center">
                        <div className="flex gap-3">
                          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium">
                            Mua lại
                          </button>
                          <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium">
                            Chi tiết
                          </button>
                        </div>
                        {order.statusName === "processing" && (
                          <button 
                            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium" 
                            onClick={() => handleCancelClick({order})}
                          >
                            <FiX className="w-4 h-4 inline mr-2" />
                            Hủy đơn hàng
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Xác nhận hủy đơn hàng</h3>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Vui lòng chọn lý do hủy đơn:
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Đóng
              </button>
              <button
                onClick={handleConfirmCancel}
                disabled={!cancelReason}
                className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                  cancelReason 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Đánh giá sản phẩm</h3>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4 font-medium">{selectedProduct?.idProduct?.product?.name}</p>
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`text-3xl transition-all duration-200 hover:scale-110 ${
                      star <= reviewRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <FiStar className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows="4"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                disabled={!reviewRating}
                className={`px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 ${
                  reviewRating 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transform hover:scale-105' 
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
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