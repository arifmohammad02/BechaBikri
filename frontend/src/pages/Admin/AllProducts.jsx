import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "@redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default to 5 items per page

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortConfig.key) {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    }
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className="flex items-start justify-center w-full p-5 min-h-screen h-full bg-white 2xl:container 2xl:mx-auto">
      <div className={`py-10 mt-20 w-full`}>
        <div className="text-[22px] font-bold font-figtree text-black mb-5">
          Products ({filteredProducts.length})
        </div>
        <AdminMenu />

        {/* Search Bar */}
        <div className="mb-5 border p-5">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-pink-500 placeholder:text-black placeholder:text-[14px] placeholder:font-figtree font-figtree font-medium text-[15px] text-black"
          />
        </div>

        {/* Items per page dropdown */}
        <div className="mb-5">
          <label htmlFor="itemsPerPage" className="mr-2 text-[16px] font-medium font-figtree text-gray-600">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-pink-100">
                <th
                  className="px-6 py-3 text-left  text-[16px] font-semibold font-figtree uppercase text-black border-b border-r cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-semibold font-figtree text-black uppercase border-b border-r">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-semibold font-figtree uppercase text-black border-b border-r">
                  Description
                </th>
                <th
                  className="px-6 py-3 text-left text-[16px] font-semibold font-figtree uppercase text-black border-b border-r cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price{" "}
                  {sortConfig.key === "price" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-6 py-3 text-left text-[16px] font-semibold font-figtree uppercase text-black border-b border-r cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Created At{" "}
                  {sortConfig.key === "createdAt" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-6 py-3 text-left text-[16px] font-semibold font-figtree text-black border-b uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => (
                <tr
                  key={product._id}
                  className={`group transition duration-300 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-pink-50`}
                >
                  <td className="px-6 py-4 font-medium text-[14px] font-figtree text-black border-b">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm border-b">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-[14px] font-figtree text-black border-b">
                    {product.description.substring(0, 100)}...
                  </td>
                  <td className="px-6 py-4 font-medium text-[14px] font-figtree text-black border-b">
                    BDT {product.price}
                  </td>
                  <td className="px-6 py-4 font-medium text-[14px] font-figtree text-black border-b">
                    {moment(product.createdAt).format("MMMM Do YYYY")}
                  </td>
                  <td className="px-6 py-4 font-medium text-[14px] font-figtree text-black border-b">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="inline-flex items-center px-4 py-2 tfont-semibold text-[14px] font-figtree text-white bg-gradient-to-r from-pink-600 to-pink-800 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-pink-700 transition duration-300"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 bg-pink-500 text-white rounded-md font-figtree text-[15px] font-semibold hover:bg-pink-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-[14px] font-normal font-figtree text-gray-700 uppercase">
            Showing {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, sortedProducts.length)} of{" "}
            {sortedProducts.length} items
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="p-2 bg-pink-500 text-white rounded-md font-figtree text-[15px] font-semibold hover:bg-pink-600 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
