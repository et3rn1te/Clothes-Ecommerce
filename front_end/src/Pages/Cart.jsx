import React, { useEffect, useState } from "react";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiTag, FiPercent, FiShield, FiTruck, FiGift } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { introspect } from "../API/AuthService";
import { listCartItem, updateCartItem } from "../API/CartService";
import { useNavigate } from "react-router-dom";
import axiosClient from "../API/axiosClient";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

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
          await listCartItem({userId:session.currentUser.id,token:session.token})
            .then((res)=>{
              const { code, message, result } = res.data;
              console.log(res.data);
              setCartItems(result);
            })
        } else {
          setCartItems([]);
        }
      }
    };
    check();
  }, []);
  const session = JSON.parse(localStorage.getItem("session"));

  const tax = 0.1; // 10% tax

  const updateQuantity = async (id,productId ,newQuantity,action) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
    console.log(id);
    await updateCartItem({
      idUser: session.currentUser.id,
      action: action,
      idProduct: productId,
      amount: 1
    },session.token);
  };

  const removeItem = (id) => {
    setRemovingItem(id);
    setTimeout(() => {
      setCartItems(items => items.filter(item => item.id !== id));
      setRemovingItem(null);
    }, 300);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const findDiscount= async(codeDis)=> {
    try {
      await axiosClient.get('/discount/getDiscount', {
        params: {
          code: codeDis
        },
        headers : {
          Authorization: `Bearer ${session.token}`
        }
      })
      .then((res)=> {
        const { code, message, result } = res.data;
        setDiscount(subtotal* result.salePercent);
      });
    }catch(error){
      if (error.response && error.response.data && error.response.data.message) {
        alert("Lỗi: " + error.response.data.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
      console.error("Đã xảy ra lỗi khi gọi API:", error);
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxAmount = subtotal * tax;
  const total = subtotal + taxAmount - discount;

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/payment');
    localStorage.setItem("total",total)
    console.log("Proceeding to checkout with total:", total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group">
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Continue Shopping</span>
            </button>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2"
          >
            Shopping Cart
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </motion.p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Cart Items */}
          <div className="xl:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <FiShoppingCart className="w-5 h-5 text-white" />
                    </div>
                    Your Items
                  </h2>
                  {cartItems.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 font-medium"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Clear Cart
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: removingItem === item.id ? 0 : 1, 
                        x: removingItem === item.id ? -100 : 0,
                        scale: removingItem === item.id ? 0.9 : 1
                      }}
                      exit={{ opacity: 0, x: -100, scale: 0.9 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      className="p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative">
                          <img
                            src={item.product.images?.[0]?.imageUrl || '/default-image.jpg'}
                            alt={item.product.product.name}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 text-lg truncate pr-4">
                              {item.product.product.name}
                            </h3>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 flex-shrink-0"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                            <span className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                              Color: {item.product.color.name}
                            </span>
                            <span>Size: {item.product.size.name}</span>
                          </div>

                          {/* Quantity and Price */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => updateQuantity(item.id, item.product.id, item.quantity - 1, false)}
                                  disabled={item.quantity <= 1}
                                  className="p-3 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-3 font-semibold min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.product.id, item.quantity + 1, true)}
                                  className="p-3 hover:bg-gray-200 transition-colors duration-200"
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">
                                ${(item.product.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ${item.product.price.toFixed(2)} each
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {cartItems.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiShoppingCart className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Add some items to get started</p>
                    <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                      Start Shopping
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="xl:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="sticky top-8"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Summary Header */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FiTag className="w-4 h-4 text-white" />
                    </div>
                    Order Summary
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-semibold">${taxAmount.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-between items-center text-green-600"
                      >
                        <span className="flex items-center gap-2">
                          <FiPercent className="w-4 h-4" />
                          Discount
                        </span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </motion.div>
                    )}
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FiGift className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                      </div>
                      <button 
                        onClick={() => findDiscount(promoCode)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 font-medium"
                      >
                        Apply
                      </button>
                    </div>
                    {isPromoApplied && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-green-600 flex items-center gap-2"
                      >
                        <FiPercent className="w-4 h-4" />
                        Promo code applied successfully!
                      </motion.p>
                    )}
                    <div className="text-xs text-gray-500">
                      Try: "SAVE20" or "WELCOME10"
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiShield className="w-4 h-4 text-blue-500" />
                        <span>Secure checkout</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiTruck className="w-4 h-4 text-blue-500" />
                        <span>Free shipping over $100</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <FiHeart className="w-4 h-4 text-blue-500" />
                        <span>30-day return policy</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                      cartItems.length > 0
                        ? 'bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:scale-100 hover:shadow-lg'
                    }`}
                  >
                    {cartItems.length > 0 ? 'Proceed to Checkout' : 'Cart is Empty'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;