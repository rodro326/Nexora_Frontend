import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Products from "../pages/public/Products";
import ProductDetails from "../pages/public/ProductDetails";
import Categories from "../pages/public/Categories";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/categories" element={<div>Categories Page</div>} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={<div>Cart Page</div>} />
      <Route path="/login" element={<div>Login Page</div>} />
    </Routes>
  );
}

export default AppRoutes;