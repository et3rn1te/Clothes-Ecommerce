import React, { useState, useEffect, useContext } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiMic } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaUserCircle } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { introspect, logOutApi } from "../API/AuthService";
import { listCartItem } from "../API/CartService";
import { FavoriteContext } from "./FavoriteContext/FavoriteContext";
import { checkAndRefreshSession } from "../utils/tokenUtils";
import { toast } from "react-toastify";

const Header = () => {
  const { wishlistItems, clearWishlist, setSession,cartItems,clearCart } = useContext(FavoriteContext);
  const wishlistCount = wishlistItems.length;

  console.log(wishlistItems.length);
  const [isOpen, setIsOpen] = useState(false); // State for user avatar dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  const [cartCount, setCartCount] = useState(0);

  const [userAvatar, setUserAvatar] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // State để lưu trữ trạng thái đăng nhập và vai trò người dùng
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State mới để kiểm tra vai trò ADMIN

  const navigate = useNavigate();

  const cartClick = () => { navigate('/cart') };
  const wishlistClick = () => { navigate('/wishList') }

  // Hàm kiểm tra và làm mới session, đồng thời cập nhật trạng thái đăng nhập và vai trò
  useEffect(() => {
    const checkSessionAndRole = async () => {
      const currentSession = checkAndRefreshSession();
      if (currentSession) {
        setSession(currentSession);
        setIsLogin(true);

        // Kiểm tra vai trò ADMIN
        const userRoles = currentSession.currentUser?.roles || [];
        console.log("User roles:", userRoles); // In ra console log để kiểm tra vai trò
        // Đã sửa lỗi: Kiểm tra nếu có bất kỳ đối tượng nào trong mảng roles có thuộc tính 'name' là 'ADMIN'
        setIsAdmin(userRoles.some(role => role.name === "ADMIN")); // SỬA LỖI Ở ĐÂY

        if (currentSession.currentUser?.imageUrl) {
          setUserAvatar(currentSession.currentUser.imageUrl);
        } else {
          setUserAvatar(null);
        }

        try {
          // const response = await listCartItem({
          //   userId: currentSession.currentUser.id,
          //   token: currentSession.token
          // });
          // const { result } = response.data;
          // setCartCount(cartItems.length);
        } catch (error) {
          if (error.response?.status === 401) {
            handleLogout();
          } else {
            console.error("Error fetching cart:", error);
          }
        }
      } else {
        setIsLogin(false);
        setIsAdmin(false); // Đảm bảo isAdmin là false khi không đăng nhập
        setCartCount(0);
        setUserAvatar(null);
      }
    };

    checkSessionAndRole();

    const handleCartUpdate = () => {
      checkSessionAndRole();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const currentSession = checkAndRefreshSession();
      if (currentSession) {
        await logOutApi({ token: currentSession.token });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsOpen(false);
      clearCart();
      localStorage.removeItem("session");
      setIsLogin(false);
      setIsAdmin(false); // Đảm bảo reset isAdmin khi đăng xuất
      clearWishlist();
      toast.success("Đăng xuất thành công");
      navigate('/auth/login');
    }
  };

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = "vi-VN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSearchQuery(text);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
  }

  const handleVoiceSearch = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const loginClick = () => {
    navigate('/auth/login');
  }

  // Define menu items for desktop and mobile navigation
  const menuItems = [
    { name: "Đồ Nam", link: "/nam" },
    { name: "Đồ Nữ", link: "/nu" }
    // Thêm các mục menu khác nếu cần
  ];

  // Admin dashboard links
  const adminLinks = [
    { name: "Quản lý sản phẩm", link: "/admin/products" },
    { name: "Quản lý danh mục", link: "/admin/categories" },
    { name: "Quản lý người dùng", link: "/admin/users" },
    { name: "Quản lý đơn hàng", link: "/admin/orders" },
    // Thêm các đường dẫn quản lý khác
  ];

  return (
      <header className="sticky top-0 z-50 bg-white shadow-sm backdrop-blur-sm bg-opacity-95">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 py-2 hidden md:block">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center hover:text-white transition-colors duration-300">
                <MdEmail className="mr-2" />
                <span>info@moggo.com</span>
              </div>
              <div className="flex items-center hover:text-white transition-colors duration-300">
                <MdPhone className="mr-2" />
                <span>+84 123 456 789</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex space-x-4">
                <FaFacebookF className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer" />
                <FaTwitter className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer" />
                <FaInstagram className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer" />
                <FaLinkedinIn className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer" />
              </div>
              {/* User Login/Logout and Admin Dropdown */}
              {isLogin ?
                  <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-8 h-8 rounded-full overflow-hidden focus:outline-none ring-2 ring-gray-200 hover:ring-blue-500 flex items-center justify-center bg-gray-100"
                    >
                      {userAvatar ? (
                          <img
                              src={userAvatar}
                              alt="User avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                setUserAvatar(null);
                              }}
                          />
                      ) : (
                          <FaUserCircle className="w-full h-full text-gray-400" />
                      )}
                    </button>
                    {isOpen && ( // Positioned under the button
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1" role="menu">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                                onClick={() => setIsOpen(false)}
                            >
                              Thông tin cá nhân
                            </Link>
                            {/* Conditional rendering for ADMIN links */}
                            {isAdmin && (
                                <>
                                  <div className="border-t border-gray-200 my-1" />
                                  <span className="block px-4 py-2 text-xs text-gray-500 font-semibold uppercase">Quản lý</span>
                                  {adminLinks.map((item, index) => (
                                      <Link
                                          key={index}
                                          to={item.link}
                                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                          role="menuitem"
                                          onClick={() => setIsOpen(false)}
                                      >
                                        {item.name}
                                      </Link>
                                  ))}
                                </>
                            )}
                            <button
                                onClick={() => {
                                  setIsOpen(false);
                                  handleLogout();
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </div>
                    )}
                  </div>
                  : <button
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2"
                      onClick={loginClick}
                  >
                    <FaUserCircle className="w-5 h-5" />
                    Đăng nhập
                  </button>
              }
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="bg-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/">
                  <h1 className="text-3xl font-extrabold text-gray-900 hover:text-blue-900 transition-colors duration-300">
                    Moggo
                  </h1>
                </Link>
              </div>

              {/* Desktop Menu */}
              <div className="hidden lg:flex items-center space-x-12">
                {menuItems.map((item, index) => (
                    <div key={index} className="relative group">
                      <Link
                          to={item.link}
                          className="text-gray-700 hover:text-blue-900 font-medium text-lg transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-900 hover:after:w-full after:transition-all after:duration-300"
                      >
                        {item.name}
                      </Link>

                      <Link
                        to="/orderHistory"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        Thông tin đơn hàng
                      </Link>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Đăng xuất
                      </button>

                    </div>
                ))}
              </div>

              {/* Search and Cart */}
              <div className="flex items-center space-x-6">
                <div className="relative group">
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
                        }
                      }}
                      placeholder="Tìm kiếm sản phẩm..."
                      className="w-40 lg:w-80 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-100 transition-all duration-300"
                  />
                  <button
                      onClick={() => {
                        if (searchQuery.trim()) {
                          navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
                        }
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-900"
                  >
                    <FiSearch className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="relative group" onClick={wishlistClick}>
                    <FiHeart className="text-2xl text-gray-600 group-hover:text-blue-900 transition-colors duration-300 cursor-pointer" />
                    <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {wishlistItems.length}
                  </span>
                  </div>
                  <div className="relative group" onClick={cartClick}>
                    <FiShoppingCart className="text-2xl text-gray-600 group-hover:text-blue-900 transition-colors duration-300 cursor-pointer" />
                    <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {cartCount}
                  </span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden text-gray-600 hover:text-blue-900 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
              <div className="lg:hidden fixed inset-0 z-50">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg py-4 px-6 transform transition-transform duration-300">
                  <div className="flex justify-end">
                    <button
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-600 hover:text-blue-900 transition-colors duration-300"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <div className="mt-8 space-y-6">
                    {menuItems.map((item, index) => (
                        <div key={index}>
                          <Link
                              to={item.link}
                              className="block text-gray-700 hover:text-blue-900 text-lg font-medium py-2 transition-colors duration-300"
                              onClick={() => setIsMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        </div>
                    ))}
                    {/* Admin links for mobile menu */}
                    {isAdmin && (
                        <>
                          <div className="border-t border-gray-200 my-2" />
                          <span className="block text-gray-500 text-sm font-semibold uppercase mb-2">Quản lý</span>
                          {adminLinks.map((item, index) => (
                              <Link
                                  key={`admin-mobile-${index}`}
                                  to={item.link}
                                  className="block text-gray-700 hover:text-blue-900 text-lg font-medium py-2 transition-colors duration-300"
                                  onClick={() => setIsMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                          ))}
                        </>
                    )}
                  </div>
                </div>
              </div>
          )}
        </nav>
      </header>
  );
};

export default Header;
