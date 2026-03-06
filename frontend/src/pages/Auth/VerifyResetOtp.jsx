import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
} from "../../redux/api/usersApiSlice";

const VerifyResetOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(120); // 120 seconds = 2 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const inputRefs = useRef([]);

  const [verifyResetOtp, { isLoading }] = useVerifyResetOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((r) => r - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // 🎯 Time Formatter Function (120 -> 02:00)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (element, index) => {
    const val = element.value;

    // 🐛 Bug Fix: Only allow numbers, reject spaces
    if (val && !/^[0-9]+$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next input
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // 🐛 Bug Fix: Clear previous input when moving back with Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = ""; // Clear the previous box
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "") // Remove all non-numeric characters
      .slice(0, 6)
      .split("");

    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    pastedData.forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);

    // Focus appropriate input after paste
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResend = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("New OTP sent!");
      setResendTimer(120); // Reset timer to 2 minutes
      setOtp(new Array(6).fill("")); // Clear existing OTP inputs
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to resend");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return toast.error("Please enter all 6 digits");
    }

    try {
      const res = await verifyResetOtp({ email, otp: finalOtp }).unwrap();
      toast.success("OTP Verified!");

      navigate("/reset-password", {
        state: { email, resetToken: res.resetToken },
      });
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP");

      // Optional: Clear OTP fields on error so user can re-type quickly
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
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
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-[#007EFC] outline-none transition-all"
              />
            ))}
          </div>
          <button
            disabled={isLoading}
            className="w-full bg-[#007EFC] text-white font-bold py-4 rounded-xl hover:bg-[#006ee0] disabled:opacity-70 transition-all"
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          {/* Resend OTP Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={resendTimer > 0 || isResending}
              className="text-sm text-[#007EFC] hover:underline disabled:text-gray-400 disabled:no-underline font-medium transition-colors"
            >
              {isResending
                ? "Sending..."
                : resendTimer > 0
                  ? `Resend in ${formatTime(resendTimer)}` // 🎯 Updated Timer Display
                  : "Resend OTP"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default VerifyResetOtp;
