import { NavLink } from "react-router-dom";
import { BsHouse } from "react-icons/bs";
import { CiUser } from "react-icons/ci";

const Sidebar = () => {
  return (
    <div className="w-72 h-fit border rounded-md text-white p-6 bg-[#FFFFFF]">
      <h2 className="font-semibold text-[23px] font-dosis mb-4 text-[#3C3836]">Dashboard</h2>
      <nav className="space-y-3">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-4 rounded text-[#3C3836] text-[16px] font-medium font-figtree transition-all ${isActive ? "bg-[#FFECCC] text-[#E89B17]" : "hover:bg-[#FFECCC]"}`
          }
        >
          <CiUser  /> Profile
        </NavLink>
        <NavLink
          to="/user-orders"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-4 rounded text-[#3C3836] transition-all ${isActive ? "bg-[#FFECCC] text-[#E89B17]" : "hover:bg-[#FFECCC]"}`
          }
        >
          <BsHouse /> Orders List
        </NavLink>

      </nav>
    </div>
  );
};

export default Sidebar;
