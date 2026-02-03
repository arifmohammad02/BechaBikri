import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useResetPasswordMutation } from "../../redux/api/usersApiSlice";
import { FaLock } from "react-icons/fa";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords match na!");

    try {
      // ব্যাকেন্ডের নতুন লজিক অনুযায়ী ইমেইল ও পাসওয়ার্ড পাঠানো
      await resetPassword({ email, password }).unwrap();
      toast.success("Password reset done! Now login.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-[440px] bg-white shadow-xl rounded-2xl p-10">
        <h2 className="text-2xl font-bold text-center mb-8">New Password</h2>
        <form onSubmit={submitHandler} className="space-y-5">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><FaLock /></span>
            <input
              type="password"
              placeholder="New password"
              className="w-full pl-11 py-3 bg-gray-50 border rounded-xl outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"><FaLock /></span>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full pl-11 py-3 bg-gray-50 border rounded-xl outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={isLoading} className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl">
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;