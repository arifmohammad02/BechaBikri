import { useState, useEffect } from "react";
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

const ProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    setUploadLoading(true);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!image) {
      toast.error("Please upload an image.");
      return;
    }
    if (!name || name.trim().length < 3) {
      toast.error("Name should be at least 3 characters long.");
      return;
    }
    if (!description || description.trim().length < 10) {
      toast.error("Description should be at least 10 characters long.");
      return;
    }
    if (!price || isNaN(price) || Number(price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }
    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    if (!brand || brand.trim().length < 2) {
      toast.error("Brand should be at least 2 characters long.");
      return;
    }
    if (!stock || isNaN(stock) || Number(stock) < 0) {
      toast.error("Please enter a valid stock count.");
      return;
    }

    setUpdateLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params._id, formData });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success(`Product successfully updated`);
        navigate("/admin/allproductslist");
        window.location.reload(); // Refresh to update the list
      }
    } catch (err) {
      toast.error("Product update failed. Try again.");
    } finally {
      setUpdateLoading(false);
    }
  };


  const handleDelete = async () => {
    let answer = window.confirm("Are you sure you want to delete this product?");
    if (!answer) return;

    setDeleteLoading(true);
    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" is deleted`);
      navigate("/admin/allproductslist");
      window.location.reload(); // Refresh to update the list
    } catch (err) {
      toast.error("Delete failed. Try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-5 mt-10">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* Admin Menu */}
        <AdminMenu />

        {/* Product Update/Delete Section */}
        <div className="w-full bg-white rounded-md p-8 border">
          <h1 className="text-2xl font-bold text-gray-800 mb-5 border-b pb-3">
            Update / Delete Product
          </h1>

          {/* Product Image */}
          {image && (
            <div className="text-center mb-6">
              <img
                src={image}
                alt="product"
                className="mx-auto max-h-52 w-auto rounded-lg border shadow-md hover:shadow-lg transition duration-300"
              />
            </div>
          )}

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block w-full text-center text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer py-5 font-medium hover:bg-gray-200 transition duration-300">
              {uploadLoading ? "Uploading..." : "Upload Image"}
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
              <label htmlFor="name" className="text-gray-600 font-medium">
                Name
              </label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price" className="text-gray-600 font-medium">
                Price
              </label>
              <input
                type="number"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="quantity" className="text-gray-600 font-medium">
                Quantity
              </label>
              <input
                type="number"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="brand" className="text-gray-600 font-medium">
                Brand
              </label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="text-gray-600 font-medium">
              Description
            </label>
            <textarea
              className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="stock" className="text-gray-600 font-medium">
                Count In Stock
              </label>
              <input
                type="number"
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
              />
            </div>
            <div>
              <label htmlFor="category" className="text-gray-600 font-medium">
                Category
              </label>
              <select
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Choose Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              className="w-full p-3 text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition shadow-lg"
              onClick={handleSubmit}
            >
              {updateLoading ? "Updating..." : "Update Product"}
            </button>
            <button
              className="w-full p-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-lg"
              onClick={handleDelete}
            >
              {deleteLoading ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProductUpdate;
