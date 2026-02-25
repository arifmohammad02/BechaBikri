/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import AdminMenu from "./AdminMenu";
import {
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} from "../../redux/api/paymentApiSlice";
import Loader from "../../components/Loader";
import { FaSave, FaTrash, FaPlus, FaEdit } from "react-icons/fa";

const PaymentSettings = () => {
  const { data: methods, isLoading, refetch } = useGetPaymentMethodsQuery();
  const [updateMethod] = useUpdatePaymentMethodMutation();
  const [deleteMethod] = useDeletePaymentMethodMutation();

  const [editingMethod, setEditingMethod] = useState(null);
  const [formData, setFormData] = useState({
    type: "bKash",
    number: "",
    accountType: "Personal",
    accountName: "",
    instructions: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateMethod(formData).unwrap();
      toast.success("Updated successfully");
      setEditingMethod(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed");
    }
  };

  const handleDelete = async (type) => {
    if (window.confirm("Deactivate this method?")) {
      try {
        await deleteMethod(type).unwrap();
        toast.success("Deactivated");
        refetch();
      } catch (err) {
        toast.error("Failed");
      }
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="bg-[#FDFDFD] min-h-screen">
      <div className="container mx-auto px-4 mt-[100px] pb-20">
        <div className="flex flex-col xl:flex-row gap-8">
          <AdminMenu />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-mono font-black uppercase tracking-tighter">
                Payment <span className="text-blue-600">Methods</span>
              </h1>
              <button
                onClick={() => {
                  setEditingMethod("new");
                  setFormData({ type: "bKash", number: "", accountType: "Personal", accountName: "", instructions: "" });
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-mono font-bold text-sm hover:bg-black transition-all"
              >
                <FaPlus /> Add
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {methods?.map((method) => (
                <motion.div key={method.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-mono font-black">{method.type}</h3>
                      <p className="text-sm text-gray-500 font-mono mt-1">{method.accountName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingMethod(method.type); setFormData(method); }} className="p-2 bg-gray-100 rounded-xl hover:bg-blue-100 text-blue-600">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(method.type)} className="p-2 bg-gray-100 rounded-xl hover:bg-red-100 text-red-600">
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="font-mono font-bold text-2xl tracking-wider">{method.number}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase">{method.accountType}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {editingMethod && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg">
                <h2 className="text-xl font-mono font-black uppercase mb-6">
                  {editingMethod === "new" ? "Add New" : "Edit"} Method
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono outline-none"
                    >
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Bank">Bank</option>
                    </select>
                    <select
                      value={formData.accountType}
                      onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono outline-none"
                    >
                      <option value="Personal">Personal</option>
                      <option value="Agent">Agent</option>
                      <option value="Merchant">Merchant</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Account Number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Account Name"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono outline-none"
                    required
                  />
                  <textarea
                    placeholder="Instructions (Optional)"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-mono h-24 resize-none"
                  />
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-mono font-black uppercase flex items-center justify-center gap-2">
                      <FaSave /> Save
                    </button>
                    <button type="button" onClick={() => setEditingMethod(null)} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-mono font-bold">
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSettings;