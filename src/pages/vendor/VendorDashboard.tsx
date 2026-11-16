
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SalesReport from "./SalesReport";
import VendorOrders from "./VendorOrders";

import {
  getVendorAnalytics,
  type AnalyticsPeriod,
  type VendorAnalytics,
} from "../../services/analyticsApi";

const VendorDashboard = () => {
  const location = useLocation();

  const isSalesReport = location.pathname === "/vendor/sales-report";
  const isVendorOrders = location.pathname === "/vendor/orders";

  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getVendorAnalytics(period);

        if (!cancelled) {
          setAnalytics(data);
        }
      } catch (err: unknown) {
        console.error("Vendor analytics loading failed:", err);

        if (!cancelled) {
          setError(
            "Analytics load করা যায়নি। Backend connection এবং Vendor login পরীক্ষা কর।"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [period]);

  const menuItems = [
    { label: "Dashboard", path: "/vendor/dashboard", icon: "▦" },
    { label: "Products", path: "/vendor/products", icon: "□" },
    { label: "Orders", path: "/vendor/orders", icon: "▤" },
    { label: "Inventory", path: "/vendor/inventory", icon: "▥" },
    { label: "Earnings", path: "/vendor/earnings", icon: "$" },
    { label: "Withdrawals", path: "/vendor/withdrawals", icon: "⇧" },
    { label: "Customers", path: "/vendor/customers", icon: "♙" },
    { label: "Reviews", path: "/vendor/reviews", icon: "☆" },
    { label: "Coupons", path: "/vendor/coupons", icon: "◇" },
    { label: "Store Profile", path: "/vendor/store-profile", icon: "⌂" },
    { label: "Sales Report", path: "/vendor/sales-report", icon: "▤" },
    { label: "Analytics", path: "/vendor/analytics", icon: "▥" },
    { label: "Notifications", path: "/vendor/notifications", icon: "♧" },
    { label: "Settings", path: "/vendor/settings", icon: "⚙" },
  ];

  const summary = analytics?.summary;

  const dashboardCards = [
    {
      title: "Total Revenue",
      value: `৳${(summary?.totalRevenue || 0).toLocaleString("en-BD")}`,
      icon: "৳",
      color: "bg-violet-50 text-violet-600",
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders ?? 0,
      icon: "▣",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Products",
      value: summary?.totalProducts ?? 0,
      icon: "▦",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Products Sold",
      value: summary?.totalItemsSold ?? 0,
      icon: "🛒",
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Pending Items",
      value: summary?.pendingOrders ?? 0,
      icon: "◷",
      color: "bg-orange-50 text-orange-600",
    },
    {
      title: "Low Stock Items",
      value: summary?.lowStockItems ?? 0,
      icon: "⚠",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const formatMoney = (amount: number) =>
    `৳${Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date: string) => {
    if (date.includes("-W")) return date;

    const parsed = new Date(
      date.length === 10 ? `${date}T00:00:00` : date
    );

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const sales = analytics?.salesOverview || [];

  const maxRevenue = Math.max(
    ...sales.map((item) => item.revenue),
    1
  );

  const recentOrders = analytics?.recentOrders || [];
  const lowStockProducts = analytics?.lowStockProducts || [];
  const topProducts = analytics?.topProducts || [];

  const periodLabels: Record<AnalyticsPeriod, string> = {
    daily: "Last 7 Days",
    weekly: "Last 8 Weeks",
    monthly: "Last 12 Months",
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 overflow-y-auto bg-[#071226] text-white lg:block">
        <div className="border-b border-white/10 px-6 py-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            <span className="text-violet-400">N</span>exora
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Your Technology. Your World.
          </p>
        </div>

        <div className="px-4 py-5">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Vendor Panel
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-900/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-h-screen lg:pl-56">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400"
          />

          <div className="ml-4 flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifications"
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              ♧
            </button>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Vendor Store
              </p>
              <p className="text-xs text-slate-500">Vendor</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="space-y-6 p-5 sm:p-8">
          {isSalesReport ? (
            <SalesReport />
          ) : isVendorOrders ? (
            <VendorOrders />
          ) : (
            <>
              {/* Dashboard Heading */}
              <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Dashboard
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Welcome back! Here's your store overview.
                  </p>
                </div>

                <select
                  value={period}
                  onChange={(event) =>
                    setPeriod(event.target.value as AnalyticsPeriod)
                  }
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-violet-400"
                >
                  <option value="daily">Last 7 Days</option>
                  <option value="weekly">Last 8 Weeks</option>
                  <option value="monthly">Last 12 Months</option>
                </select>
              </section>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Summary Cards */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {dashboardCards.map((card) => (
                  <article
                    key={card.title}
                    className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${card.color}`}
                    >
                      {card.icon}
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        {card.title}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {loading ? "..." : card.value}
                      </p>
                    </div>
                  </article>
                ))}
              </section>

              {/* Sales Overview */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <article className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Sales Overview
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Delivered sales · {periodLabels[period]}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-violet-700">
                      {formatMoney(summary?.totalRevenue || 0)}
                    </p>
                  </div>

                  {loading ? (
                    <div className="flex min-h-64 items-center justify-center text-sm text-slate-500">
                      Loading sales data...
                    </div>
                  ) : sales.length === 0 ? (
                    <div className="flex min-h-64 items-center justify-center text-center text-sm text-slate-500">
                      No delivered sales found for this period.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {sales.map((item) => (
                        <div
                          key={item.date}
                          className="grid grid-cols-[95px_1fr_90px] items-center gap-3"
                        >
                          <span className="truncate text-xs text-slate-500">
                            {formatDate(item.date)}
                          </span>

                          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-violet-600 transition-all"
                              style={{
                                width: `${Math.max(
                                  (item.revenue / maxRevenue) * 100,
                                  item.revenue > 0 ? 2 : 0
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="text-right text-xs font-semibold text-slate-700">
                            {formatMoney(item.revenue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                {/* Order Status */}
                <article className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="font-bold text-slate-900">
                    Order Status
                  </h3>

                  <div className="mt-5 space-y-4">
                    {(
                      [
                        ["Pending", "pending", "bg-amber-500"],
                        ["Confirmed", "confirmed", "bg-blue-500"],
                        ["Processing", "processing", "bg-violet-500"],
                        ["Shipped", "shipped", "bg-indigo-500"],
                        ["Delivered", "delivered", "bg-emerald-500"],
                        ["Cancelled", "cancelled", "bg-red-500"],
                      ] as const
                    ).map(([label, key, color]) => {
                      const count = analytics?.itemStatus[key] || 0;

                      return (
                        <div key={key}>
                          <div className="mb-1 flex justify-between text-sm">
                            <span className="text-slate-600">
                              {label}
                            </span>
                            <span className="font-semibold text-slate-900">
                              {loading ? "..." : count}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${color}`}
                              style={{
                                width: `${
                                  analytics
                                    ? Math.min(
                                        (count /
                                          Math.max(
                                            Object.values(
                                              analytics.itemStatus
                                            ).reduce(
                                              (a, b) => a + b,
                                              0
                                            ),
                                            1
                                          )) *
                                          100,
                                        100
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </section>

              {/* Recent Orders */}
              <section className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">
                    Recent Orders
                  </h3>
                  <Link
                    to="/vendor/orders"
                    className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                  >
                    View All
                  </Link>
                </div>

                {loading ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Loading recent orders...
                  </p>
                ) : recentOrders.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    No recent orders found.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-500">
                          <th className="px-3 py-3">Order ID</th>
                          <th className="px-3 py-3">Customer</th>
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">Vendor Total</th>
                          <th className="px-3 py-3">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr
                            key={order._id}
                            className="border-b border-slate-50 last:border-0"
                          >
                            <td className="px-3 py-4 font-medium text-slate-800">
                              #{order._id.slice(-7)}
                            </td>
                            <td className="px-3 py-4 text-slate-600">
                              {order.customer?.name || "Customer"}
                            </td>
                            <td className="px-3 py-4 text-slate-500">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-3 py-4 font-semibold text-slate-800">
                              {formatMoney(order.vendorOrderTotal)}
                            </td>
                            <td className="px-3 py-4 capitalize text-slate-600">
                              {order.paymentStatus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Low Stock and Top Products */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <article className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">
                      Low Stock Alerts
                    </h3>
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                      {analytics?.lowStockProducts.length || 0} items
                    </span>
                  </div>

                  {loading ? (
                    <p className="py-6 text-sm text-slate-500">
                      Loading inventory...
                    </p>
                  ) : lowStockProducts.length === 0 ? (
                    <p className="py-6 text-sm text-slate-500">
                      No low stock products found.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {lowStockProducts.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between gap-3 border-b border-slate-50 pb-3 last:border-0"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatMoney(product.price)}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600">
                            {product.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="mb-4 font-bold text-slate-900">
                    Top Selling Products
                  </h3>

                  {loading ? (
                    <p className="py-6 text-sm text-slate-500">
                      Loading top products...
                    </p>
                  ) : topProducts.length === 0 ? (
                    <p className="py-6 text-sm text-slate-500">
                      No delivered product sales found yet.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div
                          key={product._id}
                          className="flex items-center gap-3"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-sm font-bold text-violet-700">
                            {index + 1}
                          </span>

                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-11 w-11 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                              📦
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.totalSold} sold
                            </p>
                          </div>

                          <span className="text-sm font-semibold text-slate-700">
                            {formatMoney(product.revenue)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;
