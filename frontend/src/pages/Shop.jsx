import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import { FaBars, FaTimes } from "react-icons/fa"; // Import an icon for opening the sidebar
import { FaFilter } from "react-icons/fa6";

const Shop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to control sidebar visibility

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        // Filter products based on both checked categories and price filter
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );

        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const handleResetFilters = () => {
    setPriceFilter("");
    dispatch(setChecked([]));
    dispatch(setRadio([]));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="flex gap-8 py-20">
        {/* Filter Sidebar */}
        <div
          className={`w-64 h-full bg-gray-500 p-5 fixed top-0 right-0 transform transition-transform duration-300 ease-in-out z-50 pt-16 lg:pt-0 lg:z-0 rounded-md ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } lg:static lg:block lg:w-1/5 lg:h-auto lg:translate-x-0`}
        >
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 text-white text-2xl lg:hidden"
          >
            <FaTimes /> {/* Close icon */}
          </button>
          <h2 className="h4 text-center py-2 bg-black rounded-full mb-2 text-white mt-5">
            Filter by Categories
          </h2>
          {categories?.map((c) => (
            <div key={c._id} className="mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${c._id}`}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor={`category-${c._id}`}
                  className="ml-2 text-sm font-medium text-white"
                >
                  {c.name}
                </label>
              </div>
            </div>
          ))}

          <h2 className="h4 text-center py-2 bg-black text-white rounded-full mb-2">
            Filter by Brands
          </h2>
          {uniqueBrands?.map((brand) => (
            <div key={brand} className="mb-5">
              <div className="flex items-center">
                <input
                  type="radio"
                  id={brand}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500"
                />
                <label
                  htmlFor={brand}
                  className="ml-2 text-sm font-medium text-white"
                >
                  {brand}
                </label>
              </div>
            </div>
          ))}

          <h2 className="h4 text-center py-2 bg-black text-white rounded-full mb-2">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
          />
          <button
            className="w-full border my-4 px-3 py-2 text-white bg-pink-600 hover:bg-pink-700 rounded-lg"
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>

        {/* Products Section */}
        <div className="flex-1 max-h-[calc(100vh-70px)] overflow-y-auto scrollbar-hide">
          <div className="flex items-center justify-between px-3 md:px-0">
            <h2 className="h4 text-center mb-2 text-black">
              {products?.length} Products
            </h2>
            <div className="lg:hidden">
              <button
                className="  p-3 rounded-full text-black hover:bg-pink-600"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <FaFilter />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 px-3 xs:px-0 gap-3 md:gap-5">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <div key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
