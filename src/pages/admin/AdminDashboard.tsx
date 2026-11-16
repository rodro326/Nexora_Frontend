
import { useEffect, useState } from "react";
import {
  getAdminAnalytics,
  type AdminAnalytics,
  type AnalyticsPeriod,
} from "../../services/analyticsApi";

const formatCurrency = (amount: number) =>
  `৳${amount.toLocaleString("en-BD")}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-indigo-100 text-indigo-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminAnalytics(period);

        if (active) {
          setAnalytics(data);
        }
      } catch (err: any) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load admin analytics."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAnalytics();

    return () => {
      active = false;
    };
  }, [period]);

  const stats = analytics
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(analytics.summary.totalRevenue),
          description: "Delivered order revenue",
          icon: "৳",
          color: "bg-violet-100 text-violet-600",
        },
        {
          title: "Total Orders",
          value: analytics.summary.totalOrders.toLocaleString(),
          description: "All platform orders",
          icon: "▤",
          color: "bg-blue-100 text-blue-600",
        },
        {
          title: "Total Customers",
          value: analytics.summary.totalCustomers.toLocaleString(),
          description: "Registered customers",
          icon: "♙",
          color: "bg-emerald-100 text-emerald-600",
        },
        {
          title: "Total Vendors",
          value: analytics.summary.totalVendors.toLocaleString(),
          description: "Registered vendors",
          icon: "▣",
          color: "bg-orange-100 text-orange-600",
        },
        {
          title: "Total Products",
          value: analytics.summary.totalProducts.toLocaleString(),
          description: "Active products",
          icon: "◈",
          color: "bg-pink-100 text-pink-600",
        },
        {
          title: "Delivered Orders",
          value: analytics.summary.deliveredOrders.toLocaleString(),
          description: "Successfully delivered",
          icon: "✓",
          color: "bg-teal-100 text-teal-600",
        },
      ]
    : [];

  const maxRevenue = Math.max(
    ...(analytics?.salesOverview.map((item) => item.revenue) || [0]),
    1
  );

  const orderStatuses = analytics
    ? [
        { label: "Pending", value: analytics.orderStatus.pending, color: "bg-amber-500" },
        { label: "Confirmed", value: analytics.orderStatus.confirmed, color: "bg-blue-500" },
        { label: "Processing", value: analytics.orderStatus.processing, color: "bg-indigo-500" },
        { label: "Shipped", value: analytics.orderStatus.shipped, color: "bg-purple-500" },
        { label: "Delivered", value: analytics.orderStatus.delivered, color: "bg-emerald-500" },
        { label: "Cancelled", value: analytics.orderStatus.cancelled, color: "bg-red-500" },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's what's happening with Nexora.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ↻ Refresh Dashboard
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !analytics && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading platform analytics...
          </p>
        </div>
      )}

      {/* Statistics */}
      {analytics && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                      {loading ? "..." : stat.value}
                    </h2>
                  </div>

                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {/* Revenue Chart and Recent Orders */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Revenue Overview
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Delivered order revenue
                  </p>
                </div>

                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(e.target.value as AnalyticsPeriod)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none"
                >
                  <option value="daily">Last 7 Days</option>
                  <option value="weekly">Last 8 Weeks</option>
                  <option value="monthly">Last 12 Months</option>
                </select>
              </div>

              {analytics.salesOverview.length === 0 ? (
                <div className="mt-8 flex h-64 items-center justify-center rounded-xl bg-slate-50">
                  <div className="text-center">
                    <div className="text-4xl text-slate-300">▥</div>
                    <p className="mt-3 text-sm font-medium text-slate-500">
                      No delivered revenue in this period
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Revenue chart will update when orders are delivered.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 space-y-5">
                  {analytics.salesOverview.map((item) => (
                    <div key={item.date}>
                      <div className="mb-2 flex justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-600">
                          {item.date}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-violet-600 transition-all"
                          style={{
                            width: `${(item.revenue / maxRevenue) * 100}%`,
                          }}
                        />
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        {item.orders} delivered order(s)
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Order Status
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Platform order breakdown
              </p>

              <div className="mt-7 space-y-5">
                {orderStatuses.map((status) => {
                  const percentage =
                    analytics.summary.totalOrders > 0
                      ? (status.value / analytics.summary.totalOrders) * 100
                      : 0;

                  return (
                    <div key={status.label}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-600">
                          {status.label}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {status.value}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${status.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-slate-900">
                  Recent Orders
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Latest platform orders
                </p>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Latest {analytics.recentOrders.length} orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {analytics.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {order.user?.name || "Unknown Customer"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.user?.email || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm capitalize text-slate-600">
                        {order.paymentStatus}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[order.orderStatus] || "bg-slate-100 text-slate-600"}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {analytics.recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
