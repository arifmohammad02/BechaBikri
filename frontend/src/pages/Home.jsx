import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "@redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import { FaLongArrowAltRight } from "react-icons/fa";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-white min-h-screen h-full px-3 md:px-0">
      <div className="">
        {!keyword ? <Header /> : null}
        <div className="container mx-auto py-4 pt-6">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data.message || isError.error}
            </Message>
          ) : (
            <>
              <div className="flex justify-between items-center mb-5 mt-8">
                <div className="text-center w-full">
                  <h1 className="text-[24px] md:text-[48px] font-figtree font-bold text-center text-[#212B36]">
                    Special Products
                  </h1>
                  <p className="text-[14px] md:text-[16px] font-figtree font-normal text-center text-[#212B36] mb-6">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Repellendus, distinctio.
                  </p>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5 w-full">
                  {data.products.map((product) => (
                    <div key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
                <Link
                  to="/shop"
                  className="flex justify-center items-center mb-5"
                >
                  <button className="bg-blue-600 hover:bg-blue-600/90 font-serif font-medium text-lg rounded-md py-2 px-4 text-white mt-5 flex items-center">
                    View All
                    <FaLongArrowAltRight className="ml-2" />
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
