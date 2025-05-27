import React, { useContext, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { FavoriteContext } from "../components/FavoriteContext/FavoriteContext";

const WishList = () => {
  // Added: Initial wishlist items state
  const { wishlistItems, setWishlistItems } = useContext(FavoriteContext);
  console.log(wishlistItems)

  // Added: Handler functions
  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const toggleFavorite = (id) => {
    setWishlistItems(wishlistItems.map(item =>
      item.id === id ? {...item, isFavorite: !item.isFavorite} : item
    ));
  };

  const addToCart = (id) => {
    // Placeholder for cart functionality
    console.log(`Added item ${id} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <FaHeart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 text-gray-500">Start adding some items to your wishlist!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative">
                  <img
                    src="https://picsum.photos/1080/1920"
                    alt={item.name}
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                  >
                  <FaHeart className="h-5 w-5 text-red-500" />
                    
                  </button>
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">{item.name}</h2>
                  <p className="text-xl font-bold text-gray-900 mt-2">${item.basePrice}</p>
                  
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => addToCart(item.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FaTrash className="mr-2" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;