import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "@redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="bg-white min-h-screen h-full ">
      <div className="">
        {!keyword ? <Header /> : null}
        <div className="container mx-auto py-4 px-3 md:px-0 pt-6">
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message variant="danger">
              {isError?.data.message || isError.error}
            </Message>
          ) : (
            <>
              <div className="flex justify-between items-center mb-5 mt-8">
                <div className="border-l-[4px] h-10 border-[#B88E2F] flex items-center pl-3">
                <h1 className="text-4xl font-bold font-mono text-[#3A3A3A]">
                  Special Products
                </h1>
                </div>

                {/* <Link
                  to="/shop"
                  className="bg-[#B88E2F] font-poppins font-medium text-lg rounded-md py-1 px-3 md:px-5 text-white"
                >
                  Shop
                </Link> */}
              </div>

              <div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 py-2 xl:py-5 w-full">
                  {data.products.map((product) => (
                    <div key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
