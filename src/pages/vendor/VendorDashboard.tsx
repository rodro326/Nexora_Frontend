import { Link, useLocation } from "react-router-dom";


const VendorDashboard = () => {
  const location = useLocation();

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
    { label: "Analytics", path: "/vendor/analytics", icon: "▥" },
    { label: "Notifications", path: "/vendor/notifications", icon: "♧" },
    { label: "Settings", path: "/vendor/settings", icon: "⚙" },
  ];

  return (

    <div className="min-h-screen bg-[#f7f8fc]">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 bg-[#071226] text-white lg:block">
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
            ? "bg-violet-600 text-white"
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

      <div className="min-h-screen lg:pl-56">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <input
            type="search"
            placeholder="Search products, orders, customers..."
            className="w-full max-w-md rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-violet-400"
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

        <main className="space-y-6 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Dashboard
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Welcome back! Here&apos;s your store overview.
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
            >
              This Week ▾
            </button>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { title: "Total Sales", value: "—", icon: "🛒", color: "violet" },
              { title: "Total Orders", value: "—", icon: "▣", color: "blue" },
              { title: "Total Products", value: "—", icon: "▦", color: "emerald" },
              { title: "Total Revenue", value: "—", icon: "৳", color: "amber" },
              { title: "Pending Orders", value: "—", icon: "◷", color: "orange" },
              { title: "Low Stock Items", value: "—", icon: "⚠", color: "rose" },
            ].map((card) => (
              <article
                key={card.title}
                className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-${card.color}-50 text-xl text-${card.color}-600`}
                >
                  {card.icon}
                </div>
                <div>
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2">
              <h3 className="font-bold text-slate-900">Sales Overview</h3>
              <div className="flex min-h-64 items-center justify-center text-center">
                <p className="max-w-sm text-sm text-slate-500">
                  Sales analytics will appear here when the vendor analytics
                  API is connected.
                </p>
              </div>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">Recent Orders</h3>
              <div className="flex min-h-64 items-center justify-center text-center">
                <p className="text-sm text-slate-500">
                  Order data will appear here when connected.
                </p>
              </div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">Low Stock Alerts</h3>
              <p className="mt-3 text-sm text-slate-500">
                Inventory alerts will appear here when connected.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">Top Selling Products</h3>
              <p className="mt-3 text-sm text-slate-500">
                Sales rankings will appear here when connected.
              </p>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default VendorDashboard;