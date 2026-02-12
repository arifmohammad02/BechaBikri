/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
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
import {
  FaTrash,
  FaCloudUploadAlt,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaPlus,
} from "react-icons/fa";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
window.Quill = Quill;
Quill.register("modules/imageResize", ImageResize);

const ProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);

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

  // --- Key Features & Specifications
  const [keyFeatures, setKeyFeatures] = useState([""]);
  const [specifications, setSpecifications] = useState([
    { label: "", value: "" },
  ]);

  // --- SHIPPING STATES (নতুন আপডেট) ---
  const [weight, setWeight] = useState(0);
  const [shippingType, setShippingType] = useState("weight-based");
  const [insideDhakaCharge, setInsideDhakaCharge] = useState(80);
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(150);
  const [fixedShippingCharge, setFixedShippingCharge] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [isFreeShippingActive, setIsFreeShippingActive] = useState(false);

  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // --- Image Handler for ReactQuill ---
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        toast.info("Uploading image to description...");
        const res = await uploadProductImage(formData).unwrap();
        const url = res.images[0];
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", url);
      } catch (error) {
        toast.error("Image upload failed");
      }
    };
  };

const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike", "blockquote"], 
          
        
          [{ color: [] }, { background: [] }], 
          [{ align: [] }], 
          [{ script: "sub" }, { script: "super" }], 
          // -----------------------

          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }], 
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      imageResize: {
        parrentElement: 'section',
        modules: ['Resize', 'DisplaySize', 'Toolbar'] 
      },
    }),
    [],
  );

  const formats = [
    "header", "size",
    "bold", "italic", "underline", "strike", "blockquote",
    "color", "background", "align", "script",
    "list", "bullet", "indent",
    "link", "image", "video",
  ];


  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id || productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImages(productData.images || []);
      setDiscountPercentage(productData.discountPercentage);
      setIsFeatured(productData.isFeatured);
      setOffer(productData.offer);
      setWarranty(productData.warranty);
      setDiscountedAmount(productData.discountedAmount);
      setStock(productData.countInStock);

      // Load Features & Specs
      if (productData.keyFeatures) setKeyFeatures(productData.keyFeatures);
      if (productData.specifications)
        setSpecifications(productData.specifications);
      setWeight(productData.weight || productData.shippingDetails?.weight || 0);
      // Shipping Data Load
      if (productData.shippingDetails) {
        const s = productData.shippingDetails;
        setShippingType(s.shippingType);
        setInsideDhakaCharge(s.insideDhakaCharge);
        setOutsideDhakaCharge(s.outsideDhakaCharge);
        setFixedShippingCharge(s.fixedShippingCharge);
        setFreeShippingThreshold(s.freeShippingThreshold);
        setIsFreeShippingActive(!!s.isFreeShippingActive);
      }
    }
  }, [productData]);

  // --- Specifications Logic ---
  const addSpec = () =>
    setSpecifications([...specifications, { label: "", value: "" }]);
  const removeSpec = (index) =>
    setSpecifications(specifications.filter((_, i) => i !== index));
  const handleSpecChange = (index, field, val) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = val;
    setSpecifications(newSpecs);
  };

  const addFeature = () => setKeyFeatures([...keyFeatures, ""]);
  const removeFeature = (index) =>
    setKeyFeatures(keyFeatures.filter((_, i) => i !== index));
  const handleFeatureChange = (index, val) => {
    const newFeatures = [...keyFeatures];
    newFeatures[index] = val;
    setKeyFeatures(newFeatures);
  };

  const moveImage = (index, direction) => {
    const updatedImages = [...images];
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [updatedImages[index], updatedImages[newIndex]] = [
      updatedImages[newIndex],
      updatedImages[index],
    ];
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

      formData.append(
        "keyFeatures",
        JSON.stringify(keyFeatures.filter((f) => f.trim() !== "")),
      );
      formData.append(
        "specifications",
        JSON.stringify(specifications.filter((s) => s.label.trim() !== "")),
      );

      // --- ব্যাকএন্ডের রিকোয়ারমেন্ট অনুযায়ী সরাসরি অ্যাপেন্ড করা ---
      formData.append("weight", Number(weight));
      formData.append("shippingType", shippingType);
      formData.append("insideDhakaCharge", Number(insideDhakaCharge));
      formData.append("outsideDhakaCharge", Number(outsideDhakaCharge));
      formData.append("fixedShippingCharge", Number(fixedShippingCharge));
      formData.append("freeShippingThreshold", Number(freeShippingThreshold));
      formData.append("isFreeShippingActive", isFreeShippingActive);

      
      const shippingDetails = {
        weight,
        shippingType,
        insideDhakaCharge,
        outsideDhakaCharge,
        fixedShippingCharge,
        freeShippingThreshold,
        isFreeShippingActive,
      };
      formData.append("shippingDetails", JSON.stringify(shippingDetails));

      const data = await updateProduct({
        productId: params._id,
        formData,
      }).unwrap();
      if (data?.error) toast.error(data.error);
      else {
        toast.success(`DATA_UPDATED_SUCCESSFULLY`);
        refetch();
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      const errorMessage = err?.data?.error || "UPDATE_FAILED";
      toast.error(errorMessage);
      console.error("Submit Error:", err);
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
            <div className="mb-10 border-l-4 border-red-600 pl-6 py-2">
              <h1 className="text-3xl font-black text-black tracking-tighter uppercase">
                Product /{" "}
                <span className="text-red-600">Edit_Update_Delete</span>
              </h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.4em] uppercase mt-1">
                Security Level: Admin | ID: {params._id}
              </p>
            </div>
            <div className="bg-white border border-gray-100 shadow-2xl p-6 lg:p-10 relative">
              {/* Image Matrix */}
              <div className="mb-10">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Visual_Assets
                </p>
                <div className="flex flex-wrap gap-4 p-4 bg-gray-50 border border-dashed border-gray-200 min-h-[150px] items-center justify-center">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative group border-2 border-white shadow-lg overflow-hidden w-28 h-28 bg-white transition-transform duration-300 hover:scale-105"
                    >
                      <img
                        src={img}
                        alt="product"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => moveImage(index, "left")}
                            disabled={index === 0}
                            className="text-white hover:text-red-500 disabled:opacity-30"
                          >
                            <FaArrowLeft size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(index, "right")}
                            disabled={index === images.length - 1}
                            className="text-white hover:text-red-500 disabled:opacity-30"
                          >
                            <FaArrowRight size={14} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
                          }
                          className="text-red-500 hover:scale-125 transition-transform"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <label className="w-28 h-28 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-50 transition-all text-gray-400 hover:text-red-600 group">
                    <FaCloudUploadAlt
                      size={24}
                      className="group-hover:bounce"
                    />
                    <span className="text-[8px] font-black uppercase mt-2 tracking-tighter text-center px-1">
                      Add_New_Images
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadLoading && (
                  <div className="h-1 bg-red-600 animate-pulse mt-2" />
                )}
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                {[
                  {
                    label: "PRODUCT_NAME",
                    val: name,
                    set: setName,
                    type: "text",
                  },
                  {
                    label: "UNIT_PRICE",
                    val: price,
                    set: setPrice,
                    type: "number",
                  },
                  {
                    label: "QTY_AVAIL",
                    val: quantity,
                    set: setQuantity,
                    type: "number",
                  },
                  {
                    label: "BRAND_NAME",
                    val: brand,
                    set: setBrand,
                    type: "text",
                  },
                  {
                    label: "STOCK_COUNT",
                    val: stock,
                    set: setStock,
                    type: "number",
                  },
                  {
                    label: "OFFER_TEXT",
                    val: offer,
                    set: setOffer,
                    type: "text",
                  },
                  {
                    label: "WARRANTY_INFO",
                    val: warranty,
                    set: setWarranty,
                    type: "text",
                  },
                  {
                    label: "DISCOUNT_%",
                    val: discountPercentage,
                    set: setDiscountPercentage,
                    type: "number",
                  },
                  {
                    label: "DISCOUNT_AMT",
                    val: discountedAmount,
                    set: setDiscountedAmount,
                    type: "number",
                  },
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
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                    CATEGORY_REF
                  </label>
                  <select
                    className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all cursor-pointer"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                  >
                    <option value="">SELECT_CATEGORY</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase">
                    FEATURE_STATUS
                  </label>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 accent-red-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* --- Key Features  --- */}
              <div className="mb-10">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Key_Features
                </p>
                {keyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                      placeholder="Feature Description"
                      className="flex-1 bg-gray-50 border-b border-gray-200 py-2 px-3 focus:outline-none focus:border-red-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500 p-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="mt-2 text-[10px] font-black uppercase text-red-600 flex items-center gap-1"
                >
                  <FaPlus size={10} /> Add_Feature
                </button>
              </div>
              {/* --- Specifications  --- */}
              <div className="mb-10">
                <p className="text-[12px] font-black uppercase tracking-widest text-gray-400 mb-4">
                  Technical_Specifications
                </p>
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4 mb-2 items-center">
                    <input
                      type="text"
                      placeholder="Label (e.g. RAM)"
                      value={spec.label}
                      onChange={(e) =>
                        handleSpecChange(index, "label", e.target.value)
                      }
                      className="w-1/3 bg-gray-50 border-b border-gray-200 py-2 px-3 focus:outline-none focus:border-red-600"
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g. 16GB)"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecChange(index, "value", e.target.value)
                      }
                      className="flex-1 bg-gray-50 border-b border-gray-200 py-2 px-3 focus:outline-none focus:border-red-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="text-red-500 p-2"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpec}
                  className="mt-2 text-[10px] font-black uppercase text-red-600 flex items-center gap-1"
                >
                  <FaPlus size={10} /> Add_Spec
                </button>
              </div>

              {/* --- SHIPPING CONFIGURATION SECTION (নতুন) --- */}
              <div className="mb-12 border-t border-gray-100 pt-10">
                <p className="text-[12px] font-black uppercase tracking-widest text-red-600 mb-8 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-red-600"></span>{" "}
                  Shipping_Configuration
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                  <div className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                      Shipping_Logic_Type
                    </label>
                    <select
                      className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all cursor-pointer appearance-none"
                      onChange={(e) => setShippingType(e.target.value)}
                      value={shippingType}
                    >
                      <option value="weight-based">WEIGHT_BASED</option>
                      <option value="fixed">FIXED_RATE</option>
                      <option value="free">ALWAYS_FREE</option>
                    </select>
                  </div>

                  <div className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                      Item_Weight_(KG)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm flex items-center justify-between group hover:border-red-200 transition-all">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 tracking-widest uppercase block mb-1">
                        Free_Shipping_Logic
                      </label>
                      <span className="text-[12px] font-bold text-black uppercase">
                        Enable Threshold?
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isFreeShippingActive}
                      onChange={(e) =>
                        setIsFreeShippingActive(e.target.checked)
                      }
                      className="w-6 h-6 accent-red-600 cursor-pointer"
                    />
                  </div>

                  <div
                    className={`group relative transition-all duration-500 ${!isFreeShippingActive ? "opacity-30" : "opacity-100"}`}
                  >
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                      Free_Shipping_Threshold
                    </label>
                    <input
                      type="number"
                      value={freeShippingThreshold}
                      disabled={!isFreeShippingActive}
                      onChange={(e) => setFreeShippingThreshold(e.target.value)}
                      className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                      Inside_Dhaka_Charge
                    </label>
                    <input
                      type="number"
                      value={insideDhakaCharge}
                      onChange={(e) => setInsideDhakaCharge(e.target.value)}
                      className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                      Outside_Dhaka_Charge
                    </label>
                    <input
                      type="number"
                      value={outsideDhakaCharge}
                      onChange={(e) => setOutsideDhakaCharge(e.target.value)}
                      className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                    />
                  </div>

                  <div className="group relative">
                    <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                      Fixed_Shipping_Charge
                    </label>
                    <input
                      type="number"
                      value={fixedShippingCharge}
                      disabled={shippingType !== "fixed"}
                      onChange={(e) => setFixedShippingCharge(e.target.value)}
                      className={`w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all ${shippingType !== "fixed" ? "opacity-30" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {/* Description Editor */}
              <div className="mb-12">
                <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4 block">
                  Product_Specs_Description
                </label>
                <div className="border border-gray-100 hover:border-red-600 transition-colors">
                  <ReactQuill
                  ref={quillRef}
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    modules={modules}
                    formats={formats}
                    className="min-h-[400px] font-mono text-sm quill-editor-custom"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-10">
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-10 py-4 bg-white border-2 border-black text-black font-black uppercase tracking-[0.2em] text-[12px] hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {deleteLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash size={14} />
                  )}{" "}
                  {deleteLoading ? "Purging..." : "Delete_System_Record"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={updateLoading}
                  className="px-10 py-4 bg-black text-white font-black uppercase tracking-[0.2em] text-[12px] hover:bg-red-600 shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {updateLoading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave size={14} />
                  )}{" "}
                  {updateLoading ? "Syncing..." : "Push_Updates"}
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
