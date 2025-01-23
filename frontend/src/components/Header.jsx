import { Link } from "react-router-dom";
import ProductCarousel from "../pages/Products/ProductCarousel";
import SmallProduct from "../pages/Products/SmallProduct ";
import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import { FaLongArrowAltRight } from "react-icons/fa";
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
      <div className="container mx-auto flex justify-between gap-5">
        <div className="w-full">
          <div className="flex justify-between items-center mb-5 mt-10 px-3 md:px-0">
            <div className="border-l-[4px] h-10 border-[#B88E2F] flex items-center pl-3">
              <h1 className="text-4xl font-bold font-mono text-[#3A3A3A]">
                Our Products
              </h1>
            </div>
            <Link
              to="/shop"
              className="flex items-center justify-center gap-1 border rounded-xl font-sens font-medium text-lg text-gray-400 hover:text-[#000000] py-1 px-3 md:px-5 cursor-pointer"
            >
              View All
              <FaLongArrowAltRight className="text-xs" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 px-3 md:px-0">
            {data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
