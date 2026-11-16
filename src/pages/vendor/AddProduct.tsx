
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
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

interface ApiItemResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const MAX_IMAGES = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load categories and brands
  useEffect(() => {
    let cancelled = false;

    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [categoryResponse, brandResponse] = await Promise.all([
          getCategories(),
          getBrands(),
        ]);

        if (cancelled) return;

        const categoryData = categoryResponse?.data;
        const brandData = brandResponse?.data;

        if (
          !Array.isArray(categoryData) ||
          !Array.isArray(brandData)
        ) {
          throw new Error(
            "Category বা Brand API থেকে সঠিক data পাওয়া যায়নি।"
          );
        }

        setCategories(categoryData);
        setBrands(brandData);
      } catch (err: unknown) {
        if (cancelled) return;

        console.error("Failed to load categories and brands:", err);

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Category ও Brand load করা যায়নি। Backend connection পরীক্ষা কর।"
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Category ও Brand load করার সময় সমস্যা হয়েছে।");
        }
      } finally {
        if (!cancelled) {
          setLoadingOptions(false);
        }
      }
    };

    void loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  // Generate image previews and clean them up
  useEffect(() => {
    const previews = images.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Handle image selection
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setError("");
    setSuccess("");

    if (selectedFiles.length > MAX_IMAGES) {
      setImages([]);
      event.target.value = "";
      setError("সর্বোচ্চ ৫টি image নির্বাচন করতে পারবি।");
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFile) {
      setImages([]);
      event.target.value = "";
      setError("শুধু image file নির্বাচন কর।");
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_IMAGE_SIZE
    );

    if (oversizedFile) {
      setImages([]);
      event.target.value = "";
      setError("প্রতিটি image-এর size সর্বোচ্চ 5 MB হতে পারবে।");
      return;
    }

    setImages(selectedFiles);
  };

  // Upload one image
  const uploadImage = async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", image);

    const token = localStorage.getItem("nexora_token");
    const baseURL = api.defaults.baseURL;

    if (!baseURL) {
      throw new Error("API base URL পাওয়া যায়নি।");
    }

    const response = await axios.post<
      ApiItemResponse<{ imageUrl: string }>
    >(`${baseURL}/products/upload-image`, formData, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    const imageUrl = response.data?.data?.imageUrl;

    if (!imageUrl) {
      throw new Error(
        "Image upload হয়েছে, কিন্তু image URL পাওয়া যায়নি।"
      );
    }

    return imageUrl;
  };

  // Submit product
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (!name.trim() || !description.trim()) {
      setError("Product name ও description পূরণ কর।");
      return;
    }

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Price অবশ্যই শূন্যের বেশি হতে হবে।");
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

      const imageUrls: string[] = [];

      // Upload images first
      if (images.length > 0) {
        setUploading(true);

        for (const image of images) {
          const imageUrl = await uploadImage(image);
          imageUrls.push(imageUrl);
        }

        setUploading(false);
      }

      // Create product
      await api.post("/products", {
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        stock: numericStock,
        category,
        brand,
        images: imageUrls,
      });

      setSuccess("Product সফলভাবে তৈরি হয়েছে!");

      window.setTimeout(() => {
        navigate("/vendor/products");
      }, 1000);
    } catch (err: unknown) {
      console.error("Product creation failed:", err);

      if (axios.isAxiosError(err)) {
        const responseMessage = err.response?.data?.message;

        if (typeof responseMessage === "string") {
          setError(responseMessage);
        } else if (!err.response) {
          setError(
            "Backend-এর সঙ্গে connection হচ্ছে না। Backend চালু আছে কি না দেখ।"
          );
        } else {
          setError("Product তৈরি করা যায়নি। আবার চেষ্টা কর।");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Product তৈরি করার সময় অপ্রত্যাশিত সমস্যা হয়েছে।");
      }
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Add New Product
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add a product to your Nexora store.
            </p>
          </div>

          <Link
            to="/vendor/products"
            className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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

          {/* Basic Information */}
          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Basic Information
            </h2>

            <div>
              <label
                htmlFor="product-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Product Name *
              </label>
              <input
                id="product-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Wireless Headphones"
                required
                maxLength={150}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label
                htmlFor="product-description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description *
              </label>
              <textarea
                id="product-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the product and its features..."
                required
                rows={5}
                className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </section>

          {/* Pricing and Inventory */}
          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Pricing and Inventory
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="product-price"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Price (BDT) *
                </label>
                <input
                  id="product-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="e.g. 2500"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-stock"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Stock Quantity *
                </label>
                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  placeholder="e.g. 25"
                  required
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>
          </section>

          {/* Category and Brand */}
          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Category and Brand
            </h2>

            {loadingOptions ? (
              <p className="text-sm text-slate-500">
                Loading categories and brands...
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Category *
                  </label>
                  <select
                    id="product-category"
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value)
                    }
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="">Select a category</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {categories.length === 0 && (
                    <p className="mt-2 text-xs text-amber-700">
                      কোনো category পাওয়া যায়নি। Admin account থেকে
                      category তৈরি করতে হবে।
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="product-brand"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Brand *
                  </label>
                  <select
                    id="product-brand"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  >
                    <option value="">Select a brand</option>
                    {brands.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {brands.length === 0 && (
                    <p className="mt-2 text-xs text-amber-700">
                      কোনো brand পাওয়া যায়নি। Admin account থেকে
                      brand তৈরি করতে হবে।
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Product Images */}
          <section className="space-y-4">
            <h2 className="border-b border-slate-100 pb-3 font-semibold text-slate-900">
              Product Images
            </h2>

            <div>
              <label
                htmlFor="product-images"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Select Images (Optional)
              </label>
              <input
                id="product-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="block w-full rounded-lg border border-slate-200 p-3 text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:font-medium file:text-violet-700 hover:file:bg-violet-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                সর্বোচ্চ ৫টি image, প্রতিটি সর্বোচ্চ 5 MB। Image
                Cloudinary-তে upload হবে।
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="overflow-hidden rounded-lg border border-slate-200"
                  >
                    <img
                      src={preview}
                      alt={`Selected product ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <p className="truncate px-2 py-1 text-xs text-slate-500">
                      {images[index]?.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <Link
              to="/vendor/products"
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                loadingOptions ||
                categories.length === 0 ||
                brands.length === 0
              }
              className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading Images..."
                : saving
                  ? "Saving Product..."
                  : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddProduct;
