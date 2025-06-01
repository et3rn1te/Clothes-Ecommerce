import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <button className="lg:hidden text-gray-600 hover:text-gray-900">
          <FiMenu className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-900">
            <FiBell className="h-6 w-6" />
          </button>
          <button className="text-gray-600 hover:text-gray-900">
            <FiUser className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 