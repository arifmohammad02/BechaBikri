/* eslint-disable react/prop-types */
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
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline, MdOutlineCloudUpload } from "react-icons/md";
import React from "react";

// --- UPDATE START: Adding Icons for TreeView ---
import {
  FaFolder,
  FaFolderOpen,
  FaChevronRight,
  FaChevronDown,
} from "react-icons/fa";
// --- UPDATE END ---

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();
  const [name, setName] = useState("");
  const [parent, setParent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  console.log(categories);

  const renderTreeOptions = (allCategories, parentId = null, depth = 0) => {
    return allCategories
      .filter((c) => {
        const currentParentId =
          c.parent && typeof c.parent === "object" ? c.parent._id : c.parent;
        return parentId === null
          ? !currentParentId
          : currentParentId === parentId;
      })
      .map((c) => (
        <React.Fragment key={c._id}>
          <option value={c._id} className={`ml-${depth * 4}`}>
            {"\u00A0\u00A0".repeat(depth * 2)} {depth > 0 ? "↳ " : ""} {c.name}
          </option>
          {renderTreeOptions(allCategories, c._id, depth + 1)}
        </React.Fragment>
      ));
  };

  // --- UPDATE START: Recursive TreeView Component ---
  const TreeItem = ({ category, allCategories, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState(true);
    // --- UPDATE START: Child filtering with Deep Populate ---
    const children = allCategories.filter((c) => {
      const currentParentId =
        c.parent && typeof c.parent === "object" ? c.parent._id : c.parent;
      return currentParentId === category._id;
    });
    // --- UPDATE END ---
    const hasChildren = children.length > 0;

    return (
      <div className="ml-4 border-l border-slate-200 pl-4 my-1">
        <div className="flex items-center gap-2 group py-1">
          {hasChildren ? (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400"
            >
              {isOpen ? (
                <FaChevronDown size={12} />
              ) : (
                <FaChevronRight size={12} />
              )}
            </button>
          ) : (
            <span className="w-3" />
          )}

          <span className={hasChildren ? "text-blue-600" : "text-slate-600"}>
            {isOpen && hasChildren ? <FaFolderOpen /> : <FaFolder />}
          </span>

          <span className="font-medium text-slate-800 group-hover:text-blue-600 cursor-default">
            {category.name}
          </span>

          <div className="hidden group-hover:flex gap-2 ml-4">
            <button
              onClick={() => {
                setSelectedCategory(category);
                setUpdatingName(category.name);
                setModalVisible(true);
              }}
              className="text-blue-500 hover:text-blue-700 text-xs font-bold"
            >
              EDIT
            </button>
          </div>
        </div>

        {isOpen && hasChildren && (
          <div>
            {children.map((child) => (
              <TreeItem
                key={child._id}
                category={child}
                allCategories={allCategories}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  // --- UPDATE END ---

  // Handle Image Upload to Cloudinary
  const uploadImage = async () => {
    if (!image) return null;
    const formData = new FormData();
    formData.append("image", image);

    try {
      const { data } = await axios.post("/api/upload", formData);
      return data.images && data.images.length > 0 ? data.images[0] : null;
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
    const imageUrl = await uploadImage();
    try {
      const result = await createCategory({
        name,
        image: imageUrl,
        parent: parent || null,
      }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        setParent("");
        setImage(null);
        toast.success(`${result.name} is created.`);
        refetch();
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

    let imageUrl = selectedCategory.image;

    if (image) {
      const uploadedUrl = await uploadImage();
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

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
        setImage(null);
        setModalVisible(false);
        refetch();
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
        refetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminMenu />
      <div className="max-w-6xl mx-auto py-12 pt-32 px-4 sm:px-6">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Manage Categories
          </h1>
          <p className="text-slate-500">
            Create infinite sub-categories for your store.
          </p>
        </header>

        {/* --- Form --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-12 transition-all hover:border-blue-200">
          <form onSubmit={handleCreateCategory} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 font-figtree uppercase tracking-wider">
                  Category Name
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Category Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-700">
                  Select Parent
                </label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full p-4 bg-slate-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">None (Main Category)</option>
                  {categories && renderTreeOptions(categories)}
                </select>
              </div>

              {/* --- UPDATE START: Now showing image upload for ALL categories --- */}
              <div className="space-y-2">
                <label className="text-[14px] font-bold text-slate-700 font-figtree uppercase tracking-wider">
                  Image (Optional for sub)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-[60px] border-2 border-dashed border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
                  <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-600 transition-colors">
                    <MdOutlineCloudUpload size={20} />
                    <span className="text-sm font-medium">
                      {image ? image.name : "Upload"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
              {/* --- UPDATE END --- */}
            </div>

            {image && (
              <div className="flex justify-center border-t border-slate-100 pt-6">
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-sm ring-1 ring-slate-200"
                  />
                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold">
                    New Preview
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-slate-900 hover:bg-blue-700 text-white text-[16px] font-bold font-figtree rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:bg-slate-400"
              disabled={creating}
            >
              {creating ? "Processing..." : "Create Category"}
            </button>
          </form>
        </div>

        {/* --- UPDATE START: TreeView Visual Structure --- */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-12 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <FaFolderOpen className="text-blue-500" /> Category Tree View
          </h2>
          <div className="max-h-[400px] overflow-y-auto pr-4">
            {categories
              ?.filter((c) => {
                const currentParentId =
                  c.parent && typeof c.parent === "object"
                    ? c.parent._id
                    : c.parent;
                return !currentParentId;
              })
              .map((mainCat) => (
                <TreeItem
                  key={mainCat._id}
                  category={mainCat}
                  allCategories={categories}
                />
              ))}
          </div>
        </div>
        {/* --- UPDATE END --- */}

        {/* --- Table --- */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 uppercase">
                    Icon
                  </th>
                  <th className="px-8 py-5 text-left text-[11px] font-bold text-slate-500 uppercase">
                    Name
                  </th>
                  <th className="px-8 py-5 text-center text-[11px] font-bold text-slate-500 uppercase">
                    Type
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {categories?.map((category) => (
                  <tr
                    key={category._id}
                    className="hover:bg-blue-50/30 transition-all"
                  >
                    <td className="px-8 py-4">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <FaFolder size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-4">
                      <span className="font-medium text-slate-800">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.parent ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}
                      >
                        {category.parent
                          ? `Sub (${typeof category.parent === "object" ? category.parent.name : "Category"})`
                          : "Main"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          title="Edit"
                          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all active:scale-90"
                          onClick={() => {
                            setModalVisible(true);
                            setSelectedCategory(category);
                            setUpdatingName(category.name);
                          }}
                        >
                          <CiEdit size={20} />
                        </button>
                        <button
                          title="Delete"
                          className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-red-500 hover:text-red-600 transition-all active:scale-90"
                          onClick={() => {
                            setSelectedCategory(category);
                            setModalVisible(true);
                          }}
                        >
                          <MdDeleteOutline size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Modal with Dynamic Context --- */}
        <Modal
          isOpen={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setImage(null);
          }}
        >
          <div className="bg-white p-2">
            <header className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 font-figtree">
                {selectedCategory && updatingName === selectedCategory.name
                  ? "Edit Category"
                  : "Category Actions"}
              </h2>
              <p className="text-slate-500 text-sm">
                Update details or remove this category permanently.
              </p>
            </header>

            <form onSubmit={handleUpdateCategory} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 font-figtree uppercase">
                  Update Name
                </label>
                <input
                  type="text"
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-figtree"
                  placeholder="New category name"
                  value={updatingName}
                  onChange={(e) => setUpdatingName(e.target.value)}
                  required
                />
              </div>

              {/* --- UPDATE START: Always show image edit --- */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 font-figtree uppercase">
                  Change Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-blue-100 hover:file:text-blue-700 transition-all"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              {/* --- UPDATE END --- */}

              {image && (
                <div className="bg-slate-50 p-3 rounded-xl inline-block border border-blue-100">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  className="bg-white text-red-600 border border-red-200 py-4 rounded-xl font-bold hover:bg-red-50 transition-all disabled:opacity-50"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete Category"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;