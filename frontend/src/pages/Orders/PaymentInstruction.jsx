/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetPaymentMethodsQuery,
  useSubmitManualPaymentMutation,
  useCheckTransactionIdQuery, // 🆕 নতুন API endpoint
} from "../../redux/api/paymentApiSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useUploadProductImageMutation } from "../../redux/api/productApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import Loader from "../../components/Loader";
import {
  FaCopy,
  FaCheckCircle,
  FaUpload,
  FaArrowLeft,
  FaInfoCircle,
  FaLock,
  FaExclamationTriangle,
  FaSpinner,
  FaTimesCircle,
} from "react-icons/fa";

// ==========================================
// VALIDATION RULES
// ==========================================

const VALIDATION_RULES = {
  transactionId: {
    required: true,
    minLength: 8,
    maxLength: 20,
    pattern: /^[A-Z0-9]+$/,
    message:
      "Transaction ID must be 8-20 characters (letters and numbers only)",
  },
  senderNumber: {
    required: true,
    pattern: /^01[3-9]\d{8}$/,
    message:
      "Please enter a valid Bangladeshi mobile number (11 digits starting with 01)",
  },
  screenshot: {
    required: true,
    message: "Payment screenshot is required for verification",
  },
};

// ==========================================
// CUSTOM HOOK: Debounce
// ==========================================

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ==========================================
// MAIN COMPONENT
// ==========================================

