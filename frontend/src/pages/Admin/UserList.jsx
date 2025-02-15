import { useState, useEffect } from "react";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
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

  // Sorting logic
  const sortedUsers = [...(users || [])].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Filtering logic
  const filteredUsers = sortedUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filters.role === "all" ||
      (filters.role === "admin" && user.isAdmin) ||
      (filters.role === "user" && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Sort handler
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Bulk selection
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map((user) => user._id));
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
      try {
        await Promise.all(selectedUsers.map((id) => deleteUser(id)));
        refetch();
        setSelectedUsers([]);
        toast.success(`${selectedUsers.length} users deleted`);
      } catch (err) {
        toast.error("Error deleting users");
      }
    }
  };

  // Edit handlers
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
      await updateUser({
        userId: editableUserId,
        ...editableUser,
      });
      refetch();
      cancelEdit();
      toast.success("User updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />

        <div className="flex-1 p-6 md:p-8">
          <div className="container mx-auto pl-7">
            <h1 className="text-[22px] font-bold text-black mb-6 font-figtree">
              User Management
            </h1>

            {/* Controls Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch border p-5">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 focus:ring-2 focus:ring-blue-500 placeholder:text-black placeholder:font-normal placeholder:font-figtree"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4 items-center">
                <select
                  className="px-4 py-3 border border-gray-200 bg-white text-[16px] font-figtree font-medium text-black"
                  value={filters.role}
                  onChange={(e) =>
                    setFilters({ ...filters, role: e.target.value })
                  }
                >
                  <option
                    value="all"
                    className="text-[12px] font-figtree font-medium text-black"
                  >
                    All Roles
                  </option>
                  <option
                    value="admin"
                    className="text-[12px] font-figtree font-medium text-black"
                  >
                    Admins
                  </option>
                  <option
                    value="user"
                    className="text-[12px] font-figtree font-medium text-black"
                  >
                    Users
                  </option>
                </select>

                {selectedUsers.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-3 bg-red-600 text-white hover:bg-red-700 text-[14px] font-figtree font-medium"
                  >
                    Delete Selected ({selectedUsers.length})
                  </button>
                )}
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white border overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 w-12 border-b">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === currentUsers.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    {[
                      { key: "username", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "isAdmin", label: "Role" },
                      { key: "createdAt", label: "Joined" },
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        className="px-6 py-4 text-left text-[16px] font-semibold font-figtree text-black uppercase cursor-pointer border-b"
                        onClick={() => requestSort(key)}
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <FaSortUp className="w-4 h-4" />
                            ) : (
                              <FaSortDown className="w-4 h-4" />
                            )
                          ) : (
                            <FaSort className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-4 text-right border-b text-[16px] font-semibold font-figtree uppercase text-black">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedUsers.includes(user._id) ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleSelectUser(user._id)}
                          className="rounded border-gray-300"
                        />
                      </td>

                      <td className="px-6 py-4">
                        {editableUserId === user._id ? (
                          <input
                            value={editableUser.username}
                            onChange={(e) =>
                              setEditableUser((prev) => ({
                                ...prev,
                                username: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-md"
                          />
                        ) : (
                          <span className="font-medium text-[14px] font-figtree text-black">{user.username}</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {editableUserId === user._id ? (
                          <input
                            value={editableUser.email}
                            onChange={(e) =>
                              setEditableUser((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border rounded-md font-medium text-[14px] font-figtree text-black"
                          />
                        ) : (
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:underline font-medium text-[14px] font-figtree text-black"
                          >
                            {user.email}
                          </a>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 font-medium text-[14px] rounded font-figtree text-black ${
                            user.isAdmin
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-medium text-[14px] font-figtree text-black">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        {editableUserId === user._id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <FaTimes />
                            </button>
                          </>
                        ) : (
                          !user.isAdmin && (
                            <>
                              <button
                                onClick={() => startEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => deleteHandler(user._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-[12px] font-figtree uppercase text-black">
                    Showing {indexOfFirstItem + 1} -{" "}
                    {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
                    {filteredUsers.length}
                  </span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="px-3 py-1 border rounded-md font-medium text-[14px] font-figtree text-black"
                  >
                    {[5, 10, 20, 50].map((size) => (
                      <option key={size} value={size} className="font-medium text-[14px] font-figtree text-black">
                        Show {size}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded-md font-medium text-[14px] font-figtree text-black ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
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
