/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { FaTrash, FaCloudUploadAlt, FaSave, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import CustomReactQuill from "../../components/CustomReactQuill";

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: productData, refetch } = useGetProductByIdQuery(params._id);
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [offer, setOffer] = useState("");
  const [warranty, setWarranty] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(0);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

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

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImages(productData.images || []);
      setDiscountPercentage(productData.discountPercentage);
      setIsFeatured(productData.isFeatured);
      setOffer(productData.offer);
      setWarranty(productData.warranty);
      setDiscountedAmount(productData.discountedAmount);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const moveImage = (index, direction) => {
    const updatedImages = [...images];
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
    setImages(updatedImages);
  };

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append("image", files[i]);

    setUploadLoading(true);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImages((prev) => [...prev, ...res.images]);
      toast.success("Images Sync Complete");
    } catch (err) {
      toast.error("Upload Error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append("images", JSON.stringify(images));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);
      formData.append("discountPercentage", discountPercentage);
      formData.append("isFeatured", isFeatured);
      formData.append("offer", offer);
      formData.append("warranty", warranty);
      formData.append("discountedAmount", discountedAmount);

      const data = await updateProduct({ productId: params._id, formData }).unwrap();
      if (data?.error) toast.error(data.error);
      else {
        toast.success(`DATA_UPDATED_SUCCESSFULLY`);
        refetch();
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("UPDATE_FAILED");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("FATAL_ERROR: Permanent Deletion?")) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(params._id).unwrap();
      toast.success("RECORD_DELETED");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("DELETE_FAILED");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-mono pt-24 lg:pt-32 transition-all duration-500">
      <div className="flex flex-col 2xl:flex-row">
        <AdminMenu />

        <div className="flex-1 px-4 lg:px-12 pb-20">
          <div className="max-w-[1400px] mx-auto">
            {/* Page Header */}
            <div className="mb-10 border-l-4 border-red-600 pl-6 py-2">
              <h1 className="text-3xl font-black text-black tracking-tighter uppercase italic">
                Product / <span className="text-red-600">Edit_Core</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">
                Security Level: Admin | ID: {params._id}
              </p>
            </div>

            <div className="bg-white border border-gray-100 shadow-2xl p-6 lg:p-10 relative">
              {/* Image Matrix */}
              <div className="mb-10">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-4">Visual_Assets</p>
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border border-dashed border-gray-200 min-h-[150px] items-center justify-center">
                  {images.map((img, index) => (
                    <div key={index} className="relative group border-2 border-white shadow-lg overflow-hidden w-28 h-28 bg-white transition-transform duration-300 hover:scale-105">
                      <img src={img} alt="product" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => moveImage(index, "left")} disabled={index === 0} className="text-white hover:text-red-500 disabled:opacity-30"><FaArrowLeft size={14}/></button>
                          <button type="button" onClick={() => moveImage(index, "right")} disabled={index === images.length - 1} className="text-white hover:text-red-500 disabled:opacity-30"><FaArrowRight size={14}/></button>
                        </div>
                        <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} className="text-red-500 hover:scale-125 transition-transform"><FaTrash size={16}/></button>
                      </div>
                    </div>
                  ))}
                  <label className="w-28 h-28 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-50 transition-all text-gray-400 hover:text-red-600 group">
                    <FaCloudUploadAlt size={24} className="group-hover:bounce" />
                    <span className="text-[8px] font-black uppercase mt-2 tracking-tighter text-center px-1">Add_New_Images</span>
                    <input type="file" accept="image/*" multiple onChange={uploadFileHandler} className="hidden" />
                  </label>
                </div>
                {uploadLoading && <div className="h-1 bg-red-600 animate-pulse mt-2" />}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {[
                  { label: "PRODUCT_NAME", val: name, set: setName, type: "text" },
                  { label: "UNIT_PRICE", val: price, set: setPrice, type: "number" },
                  { label: "QTY_AVAIL", val: quantity, set: setQuantity, type: "number" },
                  { label: "BRAND_NAME", val: brand, set: setBrand, type: "text" },
                  { label: "STOCK_COUNT", val: stock, set: setStock, type: "number" },
                  { label: "OFFER_TEXT", val: offer, set: setOffer, type: "text" },
                  { label: "WARRANTY_INFO", val: warranty, set: setWarranty, type: "text" },
                  { label: "DISCOUNT_%", val: discountPercentage, set: setDiscountPercentage, type: "number" },
                  { label: "DISCOUNT_AMT", val: discountedAmount, set: setDiscountedAmount, type: "number" },
                ].map((field, idx) => (
                  <div key={idx} className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block transition-colors group-focus-within:text-red-600">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={field.val}
                      onChange={(e) => field.set(e.target.value)}
                      className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all duration-300"
                    />
                  </div>
                ))}

                <div className="group relative">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">CATEGORY_REF</label>
                  <select
                    className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all cursor-pointer"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">SELECT_CATEGORY</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">FEATURE_STATUS</label>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-red-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Description Editor */}
              <div className="mb-12">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4 block">Product_Specs_Description</label>
                <div className="border border-gray-100 hover:border-red-600 transition-colors">
                  <CustomReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    formats={formats}
                    className="min-h-[250px] font-mono text-sm"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-10">
                <button
                  onClick={handleDelete}
                  className="px-10 py-4 bg-white border-2 border-black text-black font-black uppercase tracking-[0.2em] text-[12px] hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <FaTrash size={14} /> {deleteLoading ? "Purging..." : "Delete_System_Record"}
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-[12px] hover:bg-red-600 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <FaSave size={14} /> {updateLoading ? "Syncing..." : "Push_Updates"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;