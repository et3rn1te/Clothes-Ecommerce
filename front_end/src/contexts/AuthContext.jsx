import {createContext, useContext, useEffect, useState} from 'react';
import UserService from '../API/UserService';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState(null);

  // Hàm kiểm tra và lấy session từ localStorage
  const checkAndRefreshSession = () => {
    try {
      const sessionData = localStorage.getItem("session");
      if (!sessionData) return null;

      const session = JSON.parse(sessionData);
      // Có thể thêm logic kiểm tra expired token ở đây
      return session;
    } catch (error) {
      console.error('Error parsing session:', error);
      localStorage.removeItem("session");
      return null;
    }
  };

  // Hàm cập nhật avatar
  const updateUserAvatar = (newAvatarUrl) => {
    setUserAvatar(newAvatarUrl);

    // Cập nhật session trong localStorage
    const currentSession = checkAndRefreshSession();
    if (currentSession && currentSession.currentUser) {
      currentSession.currentUser.imageUrl = newAvatarUrl;
      localStorage.setItem("session", JSON.stringify(currentSession));

      // Cập nhật user state
      setUser(prevUser => ({
        ...prevUser,
        imageUrl: newAvatarUrl
      }));
    }
  };

  // Hàm refresh user profile từ API
  const refreshUserProfile = async () => {
    try {
      const res = await UserService.getUserProfile();
      const userData = res.data?.data;
      setUser(userData);
      setUserAvatar(userData?.imageUrl || null);

      // Cập nhật session với data mới nhất
      const currentSession = checkAndRefreshSession();
      if (currentSession) {
        currentSession.currentUser = userData;
        localStorage.setItem("session", JSON.stringify(currentSession));
      }

      return userData;
    } catch (error) {
      console.error('Lỗi khi refresh thông tin người dùng:', error);
      throw error;
    }
  };

  // Hàm login - cập nhật user và avatar
  const login = (userData, token) => {
    setUser(userData);
    setUserAvatar(userData?.imageUrl || null);

    const sessionData = {
      currentUser: userData,
      token: token,
      timestamp: Date.now()
    };
    localStorage.setItem("session", JSON.stringify(sessionData));
  };

  // Hàm logout
  const logout = () => {
    setUser(null);
    setUserAvatar(null);
    localStorage.removeItem("session");
  };

  // Effect để khởi tạo user từ session hoặc API
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Kiểm tra session trước
        const currentSession = checkAndRefreshSession();

        if (currentSession && currentSession.currentUser) {
          // Có session, set user từ session
          setUser(currentSession.currentUser);
          setUserAvatar(currentSession.currentUser.imageUrl || null);

          // Có thể fetch lại từ API để đảm bảo data mới nhất (optional)
          try {
            await refreshUserProfile();
          } catch (error) {
            // Nếu API call fail, vẫn dùng data từ session
            console.warn('Could not refresh user profile, using cached data');
          }
        } else {
          // Không có session, thử fetch từ API
          try {
            const res = await UserService.getUserProfile();
            const userData = res.data?.data;
            setUser(userData);
            setUserAvatar(userData?.imageUrl || null);
          } catch (error) {
            console.error('No valid session and API call failed:', error);
            setUser(null);
            setUserAvatar(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setUserAvatar(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const isAdmin = user?.roles?.some(role => role.name === 'ADMIN');
  const isAuthenticated = !!user;

  const value = {
    user,
    setUser,
    userAvatar,
    setUserAvatar,
    updateUserAvatar,
    refreshUserProfile,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    loading,
    checkAndRefreshSession
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};