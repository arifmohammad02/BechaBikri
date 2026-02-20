/* eslint-disable react-hooks/exhaustive-deps */
import ProductCard from "./Products/ProductCard";
import { useEffect, useState,  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
// UPDATE START
import { FaTimes, FaFilter, FaChevronRight, FaUndoAlt,  FaFolder, FaFolderOpen, FaRegSquare, FaRegCheckSquare, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; 
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
// UPDATE END
import { Link, useLocation } from "react-router-dom";

const Shop = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // UPDATE START
  const [expanded, setExpanded] = useState([]);
  // UPDATE END

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

  // UPDATE START
  const handleCheckChange = (newChecked) => {
    dispatch(setChecked(newChecked));
  };
  // UPDATE END

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
    // UPDATE START
    setExpanded([]);
    // UPDATE END
  };

  // UPDATE START
  // রিলেশনাল ডেটাকে ট্রি ডাটা ফরম্যাটে রূপান্তর করার ফাংশন
  const formatCategoriesToTree = (allCategories, parentId = null) => {
    return allCategories
      .filter((c) => {
        const cParentId = c.parent?._id || c.parent;
        return parentId === null ? !cParentId : cParentId === parentId;
      })
      .map((category) => {
        const children = formatCategoriesToTree(allCategories, category._id);
        return {
          value: category._id,
          label: category.name,
          children: children.length > 0 ? children : null,
        };
      });
  };

  const treeData = categories ? formatCategoriesToTree(categories) : [];
  // UPDATE END

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h3 className="text-md font-bold mb-4 flex items-center gap-2 text-gray-800">
          <span className="w-1 h-5 bg-[#B88E2F] rounded-full"></span>
          Categories
        </h3>
        <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
          {/* UPDATE START */}
          {categories && categories.length > 0 ? (
            <div className="modern-tree-wrapper">
              <CheckboxTree
                nodes={treeData}
                checked={checked}
                expanded={expanded}
                onCheck={handleCheckChange}
                onExpand={(newExpanded) => setExpanded(newExpanded)}
                icons={{
                  check: <FaRegCheckSquare className="text-[#B88E2F]" />,
                  uncheck: <FaRegSquare className="text-gray-300" />,
                  halfCheck: <FaRegCheckSquare className="text-[#B88E2F] opacity-50" />,
                  expandClose: <FaChevronRight className="text-gray-400" />,
                  expandOpen: <FaChevronDown className="text-[#B88E2F]" />,
                  parentClose: <FaFolder className="text-gray-300" />,
                  parentOpen: <FaFolderOpen className="text-[#B88E2F] opacity-80" />,
                  leaf: <div className="w-2 h-2 bg-gray-200 rounded-full ml-1" />,
                }}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-50 animate-pulse rounded-xl"></div>)}
            </div>
          )}
          {/* UPDATE END */}
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h3 className="text-md font-bold mb-4 flex items-center gap-2 text-gray-800">
          <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
          Brands
        </h3>
        <div className="flex flex-wrap gap-2">
          {uniqueBrands?.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                radio === brand
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h3 className="text-md font-bold mb-4 flex items-center gap-2 text-gray-800">
          <span className="w-1 h-5 bg-green-500 rounded-full"></span>
          Price
        </h3>
        <div className="relative">
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">৳</span>
           <input
            type="number"
            placeholder="Max Price"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-[#B88E2F]/20 outline-none transition-all text-sm"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={handleResetFilters}
        className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#B88E2F] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-gray-200"
      >
        <FaUndoAlt size={12} />
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] mt-[105px]">
      <div className="py-6 bg-[#F9F1E7]/40 border-b border-gray-50">
        <div className="container mx-auto px-4 flex items-center gap-3 text-sm">
          <Link to="/" className="text-gray-400 hover:text-[#B88E2F]">Home</Link>
          <FaChevronRight className="text-[8px] text-gray-300" />
          <span className="text-[#B88E2F] font-bold">Shop</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          
          <aside className="hidden lg:block w-1/4 sticky top-32">
            <FilterContent />
          </aside>

          <AnimatePresence>
            {isSidebarOpen && (
              <div className="fixed inset-0 z-[1000] lg:hidden">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                  onClick={toggleSidebar} 
                />
                <motion.aside 
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "tween", duration: 0.3 }}
                  className="absolute right-0 top-0 h-full w-[280px] bg-white p-6 shadow-2xl overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={toggleSidebar} className="p-2 bg-gray-50 rounded-lg"><FaTimes /></button>
                  </div>
                  <FilterContent />
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          <main className="flex-1 w-full overflow-hidden">
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 text-sm font-medium">
                Found <span className="text-black font-bold">{products?.length}</span> Products
              </p>
              
              <button
                onClick={toggleSidebar}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#B88E2F] text-white rounded-xl text-sm font-bold"
              >
                <FaFilter size={12} /> Filters
              </button>
            </div>

            {/* UPDATE START */}
            {filteredProductsQuery.isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[350px] bg-gray-50 animate-pulse rounded-3xl"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No items found!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products?.map((p) => (
                  <div key={p._id}>
                    <ProductCard p={p} />
                  </div>    
                ))}
              </div>
            )}
            {/* UPDATE END */}
          </main>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B88E2F; border-radius: 10px; }
        
        /* UPDATE START */
        /* Tree View Custom Styling */
        .modern-tree-wrapper .react-checkbox-tree {
          font-family: inherit;
          font-size: 14px;
        }
        .modern-tree-wrapper .rct-text {
          padding: 4px 0;
          transition: all 0.2s;
        }
        .modern-tree-wrapper .rct-text:hover {
          background: rgba(184, 142, 47, 0.05);
          border-radius: 8px;
        }
        .modern-tree-wrapper .rct-title {
          padding-left: 8px;
          color: #4b5563;
          font-weight: 500;
        }
        .modern-tree-wrapper .rct-node-clickable:hover .rct-title {
          color: #000;
        }
        .modern-tree-wrapper .rct-collapse {
          padding: 0 4px;
          display: flex;
          align-items: center;
        }
        .modern-tree-wrapper label {
          margin-bottom: 0;
          cursor: pointer;
        }
        /* UPDATE END */
      `}</style>
    </div>
  );
};

export default Shop;