/* eslint-disable react/prop-types */

import { HiHeart } from "react-icons/hi";
import { Link } from "react-router-dom";
import FavoritesCount from "../pages/Products/FavoritesCount";

const FavoriteIcon = ({ onClick }) => {
  return (
    <Link to="/favorite" onClick={onClick} className="relative group block">
      <div 
        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-full border border-gray-200 transition-all duration-300 ease-in-out group-hover:bg-rose-50 group-hover:border-rose-200 group-hover:shadow-sm"
      >
        <HiHeart 
          className="text-gray-400 transition-colors duration-300 group-hover:text-rose-500" 
          size={20} 
        />
        
        {/* Badge Position */}
        <div className="absolute -top-1 -right-1">
          <FavoritesCount />
        </div>
      </div>
    </Link>
  );
};

export default FavoriteIcon;