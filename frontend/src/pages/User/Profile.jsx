import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "@redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Show SweetAlert2 confirmation popup
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update your profile?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        try {
          const res = await updateProfile({
            _id: userInfo._id,
            username,
            email,
            password,
          }).unwrap();
          dispatch(setCredentials({ ...res }));
          toast.success("Profile updated successfully");
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    }
  };

  return (
    <div className="py-5 min-h-screen flex items-center justify-center px-3 pt-20 bg-white">
      <div className="w-full max-w-2xl p-8 rounded-lg bg-[#F9F1E7] border">
        <h2 className="text-3xl font-poppins font-semibold text-gray-800 text-center mb-6">
          Update Profile
        </h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="mb-4">
            <label className="block text-sm font-normal font-poppins text-gray-600 mb-2">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-4 rounded-lg font-normal font-poppins border-2 text-gray-700 outline-none "
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-normal font-poppins text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-4 rounded-lg font-normal font-poppins border-2 text-gray-700 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-normal font-poppins text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 rounded-lg font-normal font-poppins border-2 text-gray-700 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-normal font-poppins text-gray-600 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full p-4 rounded-lg font-normal font-poppins border-2 text-gray-700 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-[#B88E2F] text-white py-2 px-6 rounded-md text-lg font-normal font-poppins "
            >
              Update
            </button>

            <Link
              to="/user-orders"
              className="bg-[#B88E2F] text-white py-2 px-6 rounded-md text-lg font-normal font-poppins"
            >
              My Orders
            </Link>
          </div>

          {loadingUpdateProfile && (
            <div className="text-center text-gray-500">Loading...</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
