
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import api from "../../services/api";
import { getCategories } from "../../services/categoryApi";
import { getBrands } from "../../services/brandApi";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  category: string | { _id: string; name: string };
  brand: string | { _id: string; name: string };
  isActive?: boolean;
}

interface ApiItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EditProduct = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load product, categories and brands
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!productId) {
        setError("Product ID পাওয়া যায়নি।");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [productResponse, categoryResponse, brandResponse] =
          await Promise.all([
            api.get<ApiItemResponse<Product>>(`/products/${productId}`),
            getCategories(),
            getBrands(),
          ]);

        if (cancelled) return;

        const product = productResponse.data.data;

        if (!product) {
          throw new Error("Product পাওয়া যায়নি।");
        }

        setName(product.name ?? "");
        setDescription(product.description ?? "");
        setPrice(String(product.price ?? ""));
        setStock(String(product.stock ?? ""));
        setExistingImages(product.images ?? []);
        setIsActive(product.isActive ?? true);

        setCategory(
          typeof product.category === "string"
            ? product.category
            : product.category?._id ?? ""
        );

        setBrand(
          typeof product.brand === "string"
            ? product.brand
            : product.brand?._id ?? ""
        );

        const categoryData = categoryResponse?.data;
        const brandData = brandResponse?.data;

        if (!Array.isArray(categoryData) || !Array.isArray(brandData)) {
          throw new Error("Category বা Brand data load করা যায়নি।");
        }

        setCategories(categoryData);
        setBrands(brandData);
      } catch (err: unknown) {
        if (cancelled) return;

        console.error("Failed to load edit product data:", err);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Product load করা যায়নি। Login এবং API connection পরীক্ষা কর।"
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Product load করার সময় সমস্যা হয়েছে।");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Preview newly selected images
  useEffect(() => {
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setError("");
    setSuccess("");

    if (existingImages.length + selectedFiles.length > MAX_IMAGES) {
      setError(
        `বর্তমান ${existingImages.length}টি image-এর সঙ্গে সর্বোচ্চ ${MAX_IMAGES}টি রাখা যাবে। নতুন image-এর সংখ্যা কমাও।`
      );
      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setError("শুধু image file নির্বাচন কর।");
      event.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFile) {
      setError("প্রতিটি image-এর size সর্বোচ্চ 5 MB হতে পারবে।");
      event.target.value = "";
      return;
    }

    setNewImages(selectedFiles);
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages((current) =>
      current.filter((url) => url !== imageUrl)
    );
  };

  const uploadImage = async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", image);

    const baseURL = api.defaults.baseURL;

    if (!baseURL) {
      throw new Error("API base URL পাওয়া যায়নি।");
    }

    const token = localStorage.getItem("nexora_token");

    const response = await axios.post<
      ApiItemResponse<{ imageUrl: string }>
    >(`${baseURL}/products/upload-image`, formData, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    const imageUrl = response.data?.data?.imageUrl;

    if (!imageUrl) {
      throw new Error("Uploaded image URL পাওয়া যায়নি।");
    }

    return imageUrl;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!productId) {
      setError("Product ID পাওয়া যায়নি।");
      return;
    }

    if (name.trim().length < 2 || name.trim().length > 150) {
      setError("Product name 2 থেকে 150 characters-এর মধ্যে হতে হবে।");
      return;
    }

    if (description.trim().length < 10) {
      setError("Description কমপক্ষে 10 characters হতে হবে।");
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      setError("Price শূন্য বা তার বেশি হতে হবে।");
      return;
    }

    if (
      stock.trim() === "" ||
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      setError("Stock শূন্য বা তার বেশি পূর্ণসংখ্যা হতে হবে।");
      return;
    }

    if (!category || !brand) {
      setError("Category ও Brand নির্বাচন কর।");
      return;
    }

    try {
      setSaving(true);

      const imageUrls = [...existingImages];

      if (newImages.length > 0) {
        setUploading(true);

        for (const image of newImages) {
          const url = await uploadImage(image);
          imageUrls.push(url);
        }
      }

      if (imageUrls.length > MAX_IMAGES) {
        throw new Error("সর্বোচ্চ ৫টি product image রাখা যাবে।");
      }

      await api.patch(`/products/${productId}`, {
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        stock: numericStock,
        category,
        brand,
        images: imageUrls,
        isActive,
      });

      setSuccess("Product সফলভাবে update হয়েছে!");

      window.setTimeout(() => {
        navigate("/vendor/products");
      }, 1000);
    } catch (err: unknown) {
      console.error("Product update failed:", err);

      if (axios.isAxiosError(err)) {
        const responseMessage = err.response?.data?.message;

        setError(
          typeof responseMessage === "string"
            ? responseMessage
            : "Product update করা যায়নি। আবার চেষ্টা কর।"
        );

        if (err.response?.data?.errors) {
          console.error("Validation details:", err.response.data.errors);
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Product update করার সময় সমস্যা হয়েছে।");
      }
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-4">
        <p className="text-sm text-slate-500">Loading product...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Product
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Update your product details and inventory.
            </p>
          </div>

          <Link
            to="/vendor/products"
            className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Back to Products
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              {success}
            </div>
          )}

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Basic Information
            </h2>

            <div>
              <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-slate-700">
                Product Name *
              </label>
              <input
                id="edit-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={150}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="mb-2 block text-sm font-medium text-slate-700">
                Description *
              </label>
              <textarea
                id="edit-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Pricing and Inventory
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-price" className="mb-2 block text-sm font-medium text-slate-700">
                  Price (BDT) *
                </label>
                <input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label htmlFor="edit-stock" className="mb-2 block text-sm font-medium text-slate-700">
                  Stock Quantity *
                </label>
                <input
                  id="edit-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Category and Brand
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="edit-category" className="mb-2 block text-sm font-medium text-slate-700">
                  Category *
                </label>
                <select
                  id="edit-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Select a category</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="edit-brand" className="mb-2 block text-sm font-medium text-slate-700">
                  Brand *
                </label>
                <select
                  id="edit-brand"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Select a brand</option>
                  {brands.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Product Images
            </h2>

            {existingImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {existingImages.map((imageUrl) => (
                  <div
                    key={imageUrl}
                    className="overflow-hidden rounded-lg border border-slate-200"
                  >
                    <img
                      src={imageUrl}
                      alt="Current product"
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageUrl)}
                      className="w-full px-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Remove image
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                কোনো existing image নেই।
              </p>
            )}

            <div>
              <label htmlFor="edit-images" className="mb-2 block text-sm font-medium text-slate-700">
                Add New Images
              </label>
              <input
                id="edit-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full rounded-lg border border-slate-200 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:font-medium file:text-violet-700"
              />
              <p className="mt-2 text-xs text-slate-500">
                Existing ও new image মিলিয়ে সর্বোচ্চ ৫টি। প্রতিটি নতুন image সর্বোচ্চ 5 MB।
              </p>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {previews.map((preview, index) => (
                  <div key={preview} className="overflow-hidden rounded-lg border border-slate-200">
                    <img
                      src={preview}
                      alt={`New product image ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <p className="truncate px-2 py-1 text-xs text-slate-500">
                      {newImages[index]?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-lg border border-slate-200 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 accent-violet-600"
              />
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Active product
                </span>
                <span className="block text-xs text-slate-500">
                  Customer-দের কাছে product active থাকবে।
                </span>
              </span>
            </label>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/vendor/products"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || categories.length === 0 || brands.length === 0}
              className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading Images..."
                : saving
                  ? "Updating Product..."
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProduct;
