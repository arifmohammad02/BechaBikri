import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { FaSpinner } from "react-icons/fa6";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [offer, setOffer] = useState("");
  const [warranty, setWarranty] = useState("");
  // const [specifications, setSpecifications] = useState("");
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

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
      setLoading(true); // Set loading to true
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);
      productData.append("discountPercentage", discountPercentage);
      productData.append("isFeatured", isFeatured);
      productData.append("shippingCharge", shippingCharge);
      productData.append("offer", offer);
      productData.append("warranty", warranty);
      // const specificationsArray = specifications
      //   .split(",")
      //   .map((item) => item.trim());
      // productData.append("specifications", JSON.stringify(specificationsArray));
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
      setLoading(false); // Set loading to false after the process
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    setLoading(true); // Set loading to true before upload

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    } finally {
      setLoading(false); // Set loading to false after upload
    }
  };

  return (
    <div className="p-5 min-h-screen bg-white pt-20">
      <div className="flex flex-col justify-center md:flex-row gap-6">
        {/* Admin Menu */}
        <AdminMenu />

        <div className="md:w-3/4 p-8 bg-white rounded-md border border-gray-400">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b border-gray-300 pb-3">
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
            <label className="block text-gray-600 font-bold mb-2 text-center cursor-pointer py-5 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-300">
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
              <label htmlFor="name" className="text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="price" className="text-gray-700">
                Price
              </label>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="text-gray-700">
                Quantity
              </label>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-3">
            <div>
              <label htmlFor="brand" className="text-gray-700">
                Brand
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="stock" className="text-gray-700">
                Count In Stock
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="category" className="text-gray-700">
                Category
              </label>
              <select
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="text-gray-600 text-xl">
                  Choose Category
                </option>
                {categories?.map((c) => (
                  <option
                    key={c._id}
                    value={c._id}
                    className="text-gray-600 text-xl"
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
              <label htmlFor="discountPercentage" className="text-gray-700">
                Discount Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="isFeatured" className="text-gray-700">
                Is Featured
              </label>
              <input
                type="checkbox"
                className="px-4 py-2 flex justify-start mt-2"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
            </div>
            <div>
              <label htmlFor="shippingCharge" className="text-gray-700">
                Shipping Charge
              </label>
              <input
                type="number"
                min="0"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={shippingCharge}
                onChange={(e) => setShippingCharge(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="offer" className="text-gray-700">
                Offer
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="warranty" className="text-gray-700">
                Warranty
              </label>
              <input
                type="text"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={warranty}
                onChange={(e) => setWarranty(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="discountedAmount" className="text-gray-700">
                Discounted Amount
              </label>
              <input
                type="number"
                min="0"
                className="px-4 py-2 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={discountedAmount}
                onChange={(e) => setDiscountedAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            {/* <div className="mb-6">
              <label htmlFor="specifications" className="text-gray-700">
                Specifications (comma separated)
              </label>
              <textarea
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
              />
            </div> */}
            <div className="">
              <label htmlFor="description" className="text-gray-700">
                Description
              </label>
              <textarea
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300 mt-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading} // Disable button while loading
            className={` text-lg font-semibold text-white  w-fit
              duration-300  ${
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
