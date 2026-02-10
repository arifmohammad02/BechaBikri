
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Sidebar from "../../components/Sidebar";
import { motion } from "framer-motion";
import { BsPersonCircle, BsShieldLock } from "react-icons/bs";

const Profile = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    setUserName(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.username]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Confirm Update?",
      text: "Are you sure you want to change your profile details?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1D4ED8",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Save Changes",
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
          setPassword("");
          setConfirmPassword("");
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
    }
  };

  return (
    <div className="mt-[100px] bg-[#F8FAFC] min-h-screen">
      {/* 🟢 Modern Breadcrumb */}
      <div className="py-6 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest">
          <Link to="/" className="text-gray-400 hover:text-blue-600 transition-all">Home</Link>
          <span className="text-gray-200">/</span>
          <span className="text-blue-600">My Profile</span>
        </div>
      </div>

      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          <Sidebar />

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              {/* Profile Header Card */}
              <div className="p-8 border-b border-gray-50 bg-gradient-to-r from-blue-50/30 to-transparent">
                <h2 className="text-2xl font-mono font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
                  <BsPersonCircle className="text-blue-600" />
                  Account <span className="text-blue-600">Settings</span>
                </h2>
                <p className="text-gray-400 text-[10px] font-mono mt-1 uppercase tracking-widest">
                  Update your personal information and security
                </p>
              </div>

              <form onSubmit={submitHandler} className="p-8 space-y-8">
                {/* Information Section */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-black text-gray-400 uppercase tracking-wider ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-mono text-sm text-gray-800"
                        value={username}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-black text-gray-400 uppercase tracking-wider ml-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-mono text-sm text-gray-800"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-50" />

                {/* Password Section */}
                <div className="space-y-6">
                  <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                    <BsShieldLock /> Password Security
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-black text-gray-400 uppercase tracking-wider ml-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-mono text-sm"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] font-mono font-black text-gray-400 uppercase tracking-wider ml-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-blue-500/20 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none font-mono text-sm"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer / Submit */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-[10px] text-gray-400 font-mono italic">
                    * Leave password fields blank if you don&apos;t want to change it.
                  </p>
                  
                  <button
                    disabled={loadingUpdateProfile}
                    type="submit"
                    className="w-full md:w-auto bg-gray-900 text-white px-10 py-4 rounded-2xl text-[12px] font-mono font-black uppercase tracking-widest hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-gray-200"
                  >
                    {loadingUpdateProfile ? "Processing..." : "Update Profile"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;