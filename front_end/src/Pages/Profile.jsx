import { useState } from "react";
import { FiSettings, FiLogOut , FiCamera} from "react-icons/fi";

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    address: "123 Main Street, City, Country",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  });

  const handleSubmit=()=>{

  }
  const handleInputChange =()=> {

  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center relative">
              <img 
                src={userInfo.avatar} 
                alt="Profile" 
                className="w-48 h-48 rounded-full object-cover border-2 border-red-500"
              />
              {/* <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100">
                <FiCamera className="text-gray-600" />
              </button> */}
              <button className="mt-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
                 Save avatar
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 p-2">
                <FiSettings /> Account Settings
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 p-2">
                <FiLogOut /> Logout
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Full Name</label>
                        <input
                            type="text"
                            value={userInfo.name}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            value={userInfo.email}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Phone</label>
                        <input
                            type="tel"
                            value={userInfo.phone}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Street Address</label>
                        <input
                            type="text"
                            value={userInfo.address}
                            onChange={handleInputChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-600">City</label>
                        <input
                            type="text"
                            value="New York"
                            onChange={handleInputChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                        <input
                            type="text"
                            value="10001"
                            onChange={handleInputChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;