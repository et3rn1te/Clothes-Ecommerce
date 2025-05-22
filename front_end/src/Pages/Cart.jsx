import React, { useEffect, useState } from "react";
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { listCartItem, updateCartItem } from "../API/CartService";
import { introspect } from "../API/AuthService";
import axiosClient from "../API/axiosClient";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
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
  const session = JSON.parse(localStorage.getItem("session"));
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
      if (err.response && err.response.data && err.response.data.message) {
        alert("Lỗi: " + err.response.data.message);
      } else {
        alert("Đã xảy ra lỗi không xác định.");
      }
      console.error("Đã xảy ra lỗi khi gọi API:", err);
    }
  }

  // const shipping = 5.99;
  const tax = 0.1; // 10% tax

  const updateQuantity = async (id, newQuantity) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
    console.log(session.token);
    await updateCartItem({
      idUser: session.currentUser.id,
      action: false,
      idProduct: id,
      amount: 1
    },session.token);
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxAmount = subtotal * tax;
  const total = subtotal + taxAmount - discount;
  // Payment
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate('/payment');
    localStorage.setItem("total",total);
  } 

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Shopping Cart ({cartItems.length} items)</h2>
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-600 flex items-center gap-2"
            >
              <FiTrash2 /> Clear Cart
            </button>
          </div>

          {cartItems.map(item => (
            <div key={item.id} className="flex gap-4 bg-white p-4 rounded-lg shadow">
              <img
                src='https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Color: trắng | Size: M
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>{updateQuantity(item.id, item.quantity - 1);} }
                      className="p-1 rounded-full border"
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => {updateQuantity(item.id, item.quantity + 1)}}
                      className="p-1 rounded-full border"
                    >
                      <FiPlus />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} đồng</div>
                    <div className="text-sm text-gray-500">{item.product.price} đồng/chiếc</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button className="flex items-center text-green-500 hover:text-green-600 gap-2">
            <FiArrowLeft /> Continue Shopping
          </button>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)} đồng</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{taxAmount.toFixed(2)} đồng</span>
              </div>
              {/* <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping.toFixed(2)} đồng</span>
              </div> */}
              {discount > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>Discount</span>
                  <span>-{discount.toFixed(2)} đồng</span>
                </div>
              )}
              <div className="border-t pt-2 font-bold flex justify-between">
                <span>Total</span>
                <span>{total.toFixed(2)} đồng</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  className="flex-1 border rounded px-3 py-2"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={()=> {findDiscount(promoCode)}}>
                  Apply
                </button>
              </div>

              <button className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;