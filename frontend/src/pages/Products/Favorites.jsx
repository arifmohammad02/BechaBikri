import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorite/favoriteSlice";
import Product from "./Product";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { LuShoppingBag } from "react-icons/lu";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <div className="bg-white py-3">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen text-white w-full container mx-auto flex items-center justify-center">
          <div className="">
            {/* Check if the 'favorites' array is empty */}
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center gap-4">
                <p><LuShoppingBag className="w-28 h-28 text-black" /></p>
                <span className="text-[30px] font-medium font-sans text-center text-black">Your Favorite is empty </span>
                <p className=" max-w-96 text-center text-black">Add products while you shop, so they'll be ready for checkout later. </p>
                <button className="flex items-center gap-3 bg-blue-700 text-white py-3 px-5 rounded-md hover:bg-blue-600 transition-all ease-in-out duration-300">
                  <Link to="/shop">Go To Shop</Link>
                  <FaArrowRight />
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-3 lg:px-6">
                {favorites.map((product) => (
                  <div key={product._id} className=" ">
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>

  );
};

export default Favorites;
