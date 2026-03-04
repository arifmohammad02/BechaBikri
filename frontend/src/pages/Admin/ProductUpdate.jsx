/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef, useMemo } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import { TreeSelect } from "antd";
import {
  FaTrash,
  FaCloudUploadAlt,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
  FaSpinner,
  FaPlus,
  FaPalette,
  FaRuler,
  FaBolt,
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

  // --- SHIPPING STATES ---
  const [weight, setWeight] = useState(0);
  const [shippingType, setShippingType] = useState("weight-based");
  const [insideDhakaCharge, setInsideDhakaCharge] = useState(80);
  const [outsideDhakaCharge, setOutsideDhakaCharge] = useState(150);
  const [fixedShippingCharge, setFixedShippingCharge] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [isFreeShippingActive, setIsFreeShippingActive] = useState(false);

  // --- VARIANT STATES ---
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState([]);
  const [activeVariantTab, setActiveVariantTab] = useState("basic");

  // 🆕 FLASH SALE STATES - NEW ADDITION

  const [flashSale, setFlashSale] = useState({
    isActive: false,
    discountPercentage: 0,
    startTime: "",
    endTime: "",
  });

  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Category Tree
  const organizedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    const buildTree = (parentId = null, parentPath = "") => {
      return categories
        .filter((c) => {
          const currentParentId =
            c.parent && typeof c.parent === "object" ? c.parent._id : c.parent;

          return parentId === null
            ? !currentParentId || currentParentId === null
            : String(currentParentId) === String(parentId);
        })
        .map((category) => {
          const currentPath = parentPath
            ? `${parentPath} > ${category.name}`
            : category.name;

          return {
            title: category.name,
            label: currentPath,
            value: category._id,
            key: category._id,
            children: buildTree(category._id, currentPath),
          };
        });
    };

    return buildTree();
  }, [categories]);

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
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      imageResize: {
        parrentElement: "section",
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "align",
    "script",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
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

      // Load Variants
      if (productData.hasVariants !== undefined) {
        setHasVariants(productData.hasVariants);
      }
      if (productData.variants && productData.variants.length > 0) {
        setVariants(productData.variants);
      }
      // 🆕 LOAD FLASH SALE DATA - NEW ADDITION
      if (productData.flashSale) {
        setFlashSale({
          isActive: productData.flashSale.isActive || false,
          discountPercentage: productData.flashSale.discountPercentage || 0,
          startTime: productData.flashSale.startTime
            ? new Date(productData.flashSale.startTime)
                .toISOString()
                .slice(0, 16)
            : "",
          endTime: productData.flashSale.endTime
            ? new Date(productData.flashSale.endTime).toISOString().slice(0, 16)
            : "",
        });
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

  // --- VARIANT LOGIC ---
  const addColorVariant = () => {
    const newVariant = {
      color: {
        name: "",
        hexCode: "#000000",
        image: "",
        images: [],
      },
      sizes: [
        {
          size: "",
          price: Number(price) || 0,
          countInStock: 0,
          sku: "",
          isAvailable: true,
        },
      ],
      isActive: true,
    };
    setVariants([...variants, newVariant]);
  };

  const removeColorVariant = (colorIndex) => {
    setVariants(variants.filter((_, i) => i !== colorIndex));
  };

  const updateColorInfo = (colorIndex, field, value) => {
    const newVariants = [...variants];
    newVariants[colorIndex].color[field] = value;
    setVariants(newVariants);
  };

  const uploadColorImage = async (e, colorIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      toast.info("Uploading color image...");
      const res = await uploadProductImage(formData).unwrap();
      const newVariants = [...variants];
      newVariants[colorIndex].color.image = res.images[0];
      if (!newVariants[colorIndex].color.images.includes(res.images[0])) {
        newVariants[colorIndex].color.images.push(res.images[0]);
      }
      setVariants(newVariants);
      toast.success("Color image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const addSizeToVariant = (colorIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes.push({
      size: "",
      price: Number(price) || 0,
      countInStock: 0,
      sku: "",
      isAvailable: true,
    });
    setVariants(newVariants);
  };

  const removeSizeFromVariant = (colorIndex, sizeIndex) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes = newVariants[colorIndex].sizes.filter(
      (_, i) => i !== sizeIndex,
    );
    setVariants(newVariants);
  };

  const updateSizeInfo = (colorIndex, sizeIndex, field, value) => {
    const newVariants = [...variants];
    newVariants[colorIndex].sizes[sizeIndex][field] = value;
    setVariants(newVariants);
  };

  // ✅ আপডেটেড: Shipping Type Change Handler
  const handleShippingTypeChange = (e) => {
    const newType = e.target.value;
    setShippingType(newType);

    // স্বয়ংক্রিয়ভাবে ডিফল্ট ভ্যালু সেট করো
    switch (newType) {
      case "free":
        setInsideDhakaCharge(0);
        setOutsideDhakaCharge(0);
        setFixedShippingCharge(0);
        setIsFreeShippingActive(true);
        setFreeShippingThreshold(0);
        break;
      case "fixed":
        setInsideDhakaCharge(0);
        setOutsideDhakaCharge(0);
        setFixedShippingCharge(fixedShippingCharge || 100); // ডিফল্ট 100
        setIsFreeShippingActive(false);
        break;
      case "inside-outside":
        setInsideDhakaCharge(insideDhakaCharge || 80);
        setOutsideDhakaCharge(outsideDhakaCharge || 150);
        setFixedShippingCharge(0);
        setIsFreeShippingActive(false);
        break;
      case "weight-based":
      default:
        setInsideDhakaCharge(insideDhakaCharge || 80);
        setOutsideDhakaCharge(outsideDhakaCharge || 150);
        setFixedShippingCharge(0);
        setIsFreeShippingActive(false);
        break;
    }
  };

  // 🆕 FLASH SALE HANDLERS - NEW ADDITION
  // ============================================================
  const handleFlashSaleToggle = (e) => {
    setFlashSale({
      ...flashSale,
      isActive: e.target.checked,
    });
  };

  const handleFlashSaleChange = (field, value) => {
    setFlashSale({
      ...flashSale,
      [field]: value,
    });
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

    // Validate variants if enabled
    if (hasVariants) {
      if (variants.length === 0) {
        toast.error("At least one color variant is required.");
        setUpdateLoading(false);
        return;
      }
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v.color.name) {
          toast.error(`Color name is required for variant ${i + 1}`);
          setUpdateLoading(false);
          return;
        }
        if (!v.color.image) {
          toast.error(`Image is required for color: ${v.color.name}`);
          setUpdateLoading(false);
          return;
        }
        if (v.sizes.length === 0) {
          toast.error(`At least one size required for: ${v.color.name}`);
          setUpdateLoading(false);
          return;
        }
        for (let j = 0; j < v.sizes.length; j++) {
          if (!v.sizes[j].size) {
            toast.error(`Size name required for ${v.color.name}`);
            setUpdateLoading(false);
            return;
          }
          if (v.sizes[j].price <= 0) {
            toast.error(
              `Valid price required for ${v.color.name} - ${v.sizes[j].size}`,
            );
            setUpdateLoading(false);
            return;
          }
        }
      }
    }

    // 🆕 FLASH SALE VALIDATION - NEW ADDITION

    if (flashSale.isActive) {
      if (!flashSale.startTime || !flashSale.endTime) {
        toast.error("Flash Sale start and end time are required.");
        setUpdateLoading(false);
        return;
      }
      if (
        flashSale.discountPercentage <= 0 ||
        flashSale.discountPercentage > 100
      ) {
        toast.error("Flash Sale discount must be between 1 and 100.");
        setUpdateLoading(false);
        return;
      }
      if (new Date(flashSale.startTime) >= new Date(flashSale.endTime)) {
        toast.error("Flash Sale end time must be after start time.");
        setUpdateLoading(false);
        return;
      }
    }

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

      // Shipping Data
      formData.append("weight", Number(weight));
      formData.append("shippingType", shippingType);
      formData.append("insideDhakaCharge", Number(insideDhakaCharge));
      formData.append("outsideDhakaCharge", Number(outsideDhakaCharge));
      formData.append("fixedShippingCharge", Number(fixedShippingCharge));
      formData.append("freeShippingThreshold", Number(freeShippingThreshold));
      formData.append("isFreeShippingActive", isFreeShippingActive);

      // Variant Data
      formData.append("hasVariants", hasVariants);
      if (hasVariants) {
        formData.append("variants", JSON.stringify(variants));
        formData.append("defaultColorIndex", 0);
        formData.append("defaultSizeIndex", 0);
      }

      // 🆕 FLASH SALE DATA APPEND - NEW ADDITION

      formData.append("flashSale", JSON.stringify(flashSale));

      const data = await updateProduct({
        productId: params._id,
        formData,
      }).unwrap();

      if (data?.error) {
        toast.error(data.error);
      } else {
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

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveVariantTab("basic")}
                className={`px-6 py-3 font-black uppercase text-[12px] tracking-widest transition-all ${
                  activeVariantTab === "basic"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveVariantTab("variants")}
                className={`px-6 py-3 font-black uppercase text-[12px] tracking-widest transition-all flex items-center gap-2 ${
                  activeVariantTab === "variants"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <FaPalette />
                Variants {hasVariants && `(${variants.length} Colors)`}
              </button>
              {/* ============================================================
                                🆕 FLASH SALE TAB - NEW ADDITION
                            ============================================================ */}
              <button
                onClick={() => setActiveVariantTab("flashsale")}
                className={`px-6 py-3 font-black uppercase text-[12px] tracking-widest transition-all flex items-center gap-2 ${
                  activeVariantTab === "flashsale"
                    ? "border-b-2 border-red-600 text-red-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <FaBolt
                  className={
                    flashSale.isActive ? "text-red-500 animate-pulse" : ""
                  }
                />
                Flash Sale
                {flashSale.isActive && (
                  <span className="bg-red-500 text-white text-[8px] px-2 py-0.5 rounded-full">
                    ON
                  </span>
                )}
              </button>
            </div>

            <div className="bg-white border border-gray-100 shadow-2xl p-6 lg:p-10 relative">
              {/* BASIC INFO TAB */}
              {activeVariantTab === "basic" && (
                <>
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
                        label: "BASE_PRICE",
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
                      <TreeSelect
                        showSearch
                        style={{ width: "100%" }}
                        value={category}
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        placeholder="SELECT_CATEGORY"
                        allowClear
                        treeDefaultExpandAll
                        onChange={(newValue) => setCategory(newValue)}
                        treeData={organizedCategories}
                        treeNodeLabelProp="label"
                        className="custom-tree-select w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus-within:border-red-600 transition-all"
                        variant="borderless"
                      />
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

                    {/* Enable Variants Toggle */}
                    <div className="flex items-center gap-4 pt-6 bg-red-50 p-4 rounded-xl border border-red-100">
                      <div className="flex-1">
                        <label className="text-[11px] font-black text-red-600 tracking-widest uppercase block">
                          Enable Variants
                        </label>
                        <p className="text-[9px] text-gray-500 mt-1">
                          Color & Size combinations
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={hasVariants}
                        onChange={(e) => setHasVariants(e.target.checked)}
                        className="w-6 h-6 accent-red-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* --- Key Features --- */}
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
                  {/* --- Specifications --- */}
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
                        <div className="flex gap-4 flex-1">
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

                  {/* --- SHIPPING CONFIGURATION SECTION --- */}
                  {/* --- SHIPPING CONFIGURATION SECTION --- */}
                  <div className="mb-12 border-t border-gray-100 pt-10">
                    <p className="text-[12px] font-black uppercase tracking-widest text-red-600 mb-8 flex items-center gap-2">
                      <span className="w-8 h-[2px] bg-red-600"></span>
                      Shipping_Configuration_Node
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                      {/* ✅ আপডেটেড: Shipping Type with auto-update */}
                      <div className="group relative">
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                          Shipping_Logic_Type
                        </label>
                        <select
                          className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all cursor-pointer appearance-none"
                          onChange={handleShippingTypeChange} // ✅ নতুন হ্যান্ডলার
                          value={shippingType}
                        >
                          <option value="weight-based">
                            WEIGHT_BASED (Default)
                          </option>
                          <option value="fixed">FIXED_RATE</option>
                          <option value="inside-outside">
                            INSIDE_OUTSIDE_DHAKA
                          </option>
                          <option value="free">ALWAYS_FREE</option>
                        </select>
                        <p className="text-[9px] text-gray-400 mt-1">
                          {shippingType === "weight-based" &&
                            "Charges based on product weight"}
                          {shippingType === "fixed" &&
                            "Flat rate regardless of location"}
                          {shippingType === "inside-outside" &&
                            "Different rates for Dhaka vs Outside"}
                          {shippingType === "free" && "No shipping charges"}
                        </p>
                      </div>

                      {/* Weight - শুধু weight-based এর জন্য */}
                      <div
                        className={`group relative transition-all duration-500 ${
                          shippingType !== "weight-based" &&
                          shippingType !== "inside-outside"
                            ? "opacity-30"
                            : "opacity-100"
                        }`}
                      >
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                          Item_Weight_(KG)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={weight}
                          disabled={
                            shippingType !== "weight-based" &&
                            shippingType !== "inside-outside"
                          }
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-300"
                        />
                        {shippingType === "weight-based" && (
                          <p className="text-[9px] text-orange-400 mt-1">
                            Extra ৳20/kg after 1kg
                          </p>
                        )}
                      </div>

                      {/* Free Shipping Toggle */}
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
                          disabled={shippingType === "free"} // free তে অটোমেটিক true থাকবে
                          className="w-6 h-6 accent-red-600 cursor-pointer disabled:opacity-50"
                        />
                      </div>

                      {/* Free Shipping Threshold */}
                      <div
                        className={`group relative transition-all duration-500 ${
                          !isFreeShippingActive ? "opacity-30" : "opacity-100"
                        }`}
                      >
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                          Free_Shipping_Threshold (৳)
                        </label>
                        <input
                          type="number"
                          value={freeShippingThreshold}
                          disabled={!isFreeShippingActive}
                          onChange={(e) =>
                            setFreeShippingThreshold(e.target.value)
                          }
                          className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all placeholder:text-gray-300"
                        />
                      </div>

                      {/* Inside Dhaka Charge - weight-based & inside-outside এর জন্য */}
                      <div
                        className={`group relative transition-all duration-500 ${
                          shippingType === "fixed" || shippingType === "free"
                            ? "opacity-30"
                            : "opacity-100"
                        }`}
                      >
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                          {shippingType === "inside-outside"
                            ? "Inside Dhaka Charge"
                            : "Base Charge (Inside Dhaka)"}
                        </label>
                        <input
                          type="number"
                          value={insideDhakaCharge}
                          disabled={
                            shippingType === "fixed" || shippingType === "free"
                          }
                          onChange={(e) => setInsideDhakaCharge(e.target.value)}
                          className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                        />
                      </div>

                      {/* Outside Dhaka Charge - weight-based & inside-outside এর জন্য */}
                      <div
                        className={`group relative transition-all duration-500 ${
                          shippingType === "fixed" || shippingType === "free"
                            ? "opacity-30"
                            : "opacity-100"
                        }`}
                      >
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                          {shippingType === "inside-outside"
                            ? "Outside Dhaka Charge"
                            : "Base Charge (Outside Dhaka)"}
                        </label>
                        <input
                          type="number"
                          value={outsideDhakaCharge}
                          disabled={
                            shippingType === "fixed" || shippingType === "free"
                          }
                          onChange={(e) =>
                            setOutsideDhakaCharge(e.target.value)
                          }
                          className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                        />
                      </div>

                      {/* Fixed Shipping Charge - শুধু fixed এর জন্য */}
                      <div
                        className={`group relative transition-all duration-500 ${
                          shippingType !== "fixed"
                            ? "opacity-30"
                            : "opacity-100"
                        }`}
                      >
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-2 block">
                          Fixed_Shipping_Charge (৳)
                        </label>
                        <input
                          type="number"
                          value={fixedShippingCharge}
                          disabled={shippingType !== "fixed"}
                          onChange={(e) =>
                            setFixedShippingCharge(e.target.value)
                          }
                          placeholder={
                            shippingType === "fixed" ? "Enter fixed amount" : ""
                          }
                          className="w-full bg-white border-b-2 border-gray-100 py-2 font-bold text-black focus:outline-none focus:border-red-600 transition-all"
                        />
                        {shippingType === "fixed" && (
                          <p className="text-[9px] text-blue-400 mt-1">
                            Same charge for all locations
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ✅ নতুন: Preview Section */}
                    <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                        Shipping Preview
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-[9px] text-gray-400 uppercase">
                            Type
                          </p>
                          <p className="text-sm font-bold text-black uppercase">
                            {shippingType.replace("-", " ")}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-[9px] text-gray-400 uppercase">
                            Inside Dhaka
                          </p>
                          <p className="text-sm font-bold text-black">
                            ৳
                            {shippingType === "free"
                              ? "0"
                              : insideDhakaCharge || 0}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-[9px] text-gray-400 uppercase">
                            Outside Dhaka
                          </p>
                          <p className="text-sm font-bold text-black">
                            ৳
                            {shippingType === "free"
                              ? "0"
                              : shippingType === "fixed"
                                ? fixedShippingCharge || 0
                                : outsideDhakaCharge || 0}
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-100">
                          <p className="text-[9px] text-gray-400 uppercase">
                            Free Shipping
                          </p>
                          <p className="text-sm font-bold text-black">
                            {isFreeShippingActive
                              ? `Above ৳${freeShippingThreshold || 0}`
                              : "Disabled"}
                          </p>
                        </div>
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
                </>
              )}

              {/* VARIANTS TAB */}
              {activeVariantTab === "variants" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black text-black tracking-tighter uppercase">
                        Product Variants
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Configure color and size combinations with individual
                        pricing
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addColorVariant}
                      className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all"
                    >
                      <FaPlus /> Add Color
                    </button>
                  </div>

                  {variants.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <FaPalette className="mx-auto text-4xl text-gray-300 mb-4" />
                      <p className="text-gray-500 font-mono text-sm">
                        No variants added yet. Click &quot;Add Color&quot; to
                        start.
                      </p>
                    </div>
                  )}

                  {variants.map((variant, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="bg-gray-50 rounded-2xl p-6 border border-gray-200"
                    >
                      {/* Color Header */}
                      <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                              Color Name
                            </label>
                            <input
                              type="text"
                              value={variant.color.name}
                              onChange={(e) =>
                                updateColorInfo(
                                  colorIndex,
                                  "name",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Red"
                              className="w-full bg-white border border-gray-200 rounded-lg p-3 font-bold text-black focus:ring-2 focus:ring-red-600 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                              Hex Code
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={variant.color.hexCode}
                                onChange={(e) =>
                                  updateColorInfo(
                                    colorIndex,
                                    "hexCode",
                                    e.target.value,
                                  )
                                }
                                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={variant.color.hexCode}
                                onChange={(e) =>
                                  updateColorInfo(
                                    colorIndex,
                                    "hexCode",
                                    e.target.value,
                                  )
                                }
                                className="flex-1 bg-white border border-gray-200 rounded-lg p-3 font-mono text-sm uppercase"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                              Color Image
                            </label>
                            <div className="flex gap-2">
                              {variant.color.image ? (
                                <div className="relative w-12 h-12">
                                  <img
                                    src={variant.color.image}
                                    alt="Color"
                                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      updateColorInfo(colorIndex, "image", "")
                                    }
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[8px] flex items-center justify-center"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ) : (
                                <label className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-600 hover:bg-red-50 transition-all">
                                  <FaCloudUploadAlt className="text-gray-400" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                      uploadColorImage(e, colorIndex)
                                    }
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeColorVariant(colorIndex)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FaTrash />
                        </button>
                      </div>

                      {/* Sizes Section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <FaRuler /> Sizes for{" "}
                            {variant.color.name || `Color ${colorIndex + 1}`}
                          </h4>
                          <button
                            type="button"
                            onClick={() => addSizeToVariant(colorIndex)}
                            className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1 hover:text-black transition-all"
                          >
                            <FaPlus /> Add Size
                          </button>
                        </div>

                        {variant.sizes.map((size, sizeIndex) => (
                          <div
                            key={sizeIndex}
                            className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white p-4 rounded-xl border border-gray-200"
                          >
                            <div>
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                Size
                              </label>
                              <input
                                type="text"
                                value={size.size}
                                onChange={(e) =>
                                  updateSizeInfo(
                                    colorIndex,
                                    sizeIndex,
                                    "size",
                                    e.target.value,
                                  )
                                }
                                placeholder="S, M, L"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                Price (৳)
                              </label>
                              <input
                                type="number"
                                value={size.price}
                                onChange={(e) =>
                                  updateSizeInfo(
                                    colorIndex,
                                    sizeIndex,
                                    "price",
                                    Number(e.target.value),
                                  )
                                }
                                placeholder="0"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                Stock
                              </label>
                              <input
                                type="number"
                                value={size.countInStock}
                                onChange={(e) =>
                                  updateSizeInfo(
                                    colorIndex,
                                    sizeIndex,
                                    "countInStock",
                                    Number(e.target.value),
                                  )
                                }
                                placeholder="0"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-sm focus:ring-2 focus:ring-red-600 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                                SKU (Optional)
                              </label>
                              <input
                                type="text"
                                value={size.sku}
                                onChange={(e) =>
                                  updateSizeInfo(
                                    colorIndex,
                                    sizeIndex,
                                    "sku",
                                    e.target.value,
                                  )
                                }
                                placeholder="SKU-001"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 font-mono text-sm uppercase focus:ring-2 focus:ring-red-600 outline-none"
                              />
                            </div>
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() =>
                                  removeSizeFromVariant(colorIndex, sizeIndex)
                                }
                                className="w-full p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center justify-center gap-1"
                              >
                                <FaTrash size={12} /> Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ============================================================
                                🆕 FLASH SALE TAB - NEW ADDITION
               ============================================================ */}
              {activeVariantTab === "flashsale" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-black text-black tracking-tighter uppercase flex items-center gap-2">
                        <FaBolt className="text-red-500" />
                        Flash Sale Configuration
                      </h2>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Set up limited-time discounts to boost sales urgency
                      </p>
                    </div>
                  </div>

                  {/* Flash Sale Toggle */}
                  <div
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      flashSale.isActive
                        ? "bg-red-50 border-red-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            flashSale.isActive ? "bg-red-500" : "bg-gray-300"
                          }`}
                        >
                          <FaBolt className="text-white text-2xl" />
                        </div>
                        <div>
                          <h3 className="font-black text-black tracking-tight">
                            Enable Flash Sale
                          </h3>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {flashSale.isActive
                              ? "Flash Sale is ACTIVE - Product will appear in Flash Sale section"
                              : "Toggle to enable flash sale for this product"}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={flashSale.isActive}
                          onChange={handleFlashSaleToggle}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Flash Sale Settings */}
                  {flashSale.isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      {/* Discount Percentage */}
                      <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4 block">
                          Flash Sale Discount (%)
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="1"
                            max="99"
                            value={flashSale.discountPercentage}
                            onChange={(e) =>
                              handleFlashSaleChange(
                                "discountPercentage",
                                parseInt(e.target.value),
                              )
                            }
                            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                          />
                          <div className="w-20 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-lg">
                              {flashSale.discountPercentage}%
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">
                          Regular Price: ৳{price || 0} → Flash Sale Price:
                          <span className="text-red-500 font-bold ml-1">
                            ৳
                            {price
                              ? Math.round(
                                  price *
                                    (1 - flashSale.discountPercentage / 100),
                                )
                              : 0}
                          </span>
                        </p>
                      </div>

                      {/* Date & Time */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-gray-200">
                          <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4 block">
                            Sale Start Time
                          </label>
                          <input
                            type="datetime-local"
                            value={flashSale.startTime}
                            onChange={(e) =>
                              handleFlashSaleChange("startTime", e.target.value)
                            }
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 font-mono text-black focus:border-red-500 focus:outline-none transition-all"
                          />
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-gray-200">
                          <label className="text-[11px] font-black text-gray-400 tracking-widest uppercase mb-4 block">
                            Sale End Time
                          </label>
                          <input
                            type="datetime-local"
                            value={flashSale.endTime}
                            onChange={(e) =>
                              handleFlashSaleChange("endTime", e.target.value)
                            }
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-4 font-mono text-black focus:border-red-500 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Preview Card */}
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-2xl text-white">
                        <div className="flex items-center gap-3 mb-4">
                          <FaBolt className="text-2xl animate-pulse" />
                          <h4 className="font-black uppercase tracking-wider">
                            Flash Sale Preview
                          </h4>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm">
                              Product will appear in Flash Sale section
                            </p>
                            <p className="text-white/60 text-xs mt-1">
                              {flashSale.startTime && flashSale.endTime
                                ? `${new Date(flashSale.startTime).toLocaleString()} - ${new Date(flashSale.endTime).toLocaleString()}`
                                : "Set start and end time to activate"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black">
                              {flashSale.discountPercentage}%
                            </p>
                            <p className="text-white/80 text-xs uppercase tracking-wider">
                              OFF
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 pt-10 mt-10">
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
