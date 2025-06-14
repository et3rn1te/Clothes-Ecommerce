import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import AdminHeader from "../../components/admin/AdminHeader.jsx";
import AdminSidebar from "../../components/admin/AdminSidebar.jsx";
import ProductManagementPage from "./ProductManagementPage";
import CategoryManagementPage from "./CategoryManagementPage";
// import UserManagementPage from "./UserManagementPage"; // Uncomment if you have this page
// import OrderManagementPage from "./OrderManagementPage"; // Uncomment if you have this page
import {
    MdTrendingUp,
    MdShoppingCart,
    MdPeople,
    MdInventory,
    MdAttachMoney,
    MdNotifications,
    MdAnalytics,
    MdCategory
} from "react-icons/md";
import { FiChevronRight } from "react-icons/fi";
import UserManagementPage from "./UserManagementPage.jsx";

const AdminDashboard = () => {
    const location = useLocation(); // Get current location object
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Update activeTab based on URL pathname
    useEffect(() => {
        // Extract the last part of the pathname as the tab ID
        // e.g., "/admin/products" -> "products"
        const pathParts = location.pathname.split('/');
        const currentTab = pathParts[pathParts.length - 1];

        // Ensure that the currentTab matches a valid sidebar item ID or defaults to 'dashboard'
        if (['dashboard', 'products', 'categories', 'users', 'orders'].includes(currentTab)) {
            setActiveTab(currentTab);
        } else {
            setActiveTab('dashboard'); // Default if URL doesn't match a specific tab
        }
    }, [location.pathname]); // Re-run this effect whenever the pathname changes

    // Dashboard overview cards data
    const statsCards = [
        {
            title: 'Tổng doanh thu',
            value: '125,000,000₫',
            change: '+12.5%',
            changeType: 'increase',
            icon: <MdAttachMoney className="w-8 h-8"/>,
            color: 'from-green-500 to-emerald-600'
        },
        {
            title: 'Đơn hàng mới',
            value: '342',
            change: '+8.2%',
            changeType: 'increase',
            icon: <MdShoppingCart className="w-8 h-8"/>,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Khách hàng',
            value: '1,256',
            change: '+15.3%',
            changeType: 'increase',
            icon: <MdPeople className="w-8 h-8"/>,
            color: 'from-purple-500 to-pink-600'
        },
        {
            title: 'Sản phẩm',
            value: '89',
            change: '+5.1%',
            changeType: 'increase',
            icon: <MdInventory className="w-8 h-8"/>,
            color: 'from-orange-500 to-red-600'
        }
    ];

    const recentActivities = [
        {id: 1, action: 'Đơn hàng mới #1234', time: '5 phút trước', type: 'order'},
        {id: 2, action: 'Sản phẩm "Áo thun nam" được thêm', time: '15 phút trước', type: 'product'},
        {id: 3, action: 'Khách hàng mới đăng ký', time: '30 phút trước', type: 'user'},
        {id: 4, action: 'Đơn hàng #1233 đã được giao', time: '1 giờ trước', type: 'delivery'},
        {id: 5, action: 'Cập nhật danh mục "Thời trang nữ"', time: '2 giờ trước', type: 'category'}
    ];

    // Render main content based on active tab
    const renderMainContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductManagementPage/>;
            case 'categories':
                return <CategoryManagementPage/>;
            case 'users':
                return <UserManagementPage/>;
                // return <h2 className="text-xl font-semibold text-gray-800">Trang Quản lý Người dùng (Đang phát triển)</h2>;
            case 'orders':
                // return <OrderManagementPage/>; // Uncomment and replace with your actual OrderManagementPage
                return <h2 className="text-xl font-semibold text-gray-800">Trang Quản lý Đơn hàng (Đang phát triển)</h2>;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6">
                        {/* Dashboard Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                            <p className="text-gray-600">Chào mừng bạn đến với trang quản lý Moggo</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {statsCards.map((card, index) => (
                                <div key={index}
                                     className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                            <p className="text-2xl font-bold text-gray-900 mb-2">{card.value}</p>
                                            <div className="flex items-center">
                                                <span className={`text-sm font-medium ${
                                                    card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {card.change}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color} text-white`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Main Dashboard Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Activities */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        Xem tất cả
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center">
                                            <div
                                                className={`p-2 rounded-full ${
                                                    activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                                                        activity.type === 'product' ? 'bg-green-100 text-green-600' :
                                                            activity.type === 'user' ? 'bg-purple-100 text-purple-600' :
                                                                activity.type === 'delivery' ? 'bg-yellow-100 text-yellow-600' :
                                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {activity.type === 'order' && <MdShoppingCart className="w-5 h-5"/>}
                                                {activity.type === 'product' && <MdInventory className="w-5 h-5"/>}
                                                {activity.type === 'user' && <MdPeople className="w-5 h-5"/>}
                                                {activity.type === 'delivery' && <MdNotifications className="w-5 h-5"/>}
                                                {activity.type === 'category' && <MdCategory className="w-5 h-5"/>}
                                            </div>
                                            <div className="ml-3 flex-grow">
                                                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                                                <p className="text-xs text-gray-500">{activity.time}</p>
                                            </div>
                                            <FiChevronRight className="w-4 h-4 text-gray-400"/>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Hành động nhanh</h3>
                                <div className="space-y-4">
                                    <button
                                        className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                                        <MdInventory className="w-5 h-5 text-indigo-600"/>
                                        <span className="font-medium">Thêm sản phẩm mới</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors duration-200">
                                        <MdShoppingCart className="w-5 h-5 text-green-600"/>
                                        <span className="font-medium">Xem đơn hàng mới</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-200">
                                        <MdPeople className="w-5 h-5 text-red-600"/>
                                        <span className="font-medium">Quản lý người dùng</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200">
                                        <MdAnalytics className="w-5 h-5 text-purple-600"/>
                                        <span className="font-medium">Xem báo cáo</span>
                                    </button>
                                    <button
                                        className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200">
                                        <MdNotifications className="w-5 h-5 text-orange-600"/>
                                        <span className="font-medium">Gửi thông báo</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader/>

            <div className="flex">
                <AdminSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab} // Sidebar still controls activeTab for internal clicks
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                />

                {/* Main Content */}
                {/* Adjust ml- based on sidebar collapse state */}
                <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-0' : 'ml-0'}`}>
                    <div className="p-6">
                        {renderMainContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
