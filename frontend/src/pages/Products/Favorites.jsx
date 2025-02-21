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
        <div className="mt-[100px]">
          <div className="py-8 bg-[#E8E8E8]">
            <div className="container mx-auto flex items-center gap-2 px-3 sm:px-0">
              <Link
                to="/"
                className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]"
              >
                Home
              </Link>
              <span className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]">
                /
              </span>
              <span className="text-[#9B9BB4] font-medium font-serif text-[14px] md:text-[18px]">
              Favorite
              </span>
            </div>
          </div>
          <div className="font-poppins text-white w-full container mx-auto flex">
            <div className=" flex justify-center items-center w-full py-10">
          
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center gap-4">
                  <p>
                    <LuShoppingBag className="w-28 h-28 text-black" />
                  </p>
                  <span className="text-[30px] font-medium font-sans text-center text-black">
                    Your Favorite is empty{" "}
                  </span>
                  <p className=" max-w-96 text-center text-black">
                    Add products while you shop, so they'll be ready for
                    checkout later.{" "}
                  </p>
                  <button className="flex items-center gap-3 font-poppins bg-[#B88E2F] text-white py-3 px-5 rounded-md hover:bg-[#8b784c] transition-all ease-in-out duration-300">
                    <Link to="/shop">Go To Shop</Link>
                    <FaArrowRight />
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-3 sm:px-0 mt-10">
                  {favorites.map((product) => (
                    <div key={product._id} className=" ">
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
