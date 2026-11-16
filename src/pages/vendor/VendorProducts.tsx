
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images?: string[];
  isActive?: boolean;
  category?: {
    name: string;
  };
  brand?: {
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
}

const VendorProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const fetchVendorProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<ApiResponse>(
        "/products/vendor/my-products"
      );

      setProducts(response.data.data);
    } catch (err: unknown) {
      console.error("Failed to fetch vendor products:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Products load করা যায়নি। Login এবং API connection check কর।"
        );
      } else {
        setError("Products load করার সময় সমস্যা হয়েছে।");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchVendorProducts();
  }, [fetchVendorProducts]);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `"${product.name}" product-টি delete করতে চাস? এই action undo করা যাবে না।`
    );

    if (!confirmed) return;

    try {
      setDeletingId(product._id);
      setError("");
      setNotice("");

      await api.delete(`/products/${product._id}`);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id)
      );

      setNotice(`"${product.name}" সফলভাবে delete হয়েছে।`);
    } catch (err: unknown) {
      console.error("Failed to delete product:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Product delete করা যায়নি। আবার চেষ্টা কর।"
        );
      } else {
        setError("Product delete করার সময় সমস্যা হয়েছে।");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] p-5 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              My Products
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your store products and inventory.
            </p>
          </div>

          <Link
            to="/vendor/products/new"
            className="inline-flex w-fit items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            + Add Product
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="font-bold text-slate-900">
              Product Inventory
            </h2>

            <p className="text-sm text-slate-500">
              Total products: {products.length}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
            >
              {notice}
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading your products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-semibold text-slate-700">
                No products found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add your first product to start building your store.
              </p>

              <Link
                to="/vendor/products/new"
                className="mt-5 inline-flex rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Brand</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                              No image
                            </div>
                          )}

                          <span className="font-semibold text-slate-800">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {product.category?.name ?? "—"}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {product.brand?.name ?? "—"}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-800">
                        ৳{product.price.toLocaleString("en-BD")}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {product.stock}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            product.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/vendor/products/${product._id}/edit`}
                            className="inline-flex items-center rounded-lg border border-violet-200 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => void handleDelete(product)}
                            disabled={deletingId === product._id}
                            className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;
