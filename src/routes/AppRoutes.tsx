
import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Products from "../pages/public/Products";
import ProductDetails from "../pages/public/ProductDetails";
import Categories from "../pages/public/Categories";

import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import Invoice from "../pages/customer/Invoice";

import Login from "../pages/public/Login";
import Register from "../pages/public/Register";

import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorProducts from "../pages/vendor/VendorProducts";
import AddProduct from "../pages/vendor/AddProduct";
import EditProduct from "../pages/vendor/EditProduct";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/categories" element={<Categories />} />

      {/* Customer Routes */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders/:orderId/invoice" element={<Invoice />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Vendor Routes */}
      <Route
        path="/vendor/dashboard"
        element={<VendorDashboard />}
      />

      <Route
        path="/vendor/products"
        element={<VendorProducts />}
      />

      <Route
        path="/vendor/products/new"
        element={<AddProduct />}
      />

      <Route
        path="/vendor/products/edit/:id"
        element={<EditProduct />}
      />

      <Route
        path="/vendor/orders"
        element={<VendorDashboard />}
      />

      <Route
        path="/vendor/sales-report"
        element={<VendorDashboard />}
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          path="dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="analytics"
          element={<AdminDashboard />}
        />
      </Route>

    </Routes>
  );
}

export default AppRoutes;
