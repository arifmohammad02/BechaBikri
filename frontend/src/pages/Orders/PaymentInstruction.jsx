/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { 
  useGetPaymentMethodsQuery,
  useSubmitManualPaymentMutation,
} from "../../redux/api/paymentApiSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { useUploadProductImageMutation } from "../../redux/api/productApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import Loader from "../../components/Loader";
import { FaCopy, FaCheckCircle, FaUpload, FaArrowLeft, FaInfoCircle, FaLock } from "react-icons/fa";

const PaymentInstruction = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [pendingOrder, setPendingOrder] = useState(null);
  
  const { data: paymentMethods, isLoading: methodsLoading } = useGetPaymentMethodsQuery();
  const [submitPayment, { isLoading: submitting }] = useSubmitManualPaymentMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadProductImageMutation();

  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const savedOrder = localStorage.getItem("pendingOrderData");
    if (!savedOrder) {
      toast.error("No pending order found!");
      navigate("/cart");
      return;
    }
    setPendingOrder(JSON.parse(savedOrder));
  }, [navigate]);

  // 🆕 শুধু সিলেক্টেড মেথড ফিল্টার করুন
  const selectedMethod = paymentMethods?.find(
    (method) => method.type === pendingOrder?.paymentMethod
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadImage(formData).unwrap();
      setScreenshot(res.url || res.image);
      toast.success("Screenshot uploaded!");
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!transactionId || transactionId.length < 8) {
      toast.error("Please enter a valid Transaction ID");
      return;
    }
    
    if (!senderNumber || senderNumber.length < 11) {
      toast.error("Please enter a valid sender number");
      return;
    }

    if (!pendingOrder) {
      toast.error("Order data not found!");
      return;
    }

    try {
      setStep(2);

      const orderRes = await createOrder(pendingOrder).unwrap();
      
      await submitPayment({
        orderId: orderRes._id,
        data: {
          transactionId: transactionId.trim().toUpperCase(),
          senderNumber: senderNumber.trim(),
          selectedPaymentMethod: pendingOrder.paymentMethod, // সিলেক্টেড মেথড পাঠান
          sentAmount: pendingOrder.totalPrice,
          paymentScreenshot: screenshot || "",
        },
      }).unwrap();

      dispatch(clearCartItems());
      localStorage.removeItem("pendingOrderData");
      
      toast.success("Payment submitted and order created successfully! 📦");
      navigate(`/order/${orderRes._id}`);
      
    } catch (err) {
      setStep(1);
      toast.error(err?.data?.message || "Failed to process payment. Please try again.");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure? Your cart items will remain saved.")) {
      navigate("/cart");
    }
  };

  if (methodsLoading || !pendingOrder) return <Loader />;

  // 🆕 যদি সিলেক্টেড মেথড না পাওয়া যায়
  if (!selectedMethod) {
    return (
      <div className="container mx-auto px-4 mt-[100px] text-center">
        <h2 className="text-2xl font-mono font-black text-red-600 mb-4">
          Payment Method Not Available
        </h2>
        <p className="text-gray-500 mb-4">Selected method: {pendingOrder?.paymentMethod}</p>
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
        
        {/* হেডার */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full mb-4">
            <FaLock className="text-blue-600 text-sm" />
            <span className="text-blue-600 font-mono text-xs font-bold uppercase">Secure Payment</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-mono font-black uppercase tracking-tighter mb-4">
            Pay with <span className="text-blue-600">{selectedMethod.type}</span>
          </h1>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm inline-block">
            <p className="text-gray-500 font-mono text-sm mb-2">Total Amount to Pay</p>
            <p className="text-4xl font-mono font-black text-red-600">
              ৳{pendingOrder?.totalPrice}
            </p>
            <p className="text-xs text-gray-400 font-mono mt-2">
              Pay exactly this amount to {selectedMethod.type} number below
            </p>
          </div>
        </motion.div>

        {/* লোডিং স্টেপ */}
        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-mono font-black mb-2">Processing Payment...</h3>
              <p className="text-gray-500 font-mono text-sm">Please do not close this window</p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 🆕 শুধু সিলেক্টেড মেথডের ডিটেইলস */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="space-y-4"
          >
            <h2 className="text-lg font-mono font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              Payment Instructions
            </h2>

            <div className={`p-6 rounded-3xl border-2 border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-100`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white ${
                  selectedMethod.type === 'bKash' ? 'bg-pink-600' :
                  selectedMethod.type === 'Nagad' ? 'bg-orange-500' :
                  selectedMethod.type === 'Rocket' ? 'bg-purple-600' :
                  'bg-blue-600'
                }`}>
                  {selectedMethod.type[0]}
                </div>
                <div>
                  <h3 className="font-mono font-black text-2xl">{selectedMethod.type}</h3>
                  <p className="text-sm text-gray-500 font-mono">{selectedMethod.accountType} Account</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-blue-100 mb-4">
                <p className="text-xs text-gray-400 font-mono uppercase mb-2">Send Money To</p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono font-black text-3xl tracking-wider">{selectedMethod.number}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedMethod.accountName}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(selectedMethod.number)}
                    className="p-4 bg-blue-600 text-white rounded-xl hover:bg-black transition-colors flex-shrink-0"
                  >
                    {copied ? <FaCheckCircle size={20} /> : <FaCopy size={20} />}
                  </button>
                </div>
              </div>

              {selectedMethod.instructions && (
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-start gap-3">
                  <FaInfoCircle className="text-yellow-600 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-700 font-mono">{selectedMethod.instructions}</p>
                </div>
              )}
            </div>

            {/* স্টেপ বাই স্টেপ গাইড */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="font-mono font-black text-sm uppercase mb-4 text-gray-800">
                How to pay via {selectedMethod.type}:
              </h3>
              <ol className="space-y-3 text-sm text-gray-700 font-mono list-decimal list-inside">
                <li>Open your {selectedMethod.type} app</li>
                <li>Select <strong>Send Money</strong></li>
                <li>Enter number: <strong className="text-blue-600">{selectedMethod.number}</strong></li>
                <li>Enter amount: <strong className="text-red-600">৳{pendingOrder?.totalPrice}</strong></li>
                <li>Complete payment & copy the <strong>Transaction ID</strong></li>
              </ol>
            </div>
          </motion.div>

          {/* পেমেন্ট ডিটেইলস ফর্ম */}
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
              <div>
                <label className="block text-xs font-mono font-black uppercase text-gray-500 mb-2">
                  Your {selectedMethod.type} Number *
                </label>
                <input
                  type="tel"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="01XXXXXXXXX"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  maxLength={11}
                  minLength={11}
                />
                <p className="mt-1 text-[10px] text-gray-400 font-mono">Number you used to send money</p>
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-gray-500 mb-2">
                  Transaction ID (TrxID) *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="8A9B2C3D"
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono uppercase tracking-wider focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                  minLength={8}
                  maxLength={20}
                />
                <p className="mt-1 text-[10px] text-gray-400 font-mono">Found in your SMS or app history</p>
              </div>

              <div>
                <label className="block text-xs font-mono font-black uppercase text-gray-500 mb-2">
                  Screenshot (Optional but Recommended)
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    id="screenshot" 
                    disabled={uploading}
                  />
                  <label 
                    htmlFor="screenshot" 
                    className={`flex items-center justify-center gap-3 w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      uploading ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30'
                    }`}
                  >
                    {uploading ? (
                      <span className="font-mono text-sm text-blue-600">Uploading...</span>
                    ) : screenshot ? (
                      <div className="flex items-center gap-3">
                        <img src={screenshot} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                        <span className="font-mono text-sm text-green-600 flex items-center gap-2">
                          <FaCheckCircle /> Uploaded
                        </span>
                      </div>
                    ) : (
                      <>
                        <FaUpload className="text-gray-400" />
                        <span className="font-mono text-sm text-gray-500">Upload Payment Screenshot</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={submitting || uploading || creatingOrder}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-mono font-black uppercase tracking-widest hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(submitting || creatingOrder) ? (
                    <>
                      <span className="animate-spin">⏳</span> Creating Order...
                    </>
                  ) : (
                    <>
                      <FaLock /> Pay ৳{pendingOrder?.totalPrice} & Place Order
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-2xl font-mono font-bold text-sm hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
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