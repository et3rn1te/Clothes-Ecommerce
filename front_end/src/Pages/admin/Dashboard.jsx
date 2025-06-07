import React, { useState, useEffect, useContext, createContext } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from "chart.js";
import { motion } from "framer-motion";
import { FiMenu, FiBell, FiSearch, FiUser, FiSettings , FiPackage} from "react-icons/fi";
import { MdDashboard, MdAnalytics, MdPeople, MdReport } from "react-icons/md";
import { BsSun, BsMoon } from "react-icons/bs";
import { Route, Routes } from "react-router-dom";
import StatisticalPage from "./Statistical";
import ProductManagementPage from "./ProductManagementPage";
import CategoryManagementPage from "./CategoryManagementPage";
import TestPage from "./TestPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const ThemeContext = createContext();



const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
        <div className="flex bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
          <motion.div
            initial={false}
            animate={{ width: sidebarOpen ? "16rem" : "0" }}
            className="bg-white dark:bg-gray-800 h-screen fixed transition-all duration-200 overflow-hidden">
            <div className="p-4 whitespace-nowrap">
              <nav>
                <div className="flex items-center mb-8">
                  <img
                    src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f"
                    alt="Logo"
                    className="h-8 w-8 rounded"
                  />
                  <span className="ml-2 text-xl font-bold">AdminDash</span>
                </div>
                <ul className="space-y-2">
                  <li className="bg-blue-500 text-white rounded-lg">
                    <a href="/admin/statisticalPage" className="flex items-center p-3">
                      <MdDashboard className="mr-3" /> Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MdPeople className="mr-3" /> Quản lý người dùng
                    </a>
                  </li>
                  <li>
                    <a href="/admin/categories" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MdAnalytics className="mr-3" /> Quản lý Doanh mục
                    </a>
                  </li>
                  <li>
                    <a href="/admin/products" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MdAnalytics className="mr-3" /> Quản lý Sản phẩm
                    </a>
                  </li>
                  <li>
                    <a href="/admin/products" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <FiPackage className="mr-3" /> Quản lý đơn hàng
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <MdReport className="mr-3" /> Reports
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <FiSettings className="mr-3" /> Settings
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>

          <div className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-0"} transition-all duration-300`}>
            <header className="bg-white dark:bg-gray-800 shadow-md">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiMenu size={24} />
                </button>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg pl-10 pr-4 py-2 w-64"
                    />
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {darkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <FiBell size={24} />
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                  </button>
                  <button 
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 focus:outline-none"
                  >
                     <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                      alt="Profile"
                      className="h-8 w-8 rounded-full"
                    />
                  </button>
                  {showProfileMenu && (
                      <div className="absolute right-2 top-14 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                        <a
                          href="/"
                          className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Return to Store
                        </a>
                        <a
                          href="#"
                          className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </a>
                      </div>
                    )}
                </div>
              </div>
            </header>

            <main className="p-6">
            <Routes>
              <Route path="/statisticalPage" element={<StatisticalPage />} />
              <Route path="/products" element={<ProductManagementPage />} />
              <Route path="/categories" element={<CategoryManagementPage />} />
              <Route path="/test" element={<TestPage />} />
            </Routes>
            </main>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default Dashboard;