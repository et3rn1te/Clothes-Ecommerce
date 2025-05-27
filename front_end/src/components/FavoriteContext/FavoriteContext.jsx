import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [session, setSession] = useState(() => {
      return JSON.parse(localStorage.getItem("session"));
    });
    useEffect(() => {
      const interval = setInterval(() => {
        const storedSession = JSON.parse(localStorage.getItem("session"));
        if (storedSession?.token && !session) {
          setSession(storedSession); // Đặt lại session để trigger useEffect fetch
        }
      }, 500); // kiểm tra mỗi 500ms
  
      return () => clearInterval(interval); // clear khi unmount
    }, [session]);
    useEffect(() => {
      const fetchFavorites = async () => {
        if (!session?.currentUser?.id || !session?.token) return;
        try {
          const response = await axios.get(
            `http://localhost:8080/api/favorite/idUser/${session.currentUser.id}`,
            {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            }
          );
          setWishlistItems(response.data.result || []);
        } catch (error) {
          console.error('Lỗi khi fetch danh sách yêu thích:', error);
        }
      };
      fetchFavorites();
    }, [session]);

    const clearWishlist = () => {
      setWishlistItems([]);
    };
  
   
  return (
    <FavoriteContext.Provider value={{ wishlistItems,clearWishlist}}>
      {children}
    </FavoriteContext.Provider>
  );
};
