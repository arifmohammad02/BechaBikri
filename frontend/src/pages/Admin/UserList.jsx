/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch } = useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "asc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUser, setEditableUser] = useState({ username: "", email: "" });
  const [filters, setFilters] = useState({ role: "all" });

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Sorting logic (অক্ষত)
  const sortedUsers = [...(users || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Filtering logic (অক্ষত)
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === "all" || (filters.role === "admin" && user.isAdmin) || (filters.role === "user" && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  // Pagination (অক্ষত)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === currentUsers.length ? [] : currentUsers.map((u) => u._id));
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
      try {
        await Promise.all(selectedUsers.map((id) => deleteUser(id)));
        refetch();
        setSelectedUsers([]);
        toast.success(`${selectedUsers.length} users deleted`);
      } catch (err) { toast.error("Error deleting users"); }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted");
      } catch (err) { toast.error("Delete failed"); }
    }
  };

  const startEdit = (user) => {
    setEditableUserId(user._id);
    setEditableUser({ username: user.username, email: user.email });
  };

  const cancelEdit = () => {
    setEditableUserId(null);
    setEditableUser({ username: "", email: "" });
  };

  const saveEdit = async () => {
    try {
      await updateUser({ userId: editableUserId, ...editableUser });
      refetch();
      cancelEdit();
      toast.success("User updated");
    } catch (err) { toast.error(err?.data?.message || "Update failed"); }
  };

  return (
    <div className="min-h-screen bg-white font-mono pt-32 transition-all duration-500">
      <div className="flex flex-col 2xl:flex-row">
        <AdminMenu />

        <div className="flex-1 px-4 lg:px-8 pb-12">
          <div className="max-w-[1600px] mx-auto 2xl:pl-10">
            
            {/* Header Section */}
            <div className="mb-8 border-l-4 border-red-600 pl-4 py-2">
              <h1 className="text-3xl font-black text-black tracking-tighter uppercase">
                All  <span className="text-red-600">User_List</span>
              </h1>
            </div>

            {/* Controls Bar */}
            <div className="mb-6 flex flex-col xl:flex-row gap-4 items-center bg-gray-50 p-6 border border-gray-100 shadow-sm rounded-sm">
              <div className="relative flex-1 w-full">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="SEARCH_BY_IDENTITY..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:border-red-600 focus:ring-0 outline-none transition-all duration-300 placeholder:text-gray-300 text-sm font-bold tracking-widest"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-4 items-center w-full xl:w-auto">
                <select
                  className="px-6 py-3 bg-white border border-gray-200 text-[12px] font-black uppercase tracking-widest text-black focus:border-red-600 outline-none cursor-pointer"
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                >
                  <option value="all">ALL_ROLES</option>
                  <option value="admin">ADMINS_ONLY</option>
                  <option value="user">BASIC_USERS</option>
                </select>

                {selectedUsers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-6 py-3 bg-black text-white hover:bg-red-600 transition-colors duration-300 text-[12px] font-black uppercase tracking-widest flex items-center gap-2"
                  >
                    <FaTrash size={12} /> DELETE_SELECTED [{selectedUsers.length}]
                  </button>
                )}
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-gray-100 shadow-xl overflow-x-auto relative group">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-6 py-5 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                        onChange={toggleSelectAll}
                        className="accent-red-600 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    {[
                      { key: "username", label: "NAME_ID" },
                      { key: "email", label: "EMAIL_ADDR" },
                      { key: "isAdmin", label: "ACCESS_LEVEL" },
                      { key: "createdAt", label: "REG_DATE" },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="px-6 py-5 text-left text-[11px] font-black tracking-[0.2em] uppercase cursor-pointer hover:bg-red-600 transition-colors duration-300"
                        onClick={() => requestSort(key)}
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? <FaSortUp className="text-red-400" /> : <FaSortDown className="text-red-400" />
                          ) : (
                            <FaSort className="opacity-20" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-5 text-right text-[11px] font-black tracking-[0.2em] uppercase">COMMANDS</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`group transition-all duration-300 ${
                        selectedUsers.includes(user._id) ? "bg-red-50/50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleSelectUser(user._id)}
                          className="accent-red-600 w-4 h-4 cursor-pointer"
                        />
                      </td>

                      {/* Name Column */}
                      <td className="px-6 py-4">
                        {editableUserId === user._id ? (
                          <input
                            value={editableUser.username}
                            onChange={(e) => setEditableUser({ ...editableUser, username: e.target.value })}
                            className="w-full px-3 py-2 border-b-2 border-red-600 outline-none text-sm font-bold bg-transparent"
                          />
                        ) : (
                          <span className="text-sm font-bold text-black group-hover:text-red-600 transition-colors">
                            {user.username}
                          </span>
                        )}
                      </td>

                      {/* Email Column */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-500">
                        {editableUserId === user._id ? (
                          <input
                            value={editableUser.email}
                            onChange={(e) => setEditableUser({ ...editableUser, email: e.target.value })}
                            className="w-full px-3 py-2 border-b-2 border-red-600 outline-none text-sm font-bold bg-transparent"
                          />
                        ) : (
                          <span className="tracking-tight">{user.email}</span>
                        )}
                      </td>

                      {/* Role Column */}
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border ${
                          user.isAdmin 
                            ? "bg-black text-white border-black" 
                            : "bg-white text-gray-400 border-gray-200"
                        }`}>
                          {user.isAdmin ? "SUPER_USER" : "CLIENT_ID"}
                        </span>
                      </td>

                      {/* Joined Column */}
                      <td className="px-6 py-4 text-[12px] font-bold text-gray-400 italic">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          {editableUserId === user._id ? (
                            <>
                              <button onClick={saveEdit} className="p-2 text-green-600 hover:scale-125 transition-transform"><FaCheck /></button>
                              <button onClick={cancelEdit} className="p-2 text-red-600 hover:scale-125 transition-transform"><FaTimes /></button>
                            </>
                          ) : (
                            !user.isAdmin && (
                              <>
                                <button onClick={() => startEdit(user)} className="p-2 text-black hover:text-red-600 hover:scale-120 transition-all"><FaEdit /></button>
                                <button onClick={() => deleteHandler(user._id)} className="p-2 text-black hover:text-red-600 hover:scale-120 transition-all"><FaTrash /></button>
                              </>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Section */}
              <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <span className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                    DATA_SLICE: {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} / {filteredUsers.length}
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-red-600"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size}>SHOW_{size}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 flex items-center justify-center text-[10px] font-black transition-all duration-300 border ${
                        currentPage === i + 1
                          ? "bg-black text-white border-black scale-110 shadow-lg"
                          : "bg-white text-gray-400 border-gray-100 hover:border-red-600 hover:text-red-600"
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;