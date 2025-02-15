import React from "react";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { Link } from "react-router-dom";

const Category = () => {
  const { data, error, isLoading } = useFetchCategoriesQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Ensure data is an array and has items
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No categories found.</div>;
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center">
        <h1 className="text-[48px] font-figtree font-bold text-center text-[#212B36]">
          Categories
        </h1>
        <p className="text-[16px] font-figtree font-normal text-center text-[#212B36] mb-6">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Repellendus,
          distinctio.
        </p>
      </div>
      <div className="flex items-center justify-center gap-12 flex-wrap ">
        {data.map((category) => (
          <Link
            to={`/shop?category=${category._id}`} // Pass category ID as query parameter
            key={category._id}
          >
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-[3px] hover:border-blue-400 hover:scale-105 transition-all duration-300 group">
              <div className="absolute inset-0 bg-[#DFDFE3] bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 z-20"></div>
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full rounded-full object-cover z-10 transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <h4 className="text-[14px] font-figtree text-[#212B36] font-semibold mt-4 text-center">
              {category.name}
            </h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
