import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiBox, FiUsers, FiShoppingBag, FiTag, FiSettings } from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, name: 'Dashboard', path: '/admin' },
    { icon: FiBox, name: 'Sản phẩm', path: '/admin/products' },
    { icon: FiUsers, name: 'Người dùng', path: '/admin/users' },
    { icon: FiShoppingBag, name: 'Đơn hàng', path: '/admin/orders' },
    { icon: FiTag, name: 'Danh mục', path: '/admin/categories' },
    { icon: FiSettings, name: 'Cài đặt', path: '/admin/settings' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-semibold">Admin Panel</span>
          </div>
          <nav className="flex-1 px-2 mt-5 space-y-1 bg-white">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-6 w-6 ${
                      isActive
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 