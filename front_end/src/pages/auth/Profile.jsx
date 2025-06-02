import { useState, useEffect } from "react";
import { FiSettings, FiLogOut, FiCamera, FiSave, FiLock } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserService from "../../API/UserService";
import { toast } from "react-toastify";
import { checkAndRefreshSession, getTokenExpiryTime } from "../../utils/tokenUtils";

const Profile = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    phone: "",
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentSession = checkAndRefreshSession();
    if (!currentSession) {
      toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
      navigate('/auth/login');
      return;
    }
    setSession(currentSession);

    // Log token expiry time for debugging
    const expiryTime = getTokenExpiryTime(currentSession.token);
    if (expiryTime) {
      console.log("Token sẽ hết hạn vào:", expiryTime.toLocaleString());
    }

    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserProfile();
      const { data } = response.data;
      setUserInfo({
        fullname: data.fullname || "",
        email: data.email || "",
        phone: data.phone || "",
        avatar: data.imageUrl || null
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem("session");
        navigate('/auth/login');
      } else {
        toast.error("Không thể tải thông tin người dùng");
        console.error("Error fetching profile:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ tên";
    }
    if (!userInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(userInfo.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await UserService.updateUserProfile({
        fullname: userInfo.fullname,
        phone: userInfo.phone
      });
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error("File phải là hình ảnh");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpdate = async () => {
    if (!selectedFile) {
      toast.warning("Vui lòng chọn ảnh mới");
      return;
    }

    try {
      setAvatarLoading(true);
      await UserService.updateAvatar(selectedFile);
      toast.success("Cập nhật avatar thành công");
      fetchUserProfile(); // Refresh profile data
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem("session");
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.message || "Cập nhật avatar thất bại");
        console.error("Error updating avatar:", error);
      }
    } finally {
      setAvatarLoading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }

    try {
      setLoading(true);
      await UserService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      toast.success("Đổi mật khẩu thành công");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Avatar Section */}
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center relative">
              <div className="w-48 h-48 rounded-full border-2 border-green-500 overflow-hidden bg-gray-100 flex items-center justify-center">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : userInfo.avatar ? (
                  <img 
                    src={userInfo.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      setUserInfo(prev => ({ ...prev, avatar: null }));
                    }}
                  />
                ) : (
                  <FaUserCircle className="w-full h-full text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <FiCamera className="text-gray-600" />
              </label>
              <button 
                onClick={handleAvatarUpdate}
                disabled={!selectedFile || avatarLoading}
                className={`mt-4 flex items-center gap-2 ${
                  selectedFile && !avatarLoading 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white px-4 py-2 rounded-full transition-colors`}
              >
                {avatarLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <FiSave /> Lưu avatar
                  </>
                )}
              </button>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <button 
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-2 text-gray-600 hover:text-green-500 p-2"
              >
                <FiLock /> Đổi mật khẩu
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 p-2"
              >
                <FiLogOut /> Đăng xuất
              </button>
            </div>
          </div>
          
          {/* Profile Form */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Họ và tên</label>
                  <input
                    type="text"
                    name="fullname"
                    value={userInfo.fullname}
                    onChange={handleInputChange}
                    className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.fullname ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.fullname && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    value={userInfo.email}
                    disabled
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleInputChange}
                    className={`mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Đổi mật khẩu</h3>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      currentPassword: e.target.value
                    }))}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      </div>
                    ) : (
                      'Đổi mật khẩu'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;