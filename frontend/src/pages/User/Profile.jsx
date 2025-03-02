import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "@redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";

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
    <div className="mt-[100px]">
      <div className="py-6 bg-[#E8E8E8]">
        <div className="container mx-auto flex items-center gap-2 px-3 sm:px-0">
          <Link
            to="/"
            className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]"
          >
            Home
          </Link>
          <span className="text-[#000000] font-medium font-serif text-[14px] md:text-[18px]">
            /
          </span>
          <span className="text-[#9B9BB4] font-medium font-serif text-[14px] md:text-[18px]">
            My Account
          </span>
        </div>
      </div>
      <div className="flex container mx-auto flex-col lg:flex-row lg:items-start py-10 gap-10 px-3 xs:px-0">
        <Sidebar />
        <div className="w-full p-8 rounded-md bg-white border">
          <h2 className="text-[23px]  font-dosis font-semibold text-[#3C3836] mb-4">
            My Account
          </h2>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="flex items-center gap-5 flex-col md:flex-row">
              <div className="mb-4 w-full">
                <label className="block text-[16px] font-normal font-poppins text-[#3C3836] mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full p-4 rounded-md font-normal font-poppins text-[14px] border text-[#000000] outline-none placeholder:text-[#000000] placeholder:text-[14px] placeholder:font-poppins placeholder:font-normal"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="mb-4 w-full">
                <label className="block text-[16px] font-normal font-poppins text-[#3C3836] mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-4 rounded-md font-normal font-poppins text-[14px] border text-[#000000] outline-none placeholder:text-[#000000] placeholder:text-[14px] placeholder:font-poppins placeholder:font-normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-5 flex-col md:flex-row">
              <div className="mb-4 w-full">
                <label className="block text-[16px] font-normal font-poppins text-[#3C3836] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full p-4 rounded-md font-normal font-poppins text-[14px] border text-[#000000] outline-none placeholder:text-[#000000] placeholder:text-[14px] placeholder:font-poppins placeholder:font-normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-4 w-full">
                <label className="block text-[16px] font-normal font-poppins text-[#3C3836] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full p-4 rounded-md font-normal font-poppins text-[14px] border text-[#000000] outline-none placeholder:text-[#000000] placeholder:text-[14px] placeholder:font-poppins placeholder:font-normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 font-roboto text-white py-3 px-8 rounded-md text-[16px] font-medium"
              >
                Update
              </button>
            </div>

            {loadingUpdateProfile && (
              <div className="text-center text-gray-500">Loading...</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
