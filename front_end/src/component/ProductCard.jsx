import React, { useState } from "react";
import { FaHeart, FaShare, FaShoppingCart, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useSpring, animated } from "react-spring";

const ProductCard = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
                <div
                 key={index}
                 className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg group" onClick={handleClick}
                >
                 <div className="relative overflow-hidden">
                   <img
                     src={product.image}
                     alt={product.name}
                     className="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500"
                   />
                   <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                     -{product.discount}%
                   </div>
                 </div>
                 <div className="p-4">
                   <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                   <span className="text-green-500 font-bold">${product.price}</span>
                   <div className="flex items-center justify-between">
                     
                     <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
                       <FiShoppingCart className="mr-2" />
                       Add to Cart
                     </button>
                     <button>
                       <FiHeart className="w-5 h-5 mr-2" />
                     </button>
                   </div>
                 </div>
               </div>
  );
};

export default ProductCard;