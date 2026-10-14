
import { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ApiResponse>(
          "/products/vendor/my-products"
        );

        setProducts(response.data.data);
      } catch (err) {
        console.error("Failed to fetch vendor products:", err);
        setError("Products load করা যায়নি। Login এবং API connection check কর।");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, []);

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

          <button
            type="button"
            onClick={() =>
              window.location.assign("/vendor/products/new")
            }
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            + Add Product
          </button>
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

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading your products...
            </div>
          ) : error ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-semibold text-slate-700">
                No products found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add your first product to start building your store.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Brand</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Stock</th>
                    <th className="px-4 py-3 font-medium">Status</th>
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
