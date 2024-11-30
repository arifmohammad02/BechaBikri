import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "@redux/api/productApiSlice"
import AdminMenu from "./AdminMenu";

const AllProducts = () => {
  const { data: products, isLoading, isError, } = useAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="flex items-center justify-center w-full p-5 min-h-screen h-full bg-white">
      <div className="w-full container mx-auto">
        <div className="text-2xl font-bold text-pink-500 mb-5 mt-16">
          All Products ({products.length})
        </div>
        <AdminMenu/>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-pink-100">
                <th className="px-6 py-3 text-left text-sm font-medium text-pink-600 border-b border-r">
                  Product Image
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-pink-600 border-b border-r">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-pink-600 border-b border-r">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-pink-600 border-b border-r">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-pink-600 border-b border-r">
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-pink-600 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product._id}
                  className={`group transition duration-300 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                >
                  <td className="px-6 py-4 text-sm border-b">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-md transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-pink-500 border-b group-hover:bg-gradient-to-r group-hover:from-pink-100 group-hover:to-pink-50">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 border-b group-hover:bg-gradient-to-r group-hover:from-pink-50 group-hover:to-gray-100">
                    {product.description.substring(0, 100)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b group-hover:bg-gradient-to-r group-hover:from-gray-100 group-hover:to-pink-50">
                    BDT {product.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 border-b group-hover:bg-gradient-to-r group-hover:from-pink-50 group-hover:to-gray-100">
                    {moment(product.createdAt).format("MMMM Do YYYY")}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium border-b">
                    <Link
                      to={`/admin/product/update/${product._id}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-pink-800 rounded-lg hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-pink-700 transition duration-300"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default AllProducts;
