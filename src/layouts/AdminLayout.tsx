
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const menuItems = [
  { label: "Overview", path: "/admin/dashboard", icon: "▦" },
  { label: "Vendors", path: "/admin/vendors", icon: "♙" },
  { label: "Customers", path: "/admin/customers", icon: "♧" },
  { label: "Products", path: "/admin/products", icon: "▣" },
  { label: "Orders", path: "/admin/orders", icon: "▤" },
  { label: "Categories", path: "/admin/categories", icon: "◈" },
  { label: "Transactions", path: "/admin/transactions", icon: "＄" },
  { label: "Withdrawals", path: "/admin/withdrawals", icon: "↗" },
  { label: "Analytics", path: "/admin/analytics", icon: "▥" },
  { label: "Coupons", path: "/admin/coupons", icon: "◇" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-7">
          <div>
            <h1 className="text-2xl font-bold tracking-wide">
              Nexora<span className="text-violet-400">.</span>
            </h1>
            <p className="mt-1 text-xs text-slate-400">ADMIN CONTROL PANEL</p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl text-slate-400 lg:hidden"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-6">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-lg font-bold">
                A
              </div>
              <div>
                <p className="font-semibold">Administrator</p>
                <p className="text-xs text-slate-400">Platform Manager</p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            System
          </p>

          <NavLink
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="w-5 text-center text-lg">⚙</span>
            Settings
          </NavLink>
        </nav>

        <div className="border-t border-white/10 p-5">
          <p className="text-xs text-slate-500">
            Nexora Admin Panel
          </p>
          <p className="mt-1 text-xs text-slate-600">
            © 2026 Nexora. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="min-h-screen lg:pl-72">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-2xl text-slate-700 lg:hidden"
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Nexora Admin
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your multi-vendor platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-600 hover:bg-slate-200"
              title="Notifications"
            >
              ♧
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  Admin
                </p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
