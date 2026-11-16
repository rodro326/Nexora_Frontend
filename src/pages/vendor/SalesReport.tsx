
import { useEffect, useState } from "react";
import api from "../../services/api";

type Period = "daily" | "weekly" | "monthly";

type ItemStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type ProductInfo = {
  _id?: string;
  name?: string;
  images?: string[];
  price?: number;
  stock?: number;
};

type SalesItem = {
  product: ProductInfo | string | null;
  quantity: number;
  price: number;
  subtotal: number;
  itemStatus?: ItemStatus;
};

type RecentSale = {
  orderId: string;
  customer?: {
    name?: string;
    email?: string;
  };
  items: SalesItem[];
  revenue: number;
  deliveredRevenue: number;
  pendingDeliveryValue: number;
  orderValue: number;
  productsSold: number;
  deliveredProductsSold: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
};

type ProductPerformance = {
  productId: string;
  productName: string;
  image: string;
  quantitySold: number;
  revenue: number;
};

type LowStockProduct = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images?: string[];
};

type SalesReportData = {
  summary: {
    totalRevenue: number;
    pendingDeliveryValue: number;
    totalOrders: number;
    totalProductsSold: number;
    deliveredOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    processingOrders: number;
    shippedOrders: number;
    cancelledOrders: number;
    inTransitOrders: number;
  };
  orderStatus: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  salesOverview: {
    date: string;
    revenue: number;
    orders: number;
    productsSold: number;
  }[];
  productPerformance: ProductPerformance[];
  bestSellingProducts: ProductPerformance[];
  lowStockProducts: LowStockProduct[];
  recentSales: RecentSale[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: {
    startDate: string | null;
    endDate: string | null;
    period: Period;
  };
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: SalesReportData;
};

const formatCurrency = (amount: number) =>
  `৳${Number(amount || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const formatDate = (date: string) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getProductName = (product: SalesItem["product"]) => {
  if (!product) return "Product";

  if (typeof product === "string") {
    return "Product";
  }

  return product.name || "Product";
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-700 ring-blue-200",
  processing: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  shipped: "bg-purple-50 text-purple-700 ring-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const SalesReport = () => {
  const [report, setReport] = useState<SalesReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [period, setPeriod] = useState<Period>("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchSalesReport = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ApiResponse>(
          "/orders/vendor/sales-report",
          {
            params: {
              period,
              startDate: startDate || undefined,
              endDate: endDate || undefined,
              page,
              limit: 10,
            },
          }
        );

        setReport(response.data.data);
      } catch (err) {
        console.error("Failed to load sales report:", err);
        setError("Sales report load করা যায়নি। Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesReport();
  }, [period, startDate, endDate, page]);

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
    setPeriod("daily");
    setPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report) return;

    const headers = [
      "Order ID",
      "Customer",
      "Customer Email",
      "Products",
      "Quantity",
      "Delivered Quantity",
      "Order Value",
      "Delivered Revenue",
      "Pending Delivery Value",
      "Order Status",
      "Payment Status",
      "Date",
    ];

    const rows = report.recentSales.map((sale) => [
      sale.orderId,
      sale.customer?.name || "Customer",
      sale.customer?.email || "",
      sale.items
        .map((item) => getProductName(item.product))
        .join(" | "),
      sale.productsSold,
      sale.deliveredProductsSold,
      sale.orderValue,
      sale.deliveredRevenue,
      sale.pendingDeliveryValue,
      sale.orderStatus,
      sale.paymentStatus,
      formatDate(sale.createdAt),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const safeValue = String(value ?? "").replace(/"/g, '""');
            return `"${safeValue}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `nexora-sales-report-page-${page}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (loading && !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Generating your sales report...
          </p>
        </div>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
            !
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load report
          </h2>

          <p className="mt-2 text-sm text-red-500">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const {
    summary,
    orderStatus,
    salesOverview,
    productPerformance,
    bestSellingProducts,
    lowStockProducts,
    recentSales,
    pagination,
  } = report;

  const summaryCards = [
    {
      title: "Delivered Revenue",
      value: formatCurrency(summary.totalRevenue),
      description: "Revenue from delivered products",
      icon: "৳",
      style: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending Delivery Value",
      value: formatCurrency(summary.pendingDeliveryValue),
      description: "Not yet delivered or cancelled",
      icon: "◷",
      style: "bg-amber-50 text-amber-600",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders,
      description: "Excluding fully cancelled orders",
      icon: "▤",
      style: "bg-blue-50 text-blue-600",
    },
    {
      title: "Products Sold",
      value: summary.totalProductsSold,
      description: "Delivered product quantities",
      icon: "▣",
      style: "bg-violet-50 text-violet-600",
    },
    {
      title: "Delivered Orders",
      value: summary.deliveredOrders,
      description: "Vendor orders with all active items delivered",
      icon: "✓",
      style: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "In Transit",
      value: summary.inTransitOrders,
      description: "Processing + Shipped orders",
      icon: "⇧",
      style: "bg-cyan-50 text-cyan-600",
    },
  ];

  const statuses = [
    { name: "Pending", key: "pending", color: "bg-amber-500" },
    { name: "Confirmed", key: "confirmed", color: "bg-blue-500" },
    { name: "Processing", key: "processing", color: "bg-indigo-500" },
    { name: "Shipped", key: "shipped", color: "bg-purple-500" },
    { name: "Delivered", key: "delivered", color: "bg-emerald-500" },
    { name: "Cancelled", key: "cancelled", color: "bg-red-500" },
  ] as const;

  const totalStatusOrders = Object.values(orderStatus).reduce(
    (total, value) => total + value,
    0
  );

  const maxRevenue = Math.max(
    ...salesOverview.map((item) => item.revenue),
    1
  );

  return (
    <>
      {/* Print styles: hide the entire website layout and print only this report */}
      <style>
        {`
          @media print {
            @page {
              size: A4 landscape;
              margin: 12mm;
            }

            html,
            body,
            #root {
              width: 100% !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
            }

            body * {
              visibility: hidden !important;
            }

            .sales-report-print,
            .sales-report-print * {
              visibility: visible !important;
            }

            .sales-report-print {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 100% !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              background: #ffffff !important;
              box-shadow: none !important;
              overflow: visible !important;
            }

            .sales-report-print .no-print {
              display: none !important;
            }

            .sales-report-print table {
              width: 100% !important;
              border-collapse: collapse !important;
            }

            .sales-report-print tr {
              break-inside: avoid !important;
            }

            .sales-report-print img {
              max-width: 100% !important;
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            .sales-report-print * {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
          }
        `}
      </style>

      <div className="sales-report-print min-h-screen bg-[#f6f7fb] p-4 sm:p-6 lg:p-8 print:bg-white print:p-0">
        <div className="mx-auto max-w-7xl space-y-7 print:space-y-4">

          {/* Report Header */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center print:flex-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Nexora Vendor Analytics
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                Sales Report
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor your revenue, product performance and order fulfillment.
              </p>
            </div>

            <div className="no-print flex flex-wrap gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span>↓</span>
                Export CSV
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
              >
                <span>▣</span>
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {card.title}
                    </p>

                    <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl font-bold ${card.style}`}
                  >
                    {card.icon}
                  </div>
                </div>

                <p className="mt-4 text-xs font-medium text-slate-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Report Filters
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select a date range and sales chart period.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <label className="text-xs font-bold text-slate-500">
                  Start Date

                  <input
                    type="date"
                    value={startDate}
                    max={endDate || undefined}
                    onChange={(event) => {
                      setStartDate(event.target.value);
                      setPage(1);
                    }}
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="text-xs font-bold text-slate-500">
                  End Date

                  <input
                    type="date"
                    value={endDate}
                    min={startDate || undefined}
                    onChange={(event) => {
                      setEndDate(event.target.value);
                      setPage(1);
                    }}
                    className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <button
                  onClick={handleClearFilters}
                  className="self-end rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="no-print text-right text-xs font-medium text-indigo-600">
              Updating report...
            </div>
          )}

          {error && (
            <div className="no-print rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Sales Overview and Order Status */}
          <div className="grid gap-6 xl:grid-cols-3">

            {/* Sales Chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Sales Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Revenue from delivered products.
                  </p>
                </div>

                <div className="no-print flex w-fit rounded-xl bg-slate-100 p-1">
                  {(["daily", "weekly", "monthly"] as Period[]).map(
                    (item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setPeriod(item);
                          setPage(1);
                        }}
                        className={`rounded-lg px-3 py-2 text-xs font-bold capitalize transition ${
                          period === item
                            ? "bg-white text-indigo-700 shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-8 flex h-64 items-end gap-2 border-b border-l border-slate-100 px-2 pb-2 sm:gap-4 sm:px-4">
                {salesOverview.length === 0 ? (
                  <div className="flex w-full items-center justify-center text-sm text-slate-400">
                    No delivered revenue data for this period.
                  </div>
                ) : (
                  salesOverview.map((item) => (
                    <div
                      key={item.date}
                      className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-3"
                    >
                      <div className="flex h-full w-full items-end justify-center">
                        <div
                          title={`${formatCurrency(item.revenue)} | ${item.orders} orders | ${item.productsSold} products`}
                          className="w-full max-w-12 rounded-t-lg bg-indigo-500"
                          style={{
                            height:
                              item.revenue > 0
                                ? `${Math.max(
                                    (item.revenue / maxRevenue) * 100,
                                    4
                                  )}%`
                                : "0%",
                          }}
                        />
                      </div>

                      <span className="max-w-full truncate text-[10px] font-semibold text-slate-400 sm:text-xs">
                        {item.date}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-semibold text-emerald-600">
                    Total Delivered Revenue
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    {formatCurrency(summary.totalRevenue)}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-600">
                    Pending Delivery Value
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    {formatCurrency(summary.pendingDeliveryValue)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Vendor-specific order distribution.
              </p>

              <div className="mt-7 space-y-5">
                {statuses.map((item) => {
                  const count = orderStatus[item.key];

                  const percentage =
                    totalStatusOrders > 0
                      ? (count / totalStatusOrders) * 100
                      : 0;

                  return (
                    <div key={item.key}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-600">
                          {item.name}
                        </span>

                        <span className="text-sm font-bold text-slate-900">
                          {count}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      <p className="mt-1 text-right text-[10px] text-slate-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">All vendor orders</span>

                  <span className="font-bold text-slate-900">
                    {totalStatusOrders}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Performance */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Product Performance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Revenue and delivered quantity for each product.
                </p>
              </div>

              <span className="w-fit rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
                {productPerformance.length} Products
              </span>
            </div>

            {productPerformance.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No delivered product sales yet.
              </div>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="rounded-l-lg px-4 py-4">Product</th>
                      <th className="px-4 py-4">Quantity Sold</th>
                      <th className="rounded-r-lg px-4 py-4">Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productPerformance.map((product) => (
                      <tr
                        key={product.productId}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.productName}
                                className="h-12 w-12 rounded-lg border border-slate-100 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-lg text-slate-400">
                                ▣
                              </div>
                            )}

                            <span className="font-semibold text-slate-800">
                              {product.productName}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-700">
                          {product.quantitySold}
                        </td>

                        <td className="px-4 py-4 font-bold text-emerald-600">
                          {formatCurrency(product.revenue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Best Selling and Low Stock */}
          <div className="grid gap-6 xl:grid-cols-2">

            {/* Best Selling Products */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Best Selling Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Top 5 products by delivered quantity.
                </p>
              </div>

              {bestSellingProducts.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No best-selling products available yet.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {bestSellingProducts.map((product, index) => (
                    <div
                      key={product.productId}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-extrabold text-indigo-600">
                        {index + 1}
                      </span>

                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.productName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          ▣
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {product.productName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {product.quantitySold} units sold
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-bold text-emerald-600">
                        {formatCurrency(product.revenue)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low Stock Products */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Low Stock Alerts
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Products with stock of 5 or less.
                  </p>
                </div>

                <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                  {lowStockProducts.length} Alerts
                </span>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="py-12 text-center text-sm text-emerald-600">
                  All active products have sufficient stock.
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                          ▣
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {formatCurrency(product.price)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className={`text-sm font-extrabold ${
                            product.stock <= 2
                              ? "text-red-600"
                              : "text-amber-600"
                          }`}
                        >
                          {product.stock} left
                        </p>

                        <p className="text-[10px] font-medium text-slate-400">
                          Stock
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Sales */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Recent Sales
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Vendor-specific order and product activity.
                </p>
              </div>

              <span className="w-fit rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
                {pagination.totalRecords} Records
              </span>
            </div>

            {recentSales.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                  ▤
                </div>

                <h3 className="mt-4 font-bold text-slate-800">
                  No sales found
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Try changing your date filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4 font-bold">Order ID</th>
                      <th className="px-5 py-4 font-bold">Customer</th>
                      <th className="px-5 py-4 font-bold">Products</th>
                      <th className="px-5 py-4 font-bold">Quantity</th>
                      <th className="px-5 py-4 font-bold">Delivered Revenue</th>
                      <th className="px-5 py-4 font-bold">Pending Value</th>
                      <th className="px-5 py-4 font-bold">Status</th>
                      <th className="px-5 py-4 font-bold">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentSales.map((sale) => (
                      <tr
                        key={sale.orderId}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-bold text-slate-700">
                          #{sale.orderId.slice(-6).toUpperCase()}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {sale.customer?.name || "Customer"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {sale.customer?.email || ""}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-slate-600">
                          <div className="space-y-2">
                            {sale.items.map((item, index) => (
                              <div key={`${sale.orderId}-${index}`}>
                                <p className="font-medium">
                                  {getProductName(item.product)}
                                </p>

                                <span
                                  className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-bold capitalize ring-1 ring-inset ${
                                    statusStyles[item.itemStatus || "pending"] ||
                                    "bg-slate-100 text-slate-600 ring-slate-200"
                                  }`}
                                >
                                  {item.itemStatus || "pending"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-700">
                            {sale.productsSold}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Delivered: {sale.deliveredProductsSold}
                          </p>
                        </td>

                        <td className="px-5 py-4 font-bold text-emerald-600">
                          {formatCurrency(sale.deliveredRevenue)}
                        </td>

                        <td className="px-5 py-4 font-semibold text-amber-600">
                          {formatCurrency(sale.pendingDeliveryValue)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${
                              statusStyles[sale.orderStatus] ||
                              "bg-slate-100 text-slate-600 ring-slate-200"
                            }`}
                          >
                            {sale.orderStatus}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                          {formatDate(sale.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="no-print flex flex-col justify-between gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center">
                <p className="text-xs text-slate-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  {" · "}
                  {pagination.totalRecords} total records
                </p>

                <div className="flex items-center gap-2">
                  <button
                    disabled={!pagination.hasPreviousPage || loading}
                    onClick={() => setPage((current) => current - 1)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    disabled={!pagination.hasNextPage || loading}
                    onClick={() => setPage((current) => current + 1)}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Report Footer - This belongs to the report itself */}
          <div className="flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
            <p className="font-semibold">
              Nexora Vendor Sales Report
            </p>

            <p>
              Generated on {new Date().toLocaleString("en-BD")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesReport;
