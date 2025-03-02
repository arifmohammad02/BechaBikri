import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FaSpinner } from "react-icons/fa6";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles


const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // State for rich text description
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
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

  // React Quill modules and formats configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
      ["bold", "italic", "underline", "strike"], // Bold, italic, etc.
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      ["link", "image"], // Links and images
      ["clean"], // Remove formatting
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!image) return toast.error("Image is required.");
    if (!name || name.trim() === "") return toast.error("Name is required.");
    if (!price || isNaN(price) || price <= 0)
      return toast.error("Valid price is required.");
    if (!quantity || isNaN(quantity) || quantity < 0)
      return toast.error("Valid quantity is required.");
    if (!brand || brand.trim() === "") return toast.error("Brand is required.");
    if (!description || description.trim() === "")
      return toast.error("Description is required.");
    if (stock === "" || isNaN(stock) || stock < 0)
      return toast.error("Valid stock count is required.");
    if (!category || category.trim() === "")
      return toast.error("Category is required.");

    try {
      setLoading(true);
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description); // Rich text description
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

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product creation failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product creation failed. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    setLoading(true);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-gray-100 h-screen transition-all duration-300 flex-1 2xl:pl-7 pt-32`}
    >
      <div className="flex flex-col justify-center items-center p-5">
        {/* Admin Menu */}
        <AdminMenu />

        <div className="p-5 bg-white rounded-sm border border-gray-400 w-full 2xl:container 2xl:mx-auto">
          <h2 className="text-[22px] font-bold font-figtree text-black mb-6 border-b border-gray-300 pb-3">
            Create Product
          </h2>

          {/* Image Upload */}
          {imageUrl && (
            <div className="text-center mb-5">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px] h-[200px] w-auto rounded-lg border border-gray-300 shadow-md hover:shadow-lg transition-all duration-300 object-contain"
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block text-gray-600 font-figtree font-medium text-[22px] mb-2 text-center cursor-pointer py-5 border-dashed border-2 border-gray-300 rounded-sm hover:bg-gray-200 transition-all duration-300">
              {loading ? "Uploading..." : image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-3">
            <div>
              <label
                htmlFor="name"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Name
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={name}
                placeholder="Product Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Price
              </label>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                placeholder="Product Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Quantity
              </label>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={quantity}
                placeholder="Product Quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-3">
            <div>
              <label
                htmlFor="brand"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Brand
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={brand}
                placeholder="Product Brand"
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="stock"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Count In Stock
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={stock}
                placeholder="Product Stock"
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Category
              </label>
              <select
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="text-gray-600 text-xl">
                  Choose Category
                </option>
                {categories?.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                    className="text-gray-600 font-figtree font-semibold text-[14px]"
                  >
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Fields for New Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-3">
            <div>
              <label
                htmlFor="discountPercentage"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Discount Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={discountPercentage}
                placeholder="Product Discount Percentage"
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="isFeatured"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Is Featured
              </label>
              <input
                type="checkbox"
                className="px-4 py-2 flex justify-start mt-2"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label
                htmlFor="offer"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Offer
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={offer}
                placeholder="Product Offer"
                onChange={(e) => setOffer(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="warranty"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Warranty
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={warranty}
                placeholder="Product Warranty"
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="discountedAmount"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Discounted Amount
              </label>
              <input
                type="number"
                min="0"
                className="px-4 py-2 w-full border border-gray-300 rounded-sm bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={discountedAmount}
                placeholder="Discounted Amount"
                onChange={(e) => setDiscountedAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="">
              <label
                htmlFor="description"
                className="text-gray-700 font-figtree font-medium text-[18px]"
              >
                Description
              </label>
              {/* Replace textarea with React Quill */}
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={modules}
                formats={formats}
                placeholder="Product Description"
                className="bg-white text-gray-800 font-figtree font-normal text-[16px] outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`text-lg font-semibold text-white w-fit
              duration-300 px-3 py-2 rounded ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black hover:bg-black active:bg-pink-800"
              } ${loading ? "" : "hover:shadow-lg active:shadow-xl"}`}
          >
            {loading ? (
              <FaSpinner className="animate-spin h-5 w-5 text-white" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;