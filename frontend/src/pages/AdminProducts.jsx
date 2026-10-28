import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Upload,
  Check,
  FolderX,
  Layers,
  AlertTriangle,
} from "lucide-react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteCategory,
} from "../services/productApi";

import { uploadProductImage } from "../services/uploadApi";
import { useAuth } from "../context/AuthContext";

function AdminProducts() {
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingCategoryName, setDeletingCategoryName] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [editingProductId, setEditingProductId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: "",
  });

  // Calculate unique categories and their product counts
  const categoryStats = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const cat = p.category?.trim();
      if (cat) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [products]);

  const resetForm = () => {
    setEditingProductId(null);
    setSelectedImage(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image: "",
    });
  };

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedImage(null);
      return;
    }

    setSelectedImage(file);
    setError("");
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setSelectedImage(null);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || "",
    });

    setError("");
    setSuccessMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      let imageUrl = formData.image;

      if (selectedImage) {
        setUploadingImage(true);

        const uploadData = await uploadProductImage(selectedImage, token);

        imageUrl = uploadData.imageUrl;
        setUploadingImage(false);
      }

      const productData = {
        ...formData,
        image: imageUrl,
      };

      if (editingProductId) {
        const data = await updateProduct(editingProductId, productData, token);

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product._id === editingProductId ? data.product : product
          )
        );

        setSuccessMessage("Creation updated successfully in Maison records.");
      } else {
        const data = await createProduct(productData, token);

        setProducts((currentProducts) => [data.product, ...currentProducts]);

        setSuccessMessage("New creation successfully registered with the Maison.");
      }

      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to archive product creation."
      );
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you wish to retire this creation from the active catalogue?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccessMessage("");

      await deleteProduct(productId, token);

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== productId)
      );

      setSuccessMessage("Creation retired successfully from the active catalogue.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to retire creation."
      );
    }
  };

  // Delete an entire category and all of its creations
  const handleDeleteCategory = async (categoryName) => {
    const matchingProducts = products.filter(
      (p) => p.category?.trim().toLowerCase() === categoryName.trim().toLowerCase()
    );
    const count = matchingProducts.length;

    const confirmed = window.confirm(
      `⚠️ DELETE CATEGORY: "${categoryName}"\n\nAre you sure you want to delete this category?\nThis will retire all ${count} creation(s) currently filed under "${categoryName}".`
    );

    if (!confirmed) return;

    try {
      setDeletingCategoryName(categoryName);
      setError("");
      setSuccessMessage("");

      try {
        await deleteCategory(categoryName, token);
      } catch (apiErr) {
        // Fallback: batch soft-delete products one-by-one if bulk endpoint is unavailable
        for (const prod of matchingProducts) {
          await deleteProduct(prod._id, token);
        }
      }

      // Remove from local state
      setProducts((currentProducts) =>
        currentProducts.filter(
          (p) =>
            p.category?.trim().toLowerCase() !==
            categoryName.trim().toLowerCase()
        )
      );

      setSuccessMessage(
        `Category "${categoryName}" and all ${count} creation(s) were successfully deleted.`
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `Failed to delete category "${categoryName}".`
      );
    } finally {
      setDeletingCategoryName("");
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load creations catalogue."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center">
        <p className="text-xs uppercase tracking-luxury text-neutral-500">
          Loading Maison Catalog...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
              <Link to="/" className="hover:text-black font-medium text-neutral-700">Home</Link>
              <span>/</span>
              <Link to="/admin" className="hover:text-black">Dashboard</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Catalogue & Categories</span>
            </nav>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight">
              Manage Creations & Categories
            </h1>
          </div>

          <div className="flex items-center gap-6 text-xs uppercase tracking-luxury text-neutral-500 font-medium">
            <span>{categoryStats.length} Categories</span>
            <span>•</span>
            <span>{products.length} Active Pieces</span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 space-y-12">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs text-center uppercase tracking-luxury">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="p-4 bg-neutral-950 text-white border border-neutral-800 text-xs flex items-center gap-2 uppercase tracking-luxury">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Category Management & Deletion Section */}
        <section className="border border-neutral-200 bg-white p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-500" />
                <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
                  Category Management
                </h2>
              </div>
              <p className="text-xs text-neutral-500 font-light mt-1">
                Manage and retire categories from the store. Deleting a category removes all of its associated products.
              </p>
            </div>

            <span className="text-[10px] uppercase tracking-luxury text-neutral-400">
              {categoryStats.length} Total Collections
            </span>
          </div>

          {categoryStats.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4 font-light">
              No active categories in the database. Add products to create categories.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
              {categoryStats.map((cat) => (
                <div
                  key={cat.name}
                  className="border border-neutral-200 bg-[#fbfbf9] p-5 flex flex-col justify-between hover:border-black transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-editorial text-lg text-neutral-950 font-normal">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-luxury px-2 py-0.5 bg-neutral-200 text-neutral-800 font-medium">
                        {cat.count} {cat.count === 1 ? "Piece" : "Pieces"}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 font-light">
                      Active House Collection
                    </p>
                  </div>

                  {/* Delete Category Button */}
                  <div className="mt-5 pt-3 border-t border-neutral-200/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: cat.name }))}
                      className="text-[10px] uppercase tracking-luxury text-neutral-600 hover:text-black font-medium"
                      title="Use this category for new product"
                    >
                      Use Category
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.name)}
                      disabled={deletingCategoryName === cat.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-red-50 text-red-700 text-[10px] uppercase tracking-luxury font-medium hover:bg-red-700 hover:text-white transition-all disabled:opacity-50"
                      title={`Delete category "${cat.name}" and all its pieces`}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{deletingCategoryName === cat.name ? "Deleting..." : "Delete Category"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. Product Creation / Edit Form */}
        <form
          onSubmit={handleSubmit}
          className="border border-neutral-200 bg-white p-8 sm:p-10 space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-neutral-200 pb-5">
            <div>
              <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
                {editingProductId ? "Modify Creation Dossier" : "Archive New Creation"}
              </h2>
              <p className="text-xs text-neutral-500 font-light mt-1">
                Enter creation silhouette, artisanal category, pricing, and stock allocations.
              </p>
            </div>

            {editingProductId && (
              <span className="text-[10px] uppercase tracking-luxury px-3 py-1 bg-neutral-950 text-white">
                Editing Mode
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                Creation Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dionysus Embroidered Shoulder Bag"
                required
                disabled={saving}
                className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                Category / Collection *
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Leather Goods, Shoes, Ready-to-Wear"
                required
                disabled={saving}
                className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
              />
              {categoryStats.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] uppercase tracking-luxury text-neutral-400">
                    Existing:
                  </span>
                  {categoryStats.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: c.name }))}
                      className="text-[9px] uppercase tracking-luxury px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                Price (PKR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                disabled={saving}
                className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                Initial Stock Allocation *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
                disabled={saving}
                className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                Description & Craftsmanship Narrative *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed material provenance, silhouette notes, and artisanal finishing specifications..."
                rows="4"
                required
                disabled={saving}
                className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black resize-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                High-Resolution Visual Media
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={saving}
                className="w-full bg-[#fbfbf9] border border-neutral-300 p-3 text-xs text-neutral-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-luxury file:bg-neutral-950 file:text-white hover:file:bg-neutral-800 cursor-pointer"
              />
              <p className="text-[10px] text-neutral-500 mt-2 uppercase tracking-luxury">
                Supported formats: JPG, PNG, or WEBP. Maximum file size: 5 MB.
              </p>
            </div>
          </div>

          {(formData.image || selectedImage) && (
            <div className="pt-4 border-t border-neutral-200">
              <p className="text-xs uppercase tracking-luxury text-neutral-500 mb-3">
                Media Preview
              </p>
              <div className="w-36 h-48 bg-[#f5f4ef] border border-neutral-200 overflow-hidden">
                <img
                  src={
                    selectedImage
                      ? URL.createObjectURL(selectedImage)
                      : formData.image
                  }
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex flex-wrap gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors shadow-md"
            >
              {uploadingImage
                ? "Uploading Media..."
                : saving
                  ? "Archiving Creation..."
                  : editingProductId
                    ? "Update Creation"
                    : "Register New Creation"}
            </button>

            {editingProductId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-8 py-3.5 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-luxury font-medium hover:bg-neutral-100 transition-colors"
              >
                Cancel Modification
              </button>
            )}
          </div>
        </form>

        {/* 3. Existing Products Catalogue Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h2 className="font-editorial text-3xl text-neutral-950 font-normal">
              Active House Archive
            </h2>
            <span className="text-xs uppercase tracking-luxury text-neutral-500">
              Showing {products.length} {products.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>

          {products.length === 0 ? (
            <div className="border border-neutral-200 bg-white p-12 text-center text-xs text-neutral-500 font-light">
              No active creations currently archived.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="border border-neutral-200 bg-white overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-[#f5f4ef] overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-luxury text-neutral-400">
                        Atelier Creation
                      </div>
                    )}

                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-luxury bg-white/95 px-2.5 py-1 text-neutral-900 border border-neutral-200">
                      {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] uppercase tracking-luxury text-neutral-500 font-medium">
                          {product.category}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(product.category)}
                          className="text-[9px] uppercase tracking-luxury text-neutral-400 hover:text-red-700 flex items-center gap-1"
                          title={`Delete category "${product.category}" and its pieces`}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                          <span>Del Cat</span>
                        </button>
                      </div>

                      <h3 className="font-editorial text-xl text-neutral-950 mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-700 font-light mt-1">
                        Rs. {product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="flex-1 py-2.5 bg-neutral-950 text-white text-[11px] uppercase tracking-luxury font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="px-4 py-2.5 border border-red-200 text-red-700 text-[11px] uppercase tracking-luxury font-medium hover:bg-red-50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;