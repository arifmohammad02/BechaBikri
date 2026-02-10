/* eslint-disable react-hooks/exhaustive-deps */
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
import { FaTimes, FaFilter, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Shop = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (categoryId && categories) {
      dispatch(setChecked([categoryId]));
    }
  }, [categoryId, categories, dispatch]);

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter((product) => {
        return priceFilter === "" || product.price <= parseInt(priceFilter, 10);
      });
      dispatch(setProducts(filteredProducts));
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
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter((brand) => brand !== undefined)
    ),
  ];

  const handleResetFilters = () => {
    setPriceFilter("");
    dispatch(setChecked([]));
    dispatch(setRadio([]));
  };

  // ফিল্টার সেকশন যা মোবাইল ও ডেস্কটপ উভয় জায়গায় ব্যবহার হবে
  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-5 border-l-4 border-[#B88E2F] pl-3 text-gray-800 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-4">
          {categories?.map((c) => (
            <label key={c._id} className="flex items-center group cursor-pointer">
              <input
                type="checkbox"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#B88E2F] checked:border-[#B88E2F] transition-all"
                checked={checked.includes(c._id)}
                onChange={(e) => handleCheck(e.target.checked, c._id)}
              />
              <span className="ml-3 text-gray-600 group-hover:text-[#B88E2F] font-medium transition-colors">
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-5 border-l-4 border-blue-600 pl-3 text-gray-800 uppercase tracking-wider">
          Brands
        </h3>
        <div className="flex flex-wrap gap-2">
          {uniqueBrands?.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                radio === brand
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-5 border-l-4 border-green-500 pl-3 text-gray-800 uppercase tracking-wider">
          Max Price
        </h3>
        <input
          type="number"
          placeholder="Enter Price"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-[#B88E2F] transition-all"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
      </div>

      <button
        onClick={handleResetFilters}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#B88E2F] transition-all shadow-lg active:scale-95"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] mt-[105px]">
      {/* 🟢 Breadcrumbs */}
      <div className="py-6 bg-[#F9F1E7]/30 border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-3 text-sm md:text-base">
          <Link to="/" className="text-gray-500 hover:text-[#B88E2F] transition-colors font-medium">Home</Link>
          <FaChevronRight className="text-xs text-gray-400" />
          <span className="text-[#B88E2F] font-semibold">Shop Products</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          
          {/* 🟢 Desktop Sidebar (Sticky) */}
          <aside className="hidden lg:block w-1/4 sticky top-32">
            <FilterContent />
          </aside>

          {/* 🟢 Mobile Sidebar (Drawer) */}
          <div 
            className={`fixed inset-0 z-[1000] lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleSidebar} />
            <aside className={`absolute right-0 top-0 h-full w-80 bg-white p-6 transition-transform duration-300 shadow-2xl overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={toggleSidebar} className="p-2 bg-gray-100 rounded-full"><FaTimes /></button>
              </div>
              <FilterContent />
            </aside>
          </div>

          {/* 🟢 Main Products Area */}
          <main className="flex-1 w-full">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-600 font-medium">
                Showing <span className="text-black font-bold">{products?.length}</span> Products
              </p>
              
              <button
                onClick={toggleSidebar}
                className="lg:hidden flex items-center gap-2 px-5 py-2.5 bg-[#B88E2F] text-white rounded-xl font-bold shadow-md hover:bg-[#a17a26] transition-all"
              >
                <FaFilter /> Filters
              </button>
            </div>

            {/* Grid */}
            {filteredProductsQuery.isLoading ? (
              <div className="flex justify-center py-20"><Loader /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <p className="text-xl text-gray-500 font-medium mb-4">No products found match your criteria.</p>
                <button onClick={handleResetFilters} className="text-[#B88E2F] font-bold underline underline-offset-4">Reset Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products?.map((p) => (
                  <div key={p._id} className="hover:-translate-y-2 transition-transform duration-300">
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;