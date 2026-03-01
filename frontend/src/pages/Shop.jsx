
import ProductCard from "./Products/ProductCard";
import PropTypes from "prop-types";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  useGetFilteredProductsQuery, 
  useGetProductsQuery,
  useGetNewArrivalsQuery 
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
  setRadio,
} from "../redux/features/shop/shopSlice";
import { 
  FaTimes, 
  FaFilter, 
  FaChevronRight, 
  FaUndoAlt,  
  FaFolder, 
  FaFolderOpen, 
  FaRegSquare, 
  FaRegCheckSquare, 
  FaChevronDown,
  FaSearch,
  FaHistory,
  FaFire,
  FaThLarge,
  FaList,
  FaSortAmountDown,
  FaHeart,
  FaSlidersH,
  FaChevronLeft
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion"; 
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce.js";
import { Range } from 'react-range';

// 🎯 React-Range Price Slider (No Input Fields)
const PriceRangeSlider = ({ min, max, value, onChange, currency = "৳" }) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleFinalChange = (newValue) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
          <FaSlidersH className="text-[#B88E2F]" />
          Price Range
        </h3>
        <span className="text-xs font-bold text-[#B88E2F] bg-[#B88E2F]/10 px-3 py-1 rounded-full">
          {currency}{localValue[0].toLocaleString()} - {currency}{localValue[1].toLocaleString()}
        </span>
      </div>

      <div className="px-1 py-2">
        <Range
          step={100}
          min={min}
          max={max}
          values={localValue}
          onChange={(vals) => setLocalValue(vals)}
          onFinalChange={(vals) => handleFinalChange(vals)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-2 w-full bg-gray-200 rounded-full relative"
            >
              <div
                className="absolute h-full bg-[#B88E2F] rounded-full"
                style={{
                  left: `${((localValue[0] - min) / (max - min)) * 100}%`,
                  width: `${((localValue[1] - localValue[0]) / (max - min)) * 100}%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-5 h-5 bg-white border-2 border-[#B88E2F] rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/30 cursor-grab active:cursor-grabbing"
            />
          )}
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-3">
          <span>{currency}0</span>
          <span>{currency}100k</span>
        </div>
      </div>
    </div>
  );
};

PriceRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  currency: PropTypes.string
};

// 🎯 Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-3 mt-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#B88E2F] hover:text-[#B88E2F]"
          }`}
        >
          <FaChevronLeft size={12} />
          Prev
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`min-w-[40px] h-10 rounded-xl text-sm font-bold transition-all ${
                page === currentPage
                  ? "bg-[#B88E2F] text-white shadow-lg shadow-[#B88E2F]/30"
                  : page === '...'
                  ? "text-gray-400 cursor-default"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#B88E2F] hover:text-[#B88E2F]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#B88E2F] hover:text-[#B88E2F]"
          }`}
        >
          Next
          <FaChevronRight size={12} />
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} products
      </p>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired
};

// Skeleton Components
const ProductSkeleton = ({ viewMode }) => {
  if (viewMode === "list") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col sm:flex-row gap-4 bg-white rounded-2xl p-4 border border-gray-100"
      >
        <div className="relative w-full sm:w-48 h-48 flex-shrink-0">
          <div className="w-full h-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="space-y-3">
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-3/4 h-6 bg-gray-300 rounded animate-pulse" />
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="w-24 h-8 bg-gray-300 rounded-lg animate-pulse" />
            <div className="w-28 h-10 bg-gray-300 rounded-xl animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-100 overflow-hidden flex flex-col h-[420px]"
    >
      <div className="relative h-[200px] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <div className="w-16 h-3 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="w-full h-8 bg-gray-300 rounded mb-2 animate-pulse" />
        <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
      </div>
    </motion.div>
  );
};

ProductSkeleton.propTypes = {
  viewMode: PropTypes.oneOf(["grid", "list"]).isRequired
};

const FilterSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white p-5 rounded-3xl border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-gray-200 rounded-full animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("category");
  const sortParam = queryParams.get("sort") || "newest";
  
  const [searchInput, setSearchInput] = useState(urlKeyword || "");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debouncedSearch = useDebounce(searchInput, 300);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [expanded, setExpanded] = useState([]);

  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  
  const { 
    data: searchResults, 
    isLoading: isSearching,
  } = useGetProductsQuery(
    { keyword: urlKeyword || "" }, 
    { skip: !urlKeyword }
  );

  const filteredProductsQuery = useGetFilteredProductsQuery({ 
    checked, 
    radio,
    keyword: urlKeyword 
  });

  const { data: newArrivals } = useGetNewArrivalsQuery(5);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = useCallback((term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      saveRecentSearch(searchInput.trim());
      navigate(`/shop/${encodeURIComponent(searchInput.trim())}`);
      setShowSearchDropdown(false);
      inputRef.current?.blur();
      scrollToTop();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (!showSearchDropdown && value.length > 0) {
      setShowSearchDropdown(true);
    }
  };

  const handleSuggestionClick = (term) => {
    setSearchInput(term);
    saveRecentSearch(term);
    navigate(`/shop/${encodeURIComponent(term)}`);
    setShowSearchDropdown(false);
    scrollToTop();
  };

  const clearSearch = () => {
    setSearchInput("");
    navigate("/shop");
    inputRef.current?.focus();
    scrollToTop();
  };

  useEffect(() => {
    if (debouncedSearch.length > 1) {
      const allProducts = filteredProductsQuery.data || [];
      const matched = allProducts
        .filter(p => 
          p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.brand?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearch, filteredProductsQuery.data]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (categoryId && categories) {
      dispatch(setChecked([categoryId]));
    }
  }, [categoryId, categories, dispatch]);

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.isLoading, categoriesQuery.data, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
  }, [urlKeyword, checked, radio, priceRange, sortBy]);

  useEffect(() => {
    let finalProducts = [];
    
    if (urlKeyword && searchResults?.products) {
      finalProducts = searchResults.products;
    } else if (filteredProductsQuery.data) {
      finalProducts = filteredProductsQuery.data;
    }

    if (finalProducts.length > 0) {
      finalProducts = finalProducts.filter(
        p => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
    }

    finalProducts = sortProducts(finalProducts, sortBy);
    dispatch(setProducts(finalProducts));
  }, [
    urlKeyword, 
    searchResults, 
    filteredProductsQuery.data, 
    dispatch, 
    priceRange,
    sortBy
  ]);

  const sortProducts = (products, sortType) => {
    const sorted = [...products];
    switch (sortType) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "bestselling":
        return sorted.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
      case "rating":
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "newest":
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
  const paginatedProducts = products?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToTop();
  };

  const handleBrandClick = useCallback((brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
    setCurrentPage(1);
    scrollToTop();
  }, [filteredProductsQuery.data, dispatch, scrollToTop]);

  const handleCheckChange = (newChecked) => {
    dispatch(setChecked(newChecked));
    setCurrentPage(1);
    scrollToTop();
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter((brand) => brand !== undefined)
    ),
  ];

  const popularSearches = [
    "iPhone", "Samsung", "Headphones", "Smart Watch", "Laptop", "Gaming"
  ];

  const handleResetFilters = () => {
    setPriceRange([0, 100000]);
    setSortBy("newest");
    setCurrentPage(1);
    dispatch(setChecked([]));
    dispatch(setRadio([]));
    setExpanded([]);
    if (urlKeyword) {
      clearSearch();
    }
    scrollToTop();
  };

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

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <PriceRangeSlider
          min={0}
          max={100000}
          value={priceRange}
          onChange={setPriceRange}
          currency="৳"
        />
      </div>

      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <h3 className="text-md font-bold mb-4 flex items-center gap-2 text-gray-800">
          <span className="w-1 h-5 bg-[#B88E2F] rounded-full"></span>
          Categories
        </h3>
        <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
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

      <button
        onClick={handleResetFilters}
        className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-bold hover:bg-[#B88E2F] transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-gray-200"
      >
        <FaUndoAlt size={12} />
        Reset All Filters
      </button>
    </div>
  );

  const isLoading = filteredProductsQuery.isLoading || isSearching;

  return (
    <div className="min-h-screen bg-[#FDFDFD] mt-[105px]">
      <div className="py-6 bg-[#F9F1E7]/40 border-b border-gray-50">
        <div className="container mx-auto px-4 flex items-center gap-3 text-sm">
          <Link to="/" className="text-gray-400 hover:text-[#B88E2F]">Home</Link>
          <FaChevronRight className="text-[8px] text-gray-300" />
          <Link to="/shop" className="text-gray-400 hover:text-[#B88E2F]">Shop</Link>
          {urlKeyword && (
            <>
              <FaChevronRight className="text-[8px] text-gray-300" />
              <span className="text-[#B88E2F] font-bold truncate max-w-[200px]">
                Search: &ldquo;{urlKeyword}&ldquo;
              </span>
            </>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8" ref={searchRef}>
          <div className="relative max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative flex items-center">
                <FaSearch className="absolute left-5 text-gray-400 text-lg pointer-events-none" />
                
                <input
                  ref={inputRef}
                  type="text"
                  value={searchInput}
                  onChange={handleInputChange}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search for products, brands, categories..."
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  className="w-full pl-14 pr-32 py-4 bg-white border-2 border-gray-100 rounded-2xl text-gray-800 placeholder-gray-400 focus:border-[#B88E2F] focus:ring-4 focus:ring-[#B88E2F]/10 transition-all text-base shadow-sm outline-none"
                />
                
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-24 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  >
                    <FaTimes />
                  </button>
                )}
                
                <button
                  type="submit"
                  className="absolute right-2 bg-[#B88E2F] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#a17d28] transition-all shadow-lg shadow-[#B88E2F]/30 z-10"
                >
                  Search
                </button>
              </div>
            </form>

            <AnimatePresence>
              {showSearchDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                >
                  {recentSearches.length > 0 && !searchInput && (
                    <div className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-2 mb-3 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <FaHistory />
                        Recent Searches
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(term)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                          >
                            <FaHistory className="text-gray-400 text-xs" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!searchInput && (
                    <div className="p-4 border-b border-gray-50">
                      <div className="flex items-center gap-2 mb-3 text-orange-500 text-xs font-bold uppercase tracking-wider">
                        <FaFire />
                        Popular Now
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((term, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(term)}
                            className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg text-sm font-medium transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestions.length > 0 && searchInput && (
                    <div className="p-2">
                      {suggestions.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => navigate(`/product/${product.slug || product._id}`)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                        >
                          <img
                            src={product.image || product.images?.[0] || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg bg-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {product.brand} • ৳{product.price?.toLocaleString()}
                            </p>
                          </div>
                          <FaSearch className="text-gray-300 text-xs" />
                        </button>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full p-3 text-center text-sm text-[#B88E2F] font-medium hover:bg-[#B88E2F]/5 transition-colors border-t border-gray-50 mt-2"
                      >
                        View all results for &ldquo;{searchInput}&rdquo;
                      </button>
                    </div>
                  )}

                  {!searchInput && newArrivals && (
                    <div className="p-4 bg-gray-50/50">
                      <div className="flex items-center gap-2 mb-3 text-[#B88E2F] text-xs font-bold uppercase tracking-wider">
                        <FaHeart />
                        New Arrivals
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {newArrivals.slice(0, 5).map((product) => (
                          <button
                            key={product._id}
                            onClick={() => navigate(`/product/${product.slug || product._id}`)}
                            className="aspect-square rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
                          >
                            <img
                              src={product.image || product.images?.[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {urlKeyword && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <p className="text-gray-600">
                Found <span className="font-bold text-[#B88E2F]">{products?.length || 0}</span> results for 
                <span className="font-bold text-gray-900"> &ldquo;{urlKeyword}&rdquo;</span>
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          <aside className="hidden lg:block w-1/4 sticky top-32">
            {categoriesQuery.isLoading ? <FilterSkeleton /> : <FilterContent />}
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
                  className="absolute right-0 top-0 h-full w-[320px] bg-white p-6 shadow-2xl overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={toggleSidebar} className="p-2 bg-gray-50 rounded-lg">
                      <FaTimes />
                    </button>
                  </div>
                  {categoriesQuery.isLoading ? <FilterSkeleton /> : <FilterContent />}
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          <main className="flex-1 w-full overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <p className="text-gray-500 text-sm font-medium">
                  Showing <span className="text-black font-bold">{isLoading ? "..." : products?.length || 0}</span> Products
                </p>
                
                <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "grid" ? "bg-white text-[#B88E2F] shadow-sm" : "text-gray-400"
                    }`}
                  >
                    <FaThLarge size={14} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${
                      viewMode === "list" ? "bg-white text-[#B88E2F] shadow-sm" : "text-gray-400"
                    }`}
                  >
                    <FaList size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B88E2F]/20 cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="bestselling">Best Selling</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                  <FaSortAmountDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>

                <button
                  onClick={toggleSidebar}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#B88E2F] text-white rounded-xl text-sm font-bold"
                >
                  <FaFilter size={12} /> Filters
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className={`grid gap-4 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <ProductSkeleton key={i} viewMode={viewMode} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-100"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {urlKeyword 
                    ? `We couldn't find any matches for "${urlKeyword}"`
                    : "Try adjusting your filters or search terms"
                  }
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#B88E2F] text-white rounded-xl font-bold hover:bg-[#a17d28] transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className={`grid gap-4 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                    : "grid-cols-1"
                }`}>
                  {paginatedProducts?.map((p, index) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={viewMode === "list" ? "w-full" : ""}
                    >
                      <ProductCard p={p} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={products?.length || 0}
                />
              </>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #B88E2F; border-radius: 10px; }
        
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
      `}</style>
    </div>
  );
};

export default Shop;