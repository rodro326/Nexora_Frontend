
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import api from "../../services/api";

type ItemStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type StatusFilter = "all" | ItemStatus;

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
}

interface ShippingAddress {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface Product {
  _id: string;
  name?: string;
  price?: number;
  images?: string[];
}

interface OrderItem {
  product: string | Product;
  vendor: string;
  quantity: number;
  price: number;
  subtotal: number;
  itemStatus?: ItemStatus;
}

interface VendorOrder {
  _id: string;
  customer?: Customer;
  user?: Customer | string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  vendorOrderTotal: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
}

const statusStyles: Record<ItemStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-violet-50 text-violet-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const nextStatus: Partial<Record<ItemStatus, ItemStatus>> = {
  pending: "confirmed",
  confirmed: "processing",
  processing: "shipped",
};

const filters: StatusFilter[] = [
  "all",
  "pending",
  "confirmed",
  "processing",
  "shipped",
];

const VendorOrders = () => {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingKey, setUpdatingKey] = useState("");
  const [success, setSuccess] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/vendor/my-orders");

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Orders load করা যায়নি।"
        );
      }

      setOrders(response.data.data || []);
    } catch (err: unknown) {
      console.error("Vendor orders loading failed:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Orders load করা যায়নি। Backend connection পরীক্ষা কর।"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Orders load করার সময় সমস্যা হয়েছে।");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const updateStatus = async (
    orderId: string,
    productId: string,
    itemStatus: ItemStatus
  ) => {
    const key = `${orderId}-${productId}`;

    try {
      setUpdatingKey(key);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/orders/vendor/${orderId}/items/${productId}/status`,
        { itemStatus }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Status update করা যায়নি।"
        );
      }

      setSuccess(`Order item successfully updated to ${itemStatus}.`);

      await loadOrders();
    } catch (err: unknown) {
      console.error("Order status update failed:", err);

      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Status update করা যায়নি। আবার চেষ্টা কর।"
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Status update করার সময় সমস্যা হয়েছে।");
      }
    } finally {
      setUpdatingKey("");
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;

    return order.items.some(
      (item) => (item.itemStatus || "pending") === filter
    );
  });

  const totalOrders = orders.length;

  const pendingCount = orders.reduce(
    (total, order) =>
      total +
      order.items.filter(
        (item) => (item.itemStatus || "pending") === "pending"
      ).length,
    0
  );

  const shippedCount = orders.reduce(
    (total, order) =>
      total +
      order.items.filter((item) => item.itemStatus === "shipped").length,
    0
  );

  const getProduct = (product: string | Product) => {
    return typeof product === "string" ? null : product;
  };

  const getProductId = (product: string | Product) => {
    return typeof product === "string" ? product : product._id;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (amount: number) =>
    `৳${Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getCustomer = (order: VendorOrder) => {
    return order.customer ||
      (typeof order.user === "object" ? order.user : undefined);
  };

  return (
    <section className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Order Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your customer orders and track product delivery.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadOrders()}
          disabled={loading}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          ↻ Refresh Orders
        </button>
      </div>

      {/* Notifications */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {totalOrders}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Pending Items</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">
            {pendingCount}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Shipped Items</p>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {shippedCount}
          </p>
        </article>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filter === item
                ? "bg-violet-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item === "all" ? "All Orders" : item}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <p className="text-sm text-slate-500">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
          <div className="text-4xl">📦</div>
          <h3 className="mt-3 font-semibold text-slate-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            There are no orders available in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const customer = getCustomer(order);

            const shipping = order.shippingAddress;

            return (
              <article
                key={order._id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Order ID
                    </p>
                    <p className="mt-1 break-all font-semibold text-slate-900">
                      #{order._id}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Payment</p>
                      <span className="mt-1 inline-block rounded-full bg-slate-100 px-3 py-1 font-medium capitalize text-slate-700">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Vendor Order Total
                      </p>
                      <p className="mt-1 font-bold text-violet-700">
                        {formatMoney(order.vendorOrderTotal)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
                  {/* Customer */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-900">
                      Customer Information
                    </h3>

                    <p className="text-sm font-semibold text-slate-800">
                      {shipping?.fullName || customer?.name || "Customer"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {customer?.email || "Email unavailable"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Phone: {shipping?.phone || customer?.phone || "N/A"}
                    </p>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-900">
                      Shipping Address
                    </h3>

                    <p className="text-sm text-slate-600">
                      {shipping?.address || "Address unavailable"}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {shipping?.city || ""}
                      {shipping?.postalCode
                        ? ` - ${shipping.postalCode}`
                        : ""}
                    </p>
                  </div>

                  {/* Order Info */}
                  <div>
                    <h3 className="mb-3 text-sm font-bold text-slate-900">
                      Order Information
                    </h3>

                    <p className="text-sm text-slate-600">
                      Overall Status:{" "}
                      <span className="font-semibold capitalize text-slate-800">
                        {order.orderStatus}
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      Vendor Products: {order.items.length}
                    </p>
                  </div>
                </div>

                {/* Product Items */}
                <div className="border-t border-slate-100 p-5">
                  <h3 className="mb-4 text-sm font-bold text-slate-900">
                    Your Products
                  </h3>

                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const product = getProduct(item.product);
                      const productId = getProductId(item.product);
                      const currentStatus = item.itemStatus || "pending";
                      const upcomingStatus = nextStatus[currentStatus];
                      const key = `${order._id}-${productId}`;
                      const isUpdating = updatingKey === key;

                      return (
                        <div
                          key={`${productId}-${index}`}
                          className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {product?.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name || "Product"}
                                className="h-16 w-16 rounded-lg border border-slate-200 bg-white object-cover"
                              />
                            ) : (
                              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-2xl">
                                📦
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-900">
                                {product?.name || "Product"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                Quantity: {item.quantity}
                              </p>

                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {formatMoney(item.subtotal)}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                                statusStyles[currentStatus]
                              }`}
                            >
                              {currentStatus}
                            </span>

                            {upcomingStatus && (
                              <button
                                type="button"
                                disabled={isUpdating || Boolean(updatingKey)}
                                onClick={() =>
                                  void updateStatus(
                                    order._id,
                                    productId,
                                    upcomingStatus
                                  )
                                }
                                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : `Mark as ${upcomingStatus}`}
                              </button>
                            )}

                            {!upcomingStatus &&
                              currentStatus === "shipped" && (
                                <span className="text-xs font-medium text-slate-500">
                                  Awaiting delivery
                                </span>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default VendorOrders;
