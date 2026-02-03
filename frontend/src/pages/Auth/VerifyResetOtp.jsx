import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyResetOtpMutation } from "../../redux/api/usersApiSlice";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");
    try {
      await verifyResetOtp({ email, otp: finalOtp }).unwrap();
      toast.success("OTP Verified!");
      // ইমেইলটি সাথে নিয়ে নতুন পাসওয়ার্ড পেজে যাওয়া
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-[460px] bg-white shadow-xl rounded-2xl p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
        <p className="text-gray-500 mb-8">Sent to {email}</p>
        <form onSubmit={submitHandler}>
          <div className="flex justify-center gap-2 mb-8">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-[#007EFC] outline-none"
              />
            ))}
          </div>
          <button disabled={isLoading} className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl">
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default VerifyResetOtp;