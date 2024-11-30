import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "@redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "@redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

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

        <div className="md:w-3/4 p-8 bg-white rounded-lg shadow-xl border border-gray-200">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="text-gray-700">Name</label>
              <input
                type="text"
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="price" className="text-gray-700">Price</label>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="quantity" className="text-gray-700">Quantity</label>
              <input
                min="0"
                inputMode="numeric"
                type="number"
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="brand" className="text-gray-700">Brand</label>
              <input
                type="text"
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <label htmlFor="description" className="text-gray-700">Description</label>
            <textarea
              className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* Stock & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="stock" className="text-gray-700">Count In Stock</label>
              <input
                type="text"
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="category" className="text-gray-700">Category</label>
              <select
                className="p-4 w-full border border-gray-300 rounded-lg bg-white text-gray-800 outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-300"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories?.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>


          <button
            onClick={handleSubmit}
            disabled={loading} // Disable button while loading
            className={`py-2 px-5 mt-5 rounded-lg text-lg font-semibold text-white shadow-md transition-all w-fit
              duration-300  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black/80 hover:bg-black active:bg-pink-800"
              } ${loading ? "" : "hover:shadow-lg active:shadow-xl"}`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C6.268 0 2 4.268 2 9s4.268 9 9 9v-4a5 5 0 01-5-5z"
                ></path>
              </svg>
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