const PaymentInstruction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Refs for preventing duplicate submissions
  const isSubmittingRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const [pendingOrder, setPendingOrder] = useState(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Form states
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // UI states
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);
  const [transactionStatus, setTransactionStatus] = useState(null); // 'valid' | 'invalid' | 'duplicate' | null

  // API queries
  const { data: paymentMethods, isLoading: methodsLoading } =
    useGetPaymentMethodsQuery();
  const [submitPayment, { isLoading: submitting }] =
    useSubmitManualPaymentMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [uploadImage, { isLoading: uploading }] =
    useUploadProductImageMutation();

  // ✅ Debounced transaction ID for checking
  const debouncedTransactionId = useDebounce(transactionId, 500);

  // ✅✅✅ RTK QUERY: Check transaction ID availability
  const {
    data: transactionCheckData,
    isFetching: isCheckingTransaction,
    error: transactionCheckError,
    isError: isTransactionCheckError,
  } = useCheckTransactionIdQuery(debouncedTransactionId, {
    // Skip query if less than 8 characters
    skip: !debouncedTransactionId || debouncedTransactionId.length < 8,
  });

  // ✅ Handle transaction check result
  useEffect(() => {
    if (transactionCheckData) {
      if (transactionCheckData.exists) {
        setTransactionStatus("duplicate");
        setErrors((prev) => ({
          ...prev,
          transactionId:
            "This Transaction ID has already been used. Please check and enter a unique ID.",
        }));
      } else {
        setTransactionStatus("valid");
        setErrors((prev) => ({ ...prev, transactionId: null }));
      }
    }
  }, [transactionCheckData]);

  // ✅ Handle transaction check error
  useEffect(() => {
    if (isTransactionCheckError && transactionCheckError) {
      console.error("Transaction check error:", transactionCheckError);
      setTransactionStatus(null);
      
      // Handle specific errors
      if (transactionCheckError.status === 'FETCH_ERROR') {
        toast.error("Network error. Cannot connect to server.");
      } else if (transactionCheckError.status === 404) {
        toast.error("API endpoint not found. Please contact support.");
      } else {
        toast.error("Failed to verify transaction ID. Please try again.");
      }
    }
  }, [isTransactionCheckError, transactionCheckError]);

  // Load pending order from localStorage
  useEffect(() => {
    const loadPendingOrder = () => {
      try {
        const savedOrder = localStorage.getItem("pendingOrderData");

        if (!savedOrder) {
          toast.error(
            "No pending order found! Please add items to cart first.",
          );
          navigate("/cart");
          return;
        }

        const parsedOrder = JSON.parse(savedOrder);

        // Validate required fields
        if (!parsedOrder.orderItems || parsedOrder.orderItems.length === 0) {
          toast.error("Your cart is empty!");
          navigate("/cart");
          return;
        }

        if (!parsedOrder.shippingAddress || !parsedOrder.shippingAddress.name) {
          toast.error("Shipping address is incomplete.");
          navigate("/shipping");
          return;
        }

        if (!parsedOrder.paymentMethod) {
          toast.error("Payment method not selected!");
          navigate("/shipping");
          return;
        }

        // Check if already submitted (prevent double submission)
        const submissionKey = `submitted_${parsedOrder.shippingAddress.phoneNumber}_${parsedOrder.totalPrice}`;
        const alreadySubmitted = sessionStorage.getItem(submissionKey);

        if (alreadySubmitted) {
          toast.info("This order is already being processed!");
          navigate("/orders");
          return;
        }

        const safeOrder = {
          ...parsedOrder,
          itemsPrice: parsedOrder.itemsPrice || "0.00",
          shippingPrice: parsedOrder.shippingPrice || "0.00",
          totalPrice: parsedOrder.totalPrice || "0.00",
          totalSavings: parsedOrder.totalSavings || "0.00",
          shippingAddress: {
            name: parsedOrder.shippingAddress.name || "",
            address: parsedOrder.shippingAddress.address || "",
            city: parsedOrder.shippingAddress.city || "",
            postalCode: parsedOrder.shippingAddress.postalCode || "",
            country: parsedOrder.shippingAddress.country || "Bangladesh",
            phoneNumber: parsedOrder.shippingAddress.phoneNumber || "",
          },
        };

        setPendingOrder(safeOrder);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading pending order:", error);
        toast.error("Failed to load order data");
        navigate("/cart");
      }
    };

    loadPendingOrder();
  }, [navigate]);

  // Validation functions
  const validateField = useCallback((name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return "";

    if (rule.required && !value) {
      return rule.message || "This field is required";
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return rule.message || `Minimum ${rule.minLength} characters required`;
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Maximum ${rule.maxLength} characters allowed`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return rule.message || "Invalid format";
    }

    return "";
  }, []);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    // Validate transaction ID
    const txError = validateField("transactionId", transactionId);
    if (txError) {
      newErrors.transactionId = txError;
      isValid = false;
    } else if (transactionStatus === "duplicate") {
      newErrors.transactionId = "This Transaction ID has already been used";
      isValid = false;
    }

    // Validate sender number
    const phoneError = validateField("senderNumber", senderNumber);
    if (phoneError) {
      newErrors.senderNumber = phoneError;
      isValid = false;
    }

    // Validate screenshot
    if (!screenshot) {
      newErrors.screenshot =
        "Please upload a payment screenshot for verification";
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      transactionId: true,
      senderNumber: true,
      screenshot: true,
    });

    return isValid;
  }, [
    transactionId,
    senderNumber,
    screenshot,
    transactionStatus,
    validateField,
  ]);

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(
      field,
      field === "transactionId" ? transactionId : senderNumber,
    );
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload a valid image file (JPEG, PNG, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      setScreenshot(res.url || res.image);
      setErrors((prev) => ({ ...prev, screenshot: null }));
      setTouched((prev) => ({ ...prev, screenshot: true }));
      toast.success("Screenshot uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload image");
      setScreenshot(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmittingRef.current || hasSubmittedRef.current) {
      toast.warning("Please wait, your submission is being processed...");
      return;
    }

    if (!validateAll()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!pendingOrder) {
      toast.error("Order data not found!");
      return;
    }

    try {
      isSubmittingRef.current = true;
      setStep(2);

      // ✅ Server-side validation: Check again if transaction ID exists
      // Note: We rely on backend validation here, but frontend state already checked
      
      // Create order first
      const orderRes = await createOrder(pendingOrder).unwrap();

      // Mark as submitted to prevent duplicates
      hasSubmittedRef.current = true;
      const submissionKey = `submitted_${pendingOrder.shippingAddress.phoneNumber}_${pendingOrder.totalPrice}`;
      sessionStorage.setItem(submissionKey, orderRes._id);

      // Submit payment details
      await submitPayment({
        orderId: orderRes._id,
        data: {
          transactionId: transactionId.trim().toUpperCase(),
          senderNumber: senderNumber.trim(),
          selectedPaymentMethod: pendingOrder.paymentMethod,
          sentAmount: pendingOrder.totalPrice,
          paymentScreenshot: screenshot || "",
        },
      }).unwrap();

      // Clear data only after successful submission
      dispatch(clearCartItems());
      localStorage.removeItem("pendingOrderData");
      localStorage.removeItem("shippingAddress");

      toast.success("Payment submitted and order created successfully! 📦");
      navigate(`/order/${orderRes._id}`);
    } catch (err) {
      setStep(1);
      isSubmittingRef.current = false;

      // Handle specific errors
      if (
        err?.data?.message?.includes("Transaction ID") ||
        err?.data?.message?.includes("already been used")
      ) {
        setTransactionStatus("duplicate");
        setErrors((prev) => ({
          ...prev,
          transactionId: "This Transaction ID has already been used!",
        }));
      }

      toast.error(
        err?.data?.message || "Failed to process payment. Please try again.",
      );
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure? Your order will not be placed.")) {
      navigate("/cart");
    }
  };

  // Get selected method
  const selectedMethod = paymentMethods?.find(
    (method) => method.type === pendingOrder?.paymentMethod,
  );

  if (methodsLoading || !isDataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!selectedMethod) {
    return (
      <div className="container mx-auto px-4 mt-[100px] text-center">
        <h2 className="text-2xl font-mono font-black text-red-600 mb-4">
          Payment Method Not Available
        </h2>
        <button
          onClick={() => navigate("/shipping")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-mono font-bold"
        >
          Go Back & Select Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen pb-20">
      <div className="container mx-auto px-4 mt-[100px] max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <FaLock className="text-blue-600 text-sm" />
            <span className="text-blue-600 font-mono text-xs font-bold uppercase">
              Secure Payment
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-mono font-black uppercase tracking-tighter mb-4">
            Pay with{" "}
            <span className="text-blue-600">{selectedMethod.type}</span>
          </h1>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm inline-block">
            <p className="text-gray-500 font-mono text-sm mb-2">
              Total Amount to Pay
            </p>
            <p className="text-4xl font-mono font-black text-red-600">
              ৳{pendingOrder?.totalPrice || "0.00"}
            </p>
          </div>
        </motion.div>

        {/* Processing Overlay */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white/95 z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-mono font-black mb-2">
                Processing Payment...
              </h3>
              <p className="text-gray-500 font-mono text-sm">
                Please do not close or refresh this window
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Instructions Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-mono font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Payment Instructions
            </h2>

            <div className="p-6 rounded-3xl border-2 border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-100">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white ${
                    selectedMethod.type === "bKash"
                      ? "bg-pink-600"
                      : selectedMethod.type === "Nagad"
                        ? "bg-orange-500"
                        : selectedMethod.type === "Rocket"
                          ? "bg-purple-600"
                          : "bg-blue-600"
                  }`}
                >
                  {selectedMethod.type[0]}
                </div>
                <div>
                  <h3 className="font-mono font-black text-2xl">
                    {selectedMethod.type}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">
                    {selectedMethod.accountType} Account
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-blue-100 mb-4">
                <p className="text-xs text-gray-400 font-mono uppercase mb-2">
                  Send Money To
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono font-black text-3xl tracking-wider">
                      {selectedMethod.number}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedMethod.accountName}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedMethod.number)}
                    className="p-4 bg-blue-600 text-white rounded-xl hover:bg-black transition-colors flex-shrink-0"
                  >
                    {copied ? (
                      <FaCheckCircle size={20} />
                    ) : (
                      <FaCopy size={20} />
                    )}
                  </button>
                </div>
              </div>

              {selectedMethod.instructions && (
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-start gap-3">
                  <FaInfoCircle className="text-yellow-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700 font-mono">
                    {selectedMethod.instructions}
                  </p>
                </div>
              )}
            </div>

            {/* Step by Step Guide */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-mono font-black text-sm uppercase mb-4 text-gray-800">
                How to pay via {selectedMethod.type}:
              </h3>
              <ol className="space-y-3 text-sm text-gray-700 font-mono list-decimal list-inside">
                <li>Open your {selectedMethod.type} app</li>
                <li>
                  Select <strong>Send Money</strong>
                </li>
                <li>
                  Enter number:{" "}
                  <strong className="text-blue-600">
                    {selectedMethod.number}
                  </strong>
                </li>
                <li>
                  Enter amount:{" "}
                  <strong className="text-red-600">
                    ৳{pendingOrder?.totalPrice || "0.00"}
                  </strong>
                </li>
                <li>
                  Complete payment & copy the <strong>Transaction ID</strong>
                </li>
              </ol>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <h2 className="text-lg font-mono font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-600 rounded-full"></span>
              Confirm Your Payment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Transaction ID Field with RTK Query Validation */}
              <div>
                <label className="block text-xs font-mono font-black uppercase text-gray-500 mb-2">
                  Transaction ID (TrxID) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      const value = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");
                      setTransactionId(value);
                      setTransactionStatus(null); // Reset status on change
                    }}
                    onBlur={() => handleBlur("transactionId")}
                    placeholder="8A9B2C3D"
                    className={`w-full p-4 bg-gray-50 border rounded-2xl font-mono uppercase tracking-wider focus:ring-2 outline-none transition-all ${
                      errors.transactionId && touched.transactionId
                        ? "border-red-300 focus:ring-red-200 bg-red-50"
                        : transactionStatus === "valid"
                          ? "border-green-300 focus:ring-green-200 bg-green-50"
                          : "border-gray-200 focus:ring-blue-500"
                    }`}
                    required
                    minLength={8}
                    maxLength={20}
                    disabled={step === 2}
                  />

                  {/* ✅ Status Indicator with RTK Query loading */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isCheckingTransaction ? (
                      <FaSpinner className="animate-spin text-blue-500" />
                    ) : transactionStatus === "valid" ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : transactionStatus === "duplicate" ? (
                      <FaTimesCircle className="text-red-500" />
                    ) : null}
                  </div>
                </div>

                {/* Validation Messages */}
                <AnimatePresence>
                  {errors.transactionId && touched.transactionId && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2 font-mono flex items-center gap-1"
                    >
                      <FaExclamationTriangle /> {errors.transactionId}
                    </motion.p>
                  )}
                </AnimatePresence>

                {transactionStatus === "valid" && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-xs mt-2 font-mono flex items-center gap-1"
                  >
                    <FaCheckCircle /> This Transaction ID is available
                  </motion.p>
                )}

                <p className="mt-1 text-[10px] text-gray-400 font-mono">
                  Found in your SMS or app history (8-20 characters)
                </p>
              </div>

              {/* Sender Number Field */}
              <div>
                <label className="block text-xs font-mono font-black uppercase text-gray-500 mb-2">
                  Your {selectedMethod.type} Number *
                </label>
                <input
                  type="tel"
                  value={senderNumber}
                  onChange={(e) =>
                    setSenderNumber(
                      e.target.value.replace(/\D/g, "").slice(0, 11),
                    )
                  }
                  onBlur={() => handleBlur("senderNumber")}
                  placeholder="01XXXXXXXXX"
                  className={`w-full p-4 bg-gray-50 border rounded-2xl font-mono focus:ring-2 outline-none transition-all ${
                    errors.senderNumber && touched.senderNumber
                      ? "border-red-300 focus:ring-red-200 bg-red-50"
                      : "border-gray-200 focus:ring-blue-500"
                  }`}
                  required
                  maxLength={11}
                  minLength={11}
                  disabled={step === 2}
                />
                <AnimatePresence>
                  {errors.senderNumber && touched.senderNumber && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2 font-mono flex items-center gap-1"
                    >
                      <FaExclamationTriangle /> {errors.senderNumber}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="mt-1 text-[10px] text-gray-400 font-mono">
                  Number you used to send money
                </p>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-xs font-mono font-black uppercase text-gray-500 mb-2">
                  Payment Screenshot *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="screenshot"
                    disabled={uploading || step === 2}
                  />
                  <label
                    htmlFor="screenshot"
                    className={`flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      uploading
                        ? "border-blue-400 bg-blue-50"
                        : screenshot
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 hover:border-blue-500 hover:bg-blue-50/30"
                    }`}
                  >
                    {uploading ? (
                      <span className="font-mono text-sm text-blue-600 flex items-center gap-2">
                        <FaSpinner className="animate-spin" /> Uploading...
                      </span>
                    ) : screenshot ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={screenshot}
                          alt="Preview"
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <span className="font-mono text-sm text-green-600 flex items-center gap-2">
                          <FaCheckCircle /> Screenshot Uploaded
                        </span>
                      </div>
                    ) : (
                      <>
                        <FaUpload className="text-gray-400" />
                        <span className="font-mono text-sm text-gray-500">
                          Upload Payment Screenshot
                        </span>
                      </>
                    )}
                  </label>
                </div>
                <AnimatePresence>
                  {errors.screenshot && touched.screenshot && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2 font-mono flex items-center gap-1"
                    >
                      <FaExclamationTriangle /> {errors.screenshot}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    uploading ||
                    creatingOrder ||
                    isCheckingTransaction ||
                    transactionStatus === "duplicate" ||
                    !screenshot
                  }
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-mono font-black uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting || creatingOrder ? (
                    <>
                      <FaSpinner className="animate-spin" /> Processing...
                    </>
                  ) : uploading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Uploading Image...
                    </>
                  ) : isCheckingTransaction ? (
                    <>
                      <FaSpinner className="animate-spin" /> Checking...
                    </>
                  ) : transactionStatus === "duplicate" ? (
                    <>
                      <FaTimesCircle /> Duplicate Transaction ID
                    </>
                  ) : !screenshot ? (
                    <>
                      <FaUpload /> Upload Screenshot Required
                    </>
                  ) : (
                    <>
                      <FaLock /> Pay ৳{pendingOrder?.totalPrice || "0.00"} &
                      Place Order
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={step === 2}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-mono font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaArrowLeft /> Back to Cart
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstruction;