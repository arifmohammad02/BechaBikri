import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@redux/api/usersApiSlice";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";

const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-semibol mb-6 text-center">
        Users
      </h1>
      {isLoading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50">
          {/* Admin Menu */}
          <AdminMenu />
          {/* User Table Section */}
          <div className="w-full container mx-auto">
            <div className="mb-4 text-xl font-bold text-gray-800">
              Users ({users.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                {/* Table Head */}
                <thead className="bg-pink-100 text-black">
                  <tr>
                    <th className="px-4 py-3 text-left border-b border-gray-200">ID</th>
                    <th className="px-4 py-3 text-left border-b border-gray-200">NAME</th>
                    <th className="px-4 py-3 text-left border-b border-gray-200">EMAIL</th>
                    <th className="px-4 py-3 text-left border-b border-gray-200">ADMIN</th>
                    <th className="px-4 py-3 text-right border-b border-gray-200 uppercase">Action</th>
                  </tr>
                </thead>
                {/* Table Body */}
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-pink-50 transition-colors duration-300 border-b border-gray-300"
                    >
                      <td className="px-4 py-3 text-gray-600">{user._id}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {editableUserId === user._id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editableUserName}
                              onChange={(e) => setEditableUserName(e.target.value)}
                              className="w-full p-2 border border-gray-500 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span>{user.username}</span>
                            <button
                              onClick={() =>
                                toggleEdit(user._id, user.username, user.email)
                              }
                              className="ml-3 text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {editableUserId === user._id ? (
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={editableUserEmail}
                              onChange={(e) => setEditableUserEmail(e.target.value)}
                              className="w-full p-2 border border-gray-500 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                              onClick={() => updateHandler(user._id)}
                              className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <a
                            href={`mailto:${user.email}`}
                            className="text-gray-900 hover:underline"
                          >
                            {user.email}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500" />
                        ) : (
                          <FaTimes className="text-red-500" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!user.isAdmin && (
                          <button
                            onClick={() => deleteHandler(user._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      )}
    </div>
  );
};

export default UserList;
