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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return toast.error("Please enter a valid email");
    }

    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || "OTP sent to your email!");

      navigate("/verify-reset-otp", { state: { email } });
    } catch (err) {
      toast.error(err?.data?.message || "User not found");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-50 blur-[100px]" />
        <div className="absolute bottom-[5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-50 blur-[100px]" />
      </div>

      <div className="w-full max-w-[440px] bg-white border border-gray-100 shadow-xl rounded-2xl p-8 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-extrabold text-center mb-2">
          Forgot Password
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Enter your email to receive OTP
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#007EFC] transition-colors">
              <FaEnvelope size={14} />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#007EFC] focus:ring-[3px] focus:ring-blue-100 transition-all"
              required
            />
          </div>

          <button
            disabled={isLoading}
            className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl hover:bg-[#006ee0] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-8 flex items-center justify-center gap-2 text-[#007EFC] font-bold hover:underline"
        >
          <FaArrowLeft size={12} /> Back to Login
        </Link>
      </div>
    </section>
  );
};

export default ForgotPassword;
