/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FaSpinner, FaCloudUploadAlt, FaPlus, FaTrash, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css";

const ProductList = () => {
  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [offer, setOffer] = useState("");
  const [warranty, setWarranty] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = ["header", "bold", "italic", "underline", "list", "bullet", "link", "image"];

  const moveImage = (index, direction) => {
    const updatedImages = [...images];
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("At least one image is required.");
    if (!name.trim()) return toast.error("Name is required.");
    if (!price || price <= 0) return toast.error("Valid price is required.");
    if (!quantity || quantity < 0) return toast.error("Valid quantity is required.");
    if (!brand.trim()) return toast.error("Brand is required.");
    if (!description.trim() || description === "<p><br></p>") return toast.error("Description is required.");
    if (!category) return toast.error("Category is required.");

    try {
      setLoading(true);
      const productData = new FormData();
      productData.append("images", JSON.stringify(images));
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("discountPercentage", discountPercentage);
      productData.append("isFeatured", isFeatured);
      productData.append("offer", offer);
      productData.append("warranty", warranty);
      productData.append("discountedAmount", discountedAmount);

      const res = await createProduct(productData).unwrap();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${res.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      toast.error(error?.data?.error || "Product creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("image", files[i]);

    setLoading(true);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImages((prevImages) => [...prevImages, ...res.images]);
      toast.success(res.message || "Images Sync Complete");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-mono pt-24 lg:pt-32 transition-all duration-500">
      <div className="flex flex-col 2xl:flex-row">
        {/* Admin Menu preserves original placement logic */}
        <AdminMenu />

        <div className="flex-1 px-4 lg:px-12 pb-20">
          <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <div className="mb-10 border-l-4 border-red-600 pl-6 py-2">
              <h1 className="text-3xl font-black text-black tracking-tighter uppercase">
                Create <span className="text-red-600">New Product</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">
                AriX GeaR Management System | Node_Active
              </p>
            </div>

            <div className="bg-white border border-gray-100 shadow-2xl p-6 lg:p-10 relative overflow-hidden">
              
              {/* Modern Image Matrix Preview */}
              <div className="mb-10">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-4">Gallery_Assets</p>
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border border-dashed border-gray-200 min-h-[160px] items-center justify-center rounded-sm">
                  {images.map((img, index) => (
                    <div key={index} className="relative group border-2 border-white shadow-md overflow-hidden w-32 h-32 bg-white transition-all duration-300 hover:scale-105">
                      <img src={img} alt="product" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-3">
                          <button type="button" onClick={() => moveImage(index, "left")} disabled={index === 0} className="text-white hover:text-red-500 disabled:opacity-30 transition-colors"><FaArrowLeft size={14}/></button>
                          <button type="button" onClick={() => moveImage(index, "right")} disabled={index === images.length - 1} className="text-white hover:text-red-500 disabled:opacity-30 transition-colors"><FaArrowRight size={14}/></button>
                        </div>
                        <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} className="text-red-500 hover:scale-125 transition-transform"><FaTrash size={18}/></button>
                      </div>
                      <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[8px] px-1 italic">POS_{index + 1}</div>
                    </div>
                  ))}
                  
                  <label className="w-32 h-32 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-50 transition-all text-gray-400 hover:text-red-600 group rounded-sm">
                    {loading ? <FaSpinner className="animate-spin" size={24} /> : <FaCloudUploadAlt size={24} className="group-hover:translate-y-[-4px] transition-transform" />}
                    <span className="text-[8px] font-black uppercase mt-2 tracking-tighter text-center">Batch_Upload</span>
                    <input type="file" accept="image/*" multiple onChange={uploadFileHandler} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-12">
                {[
                  { label: "Product_Identifier", val: name, set: setName, type: "text", placeholder: "E.g. Mech-Keyboard X1" },
                  { label: "Price_Unit_(USD)", val: price, set: setPrice, type: "number", placeholder: "0.00" },
                  { label: "Total_Quantity", val: quantity, set: setQuantity, type: "number", placeholder: "100" },
                  { label: "Brand_Mark", val: brand, set: setBrand, type: "text", placeholder: "AriX GeaR" },
                  { label: "Initial_Stock", val: stock, set: setStock, type: "number", placeholder: "0" },
                  { label: "Active_Offer", val: offer, set: setOffer, type: "text", placeholder: "Seasonal Sale" },
                  { label: "Warranty_Period", val: warranty, set: setWarranty, type: "text", placeholder: "24 Months" },
                  { label: "Discount_Ratio_%", val: discountPercentage, set: setDiscountPercentage, type: "number", placeholder: "0" },
                  { label: "Markdown_Amount", val: discountedAmount, set: setDiscountedAmount, type: "number", placeholder: "0" },
                ].map((field, idx) => (
                  <div key={idx} className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block group-focus-within:text-red-600 transition-colors">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.val}
                      placeholder={field.placeholder}
                      onChange={(e) => field.set(e.target.value)}
                      className="w-full bg-transparent border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all duration-300 placeholder:font-normal placeholder:text-gray-300"
                    />
                  </div>
                ))}

                <div className="group relative">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">Classification</label>
                  <select
                    className="w-full bg-transparent border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all cursor-pointer appearance-none"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">SELECT_CATEGORY</option>
                    {categories?.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase italic">Mark_As_Featured</label>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-red-600 cursor-pointer shadow-sm"
                  />
                </div>
              </div>

              {/* Rich Text Editor Section */}
              <div className="mb-12">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4 block">Product_Specifications_Data</label>
                <div className="border border-gray-100 hover:border-red-600 transition-all duration-500 rounded-sm overflow-hidden bg-white">
                  <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    formats={formats}
                    placeholder="Describe the power of this gear..."
                    className="min-h-[250px] font-mono"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="flex justify-end border-t border-gray-100 pt-10">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`
                    group relative px-12 py-4 bg-black text-white font-black uppercase tracking-[0.3em] text-[13px] 
                    overflow-hidden transition-all duration-500 active:scale-95
                    ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-red-600 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)]"}
                  `}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                    {loading ? "Processing_Data..." : "Deploy_Product"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;