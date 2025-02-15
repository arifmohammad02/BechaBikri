import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "@redux/api/categoryApiSlice";
import AdminMenu from "./AdminMenu";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import axios from "axios";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  // Handle Image Upload to Cloudinary
  const uploadImage = async () => {
    if (!image) return null;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const { data } = await axios.post("/api/upload", formData);
      return data.image; // Return Cloudinary URL
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed");
      return null;
    }
  };

  // Handle Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    const imageUrl = await uploadImage(); // Upload image first

    try {
      const result = await createCategory({ name, image: imageUrl }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setImage(null);
        toast.success(`${result.name} is created.`);
        refetch(); // Refresh categories
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  // Handle Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    const imageUrl = await uploadImage(); // Upload image if provided

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
          image: imageUrl,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setImage(null); // Reset image
        setModalVisible(false);
        refetch(); // Refresh categories after updating
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
        refetch(); // Refresh categories after deleting
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-5">
      <AdminMenu />
      <div className="2xl:container 2xl:mx-auto py-8 2xl:pl-7 pt-32">
        <h1 className="text-[24px] font-bold text-black font-figtree mb-8 text-start">
          Category
        </h1>

        {/* Category Form - Redesigned */}
        <div className="bg-white p-8 mb-8 border">
          <form onSubmit={handleCreateCategory} className="space-y-6">
            <div className="flex items-center justify-between gap-10">
              <div className="w-full">
                <label className="block text-[16px] font-semibold font-figtree text-black mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all hover:border-pink-300
                   placeholder:text-gray-700 font-figtree font-medium "
                  placeholder="category name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="w-full">
                <label className="block text-[16px] font-semibold font-figtree text-black mb-2">
                  Category Image
                </label>
                <div className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-300 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="w-full text-center"
                  />
                </div>
              </div>
            </div>

            {image && (
              <div className="mt-4 flex items-center justify-center">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border-4"
                />
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-4 w-full text-white text-[20px] font-normal font-serif bg-[#ED174A] hover:bg-[#223994] transition-all duration-300 ease-in-out rounded"
              disabled={creating}
            >
              {creating ? "Creating..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* Category List - Table Row Design */}
        <div className="bg-white overflow-hidden border">
          {/* Table Header */}
          <div className="bg-gray-50 py-3 px-6 border-b border-gray-200">
            <div className="flex items-center justify-between w-full">
              <p className="text-left text-[16px] font-semibold font-figtree text-black uppercase w-1/4">
                Image
              </p>
              <p className="text-center text-[16px] font-semibold font-figtree text-black uppercase w-1/2">
                Name
              </p>
              <p className="text-right text-[16px] font-semibold font-figtree text-black uppercase w-1/4">
                Actions
              </p>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {categories?.map((category) => (
              <div
                key={category._id}
                className="flex items-center justify-between py-4 px-6 hover:bg-gray-50 transition-all duration-200"
              >
                {/* Image Column */}
                <div className="w-1/4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-12 h-12 rounded-full object-cover border-4"
                  />
                </div>

                {/* Name Column */}
                <div className="w-1/2 text-center">
                  <p className="text-[14px] font-medium font-figtree text-black uppercase">
                    {category.name}
                  </p>
                </div>

                {/* Actions Column */}
                <div className="w-1/4 text-right">
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      className="bg-pink-500 text-white text-[16px] font-normal font-serif px-4 py-2 rounded-lg hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      onClick={() => {
                        setModalVisible(true);
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-[16px] font-normal font-serif hover:bg-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => {
                        setSelectedCategory(category);
                        setModalVisible(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Update and Delete */}
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-[20px] font-bold font-figtree text-center mb-6">
              {selectedCategory ? "Update Category" : "Delete Category"}
            </h2>
            <form onSubmit={handleUpdateCategory} className="space-y-6">
              <div>
                <label className="block text-start text-[16px] font-medium text-black font-figtree mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-pink-500 focus:outline-none transition-all
                   hover:border-pink-300 placeholder:text-black placeholder:text-[14px] font-medium placeholder:font-figtree text-[14px]"
                  placeholder="Category name"
                  value={updatingName}
                  onChange={(e) => setUpdatingName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-start text-[16px] font-medium text-black font-figtree mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all hover:border-pink-300"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>

              {image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover shadow-sm transform transition-all hover:scale-105"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-all duration-300 transform"
                disabled={updating}
              >
                {updating ? "Updating..." : "Update Category"}
              </button>
            </form>

            <button
              onClick={handleDeleteCategory}
              className="w-full bg-red-500 text-white py-3 rounded-lg mt-6 hover:bg-red-600 transition-all duration-300"
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Category"}
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
