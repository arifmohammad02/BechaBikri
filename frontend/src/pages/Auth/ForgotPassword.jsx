import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useForgotPasswordMutation } from "../../redux/api/usersApiSlice";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "OTP sent to your email!");
      // ইমেইলটি state হিসেবে পাঠিয়ে ভেরিফাই পেজে যাওয়া
      navigate("/verify-reset-otp", { state: { email } });
    } catch (err) {
      toast.error(err?.data?.message || "User not found");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-[440px] bg-white border border-gray-100 shadow-xl rounded-2xl p-8 md:p-10">
        <h2 className="text-3xl font-extrabold text-center mb-6">Forgot Password</h2>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
              <FaEnvelope size={14} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007EFC]"
              required
            />
          </div>
          <button disabled={isLoading} className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl hover:bg-[#006ee0]">
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
        <Link to="/login" className="mt-8 flex items-center justify-center gap-2 text-[#007EFC] font-bold">
          <FaArrowLeft size={12} /> Back to Login
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;