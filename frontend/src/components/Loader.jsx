import React from "react";
import { FaSpinner } from "react-icons/fa6";

const Loader = () => {
  return (
    <div className=" text-[#B88E2F] text-5xl h-screen w-full flex flex-col justify-center items-center">
      <FaSpinner className="animate-spin" />
      <p className="text-lg  font-medium tracking-wide mt-1 text-[#B88E2F] ">
        Loading...
      </p>
    </div>
  );
};

export default Loader;
