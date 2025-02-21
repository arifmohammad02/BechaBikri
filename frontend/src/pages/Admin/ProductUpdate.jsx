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
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);
  const [discountPercentage, setDiscountPercentage] = useState(
    productData?.discountPercentage || 0
  );
  const [isFeatured, setIsFeatured] = useState(
    productData?.isFeatured || false
  );
  const [offer, setOffer] = useState(productData?.offer || "");
  const [warranty, setWarranty] = useState(productData?.warranty || "");
  // const [specifications, setSpecifications] = useState(
  //   productData?.specifications || []
  // );
  const [discountedAmount, setDiscountedAmount] = useState(
    productData?.discountedAmount || 0
  );
  const [uploadLoading, setUploadLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setDiscountPercentage(productData.discountPercentage);
      setIsFeatured(productData.isFeatured);
      setOffer(productData.offer);
      setWarranty(productData.warranty);
      // setSpecifications(productData.specifications);
      setDiscountedAmount(productData.discountedAmount);
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
      formData.append("countInStock", stock);
      formData.append("discountPercentage", discountPercentage);
      formData.append("isFeatured", isFeatured);
      formData.append("offer", offer);
      formData.append("warranty", warranty);
      // formData.append("specifications", JSON.stringify(specifications));
      formData.append("discountedAmount", discountedAmount);

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
    let answer = window.confirm(
      "Are you sure you want to delete this product?"
    );
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
    <div className={`py-10`}>
      <div className="min-h-screen backdrop:flex flex-col py-10 mt-10">
        <div className="flex flex-col gap-8 w-full px-4">
          {/* Admin Menu */}
          <AdminMenu />

          {/* Product Update/Delete Section */}
          <div className="w-full bg-white p-5 border-2 2xl:container 2xl:mx-auto">
            <h1 className="text-[22px] font-bold font-figtree text-black mb-5 border-b pb-3">
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
              <label className="block w-full text-center text-gray-700 font-bold text-[18px] font-figtree bg-gray-50 border-2 border-dashed border-gray-400 cursor-pointer py-5 rounded-sm">
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
                  className="w-full mt-2 p-3 border rounded-sm text-gray-800 font-figtree font-normal text-[16px] focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={name}
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
                  type="number"
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
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
                  type="number"
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label
                  htmlFor="brand"
                  className="text-gray-700 font-figtree font-medium text-[18px]"
                >
                  Brand
                </label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={brand}
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
                  type="number"
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
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
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
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
              <div>
                <label
                  htmlFor="discountPercentage"
                  className="text-gray-700 font-figtree font-medium text-[18px]"
                >
                  Discount Percentage
                </label>
                <input
                  type="number"
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <div>
                <label
                  htmlFor="isFeatured"
                  className="text-gray-700 font-figtree font-medium text-[18px]"
                >
                  Featured
                </label>
                <input
                  type="checkbox"
                  className="px-4 py-2 flex justify-start mt-2"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
              </div>

              <div>
                <label
                  htmlFor="offer"
                  className="text-gray-700 font-figtree font-medium text-[18px]"
                >
                  Offer
                </label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={offer}
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
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={warranty}
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
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={discountedAmount}
                  onChange={(e) => setDiscountedAmount(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="text-gray-700 font-figtree font-medium text-[18px]"
                >
                  Description
                </label>
                <textarea
                  className="w-full mt-2 p-3 border text-gray-800 font-figtree font-normal text-[16px] rounded-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition  bg-transparent"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {/* <div>
              <label
                htmlFor="specifications"
                className="text-gray-600 font-medium"
              >
                Specifications
              </label>
              <textarea
                className="w-full mt-2 p-3 border rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50 transition"
                value={specifications}
                onChange={(e) => setSpecifications(e.target.value)}
              ></textarea>
            </div> */}
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                className="text-white bg-black/90 hover:bg-black px-3 py-2 rounded-md font-figtree font-medium text-[16px]"
                onClick={handleSubmit}
              >
                {updateLoading ? "Updating..." : "Update Product"}
              </button>
              <button
                className="text-white bg-red-500/90 hover:bg-red-500 px-3 py-2 rounded-md font-figtree font-medium text-[16px]"
                onClick={handleDelete}
              >
                {deleteLoading ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
