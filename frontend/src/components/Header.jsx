import { Link } from "react-router-dom";
import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct ";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { FaLongArrowAltRight } from "react-icons/fa";
import Category from "./Category";
const Header = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();
  // console.log(data);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    <div className="lg:py-0 py-1">
      <div className="mt-16">
        <ProductCarousel />
      </div>
      <div>
        <Category />
      </div>
      <div className="container mx-auto flex justify-between gap-5">
        <div className="w-full">
          <div className="flex justify-between items-center mb-5 mt-10 px-3 md:px-0">
            <div className="text-center w-full">
              <h1 className="text-[48px] font-figtree font-bold text-center text-[#212B36]">
                Our Products
              </h1>
              <p className="text-[16px] font-figtree font-normal text-center text-[#212B36] mb-6">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Repellendus, distinctio.
              </p>
            </div>
          </div>
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-3 md:px-0">
              {data.map((product) => (
                <div key={product._id}>
                  <SmallProduct product={product} />
                </div>
              ))}
            </div>
            <Link to="/shop" className="flex justify-center mt-3">
              <button className="bg-blue-600 hover:bg-blue-600/90 font-serif font-medium text-lg rounded-md py-2 px-4 text-white mt-5 flex items-center">
                View All
                <FaLongArrowAltRight className="ml-2" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
