import React, { useState, useEffect, useContext } from "react";
import { FiSearch, FiShoppingCart, FiHeart, FiMenu, FiX, FiMic } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import { useNavigate, Link } from "react-router-dom";
import { introspect, logOutApi } from "../API/AuthService";
import { listCartItem } from "../API/CartService";
import CategoryService from '../API/CategoryService';
import { FavoriteContext } from "./FavoriteContext/FavoriteContext";

const Header = () => {
  const { wishlistItems }= useContext(FavoriteContext);
  const wishlistCount = wishlistItems.length;
  console.log(wishlistItems.length);
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  // const [wishlistCount, setWishlistCount] = useState(wishlistItems.length);
  //Tìm kiếm giọng nói
  const [isListening, setIsListening] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  // xử lý login
  const [isLogin,setIsLogin] = useState(false);
  const cartClick = () => {navigate('/cart')};
  const wishlistClick =()=> {navigate('/wishList')}
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
          setIsLogin(true);
          
          await listCartItem({userId:session.currentUser.id,token:session.token})
            .then((res)=>{
              const { code, message, result } = res.data;
              // console.log(res.data);
              setCartCount(result.length);
            });

        } else {
          setIsLogin(false);
          setCartCount(0);
        }
      }
    };
    check();
  }, [isLogin]);
  
  // State to store category links (name and link)
  const [categoryLinks, setCategoryLinks] = useState([]);

  // Effect to fetch category names and create links when component mounts
  useEffect(() => {
    const fetchCategoryLinks = async () => {
      // Define the main categories with their Vietnamese names and slugs
      const menuCategories = [
        { name: "Đồ Nam", slug: "nam" },
        { name: "Đồ Nữ", slug: "nu" }
      ];
      const fetchedLinks = [];

      for (const category of menuCategories) {
        fetchedLinks.push({ 
          name: category.name,
          link: `/${category.slug}`
        });
      }
      
      setCategoryLinks(fetchedLinks);
    };

    fetchCategoryLinks();
  }, []);

   // Effect to check login status (moved from previous useEffect)
   useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken && jwtToken !== "null" && jwtToken !== "undefined") {
      setIsLogin(true);
    } 
    console.log("Login status: "+isLogin);
   }, []);

  //Xử lý logout
  const logOut = async (e)=> {
    const session = JSON.parse(localStorage.getItem("session"));
    setIsOpen(false);
    setCartCount(0);
    localStorage.clear();
    await logOutApi({token:session.token});
    setIsLogin(false);
    clearWishlist();
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
  //
  const navigate = useNavigate(); 
  
  const loginClick = () => {
    navigate('/auth/login');
  }

  // Use categoryLinks state for rendering menu items
  const menuItems = categoryLinks;

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
            {/* Add login/logout status here if needed in top bar */}
             {isLogin ?
              <div className="relative">
                <button 
                  onClick={() => setIsOpen(!isOpen)} 
                  className="w-8 h-8 rounded-full overflow-hidden focus:outline-none ring-2 ring-gray-200 hover:ring-blue-500"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="User avatar" 
                    className="w-full h-full object-cover"
                  />
                </button>
                {isOpen && ( // Positioned under the button
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                      <a onClick={logOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Log out</a>
                    </div>
                  </div>
                )}
              </div>
              : <button className="text-sm text-gray-300 hover:text-white transition-colors duration-300" onClick={loginClick}>Login</button>
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
                  placeholder="Search..."
                  className="w-40 lg:w-80 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                />
                <button 
                  onClick={handleVoiceSearch}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                    isListening ? "text-blue-900" : "text-gray-400"
                  } hover:bg-blue-50 transition-colors duration-300`}
                >
                  <FiMic className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center space-x-6">
                <div className="relative group" onClick={wishlistClick}>
                  <FiHeart className="text-2xl text-gray-600 group-hover:text-blue-900 transition-colors duration-300 cursor-pointer" />
                  <span className="absolute -top-2 -right-2 bg-blue-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    {wishlistCount}
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
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;