import { useEffect } from "react";
import { FaHeart, FaRegHeart, FaVaadin } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
  setFavorites,
} from "../../redux/features/favorite/favoriteSlice";

import {
  addFavoriteToLocalStorage,
  getFavoritesFromLocalStorage,
  removeFavoriteFromLocalStorage,
} from "../../Utils/localStorage";

const HeartIcon = ({ product }) => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites) || [];
  const isFavorite = favorites.some((p) => p._id === product._id);

  useEffect(() => {
    const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
    dispatch(setFavorites(favoritesFromLocalStorage));
  }, []);

  const toggleFavorites = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      // remove the product from the localStorage as well
      removeFavoriteFromLocalStorage(product._id);
    } else {
      dispatch(addToFavorites(product));
      // add the product to localStorage as well
      addFavoriteToLocalStorage(product);
    }
  };

  return (
    <div
      className="text-[#B88E2F] text-[16px] cursor-pointer md:border md:border-[#ED174A] rounded-3xl"
      onClick={toggleFavorites}
    >
      {isFavorite ? (
        <div className="flex items-center gap-1 text-[12px] font-medium font-poppins px-2 w-fit ">
          <FaHeart className="font-normal" />
          <span className="hidden md:inline">Favorite</span>
        </div>
      ) : (
        <div className="flex items-center gap-1 text-[12px] font-medium font-poppins px-2 w-fit">
          <FaRegHeart className="text-[#ED174A] font-normal" />
          <span className="text-black hidden md:inline">Add to Favorites</span>
        </div>
      )}
    </div>
  );
};

export default HeartIcon;
