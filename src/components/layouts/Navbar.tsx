import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Nexora
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-black">
            Home
          </Link>

          <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-black">
            Products
          </Link>

          <Link to="/categories" className="text-sm font-medium text-gray-700 hover:text-black">
            Categories
          </Link>

          <Link to="/brands" className="text-sm font-medium text-gray-700 hover:text-black">
            Brands
          </Link>
        </nav>

        {/* Search */}
        <div className="hidden flex-1 md:block">
          <div className="relative mx-auto max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 pr-10 text-sm outline-none transition focus:border-gray-400 focus:bg-white"
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          
          {/* Wishlist */}
          <button
            type="button"
            className="hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100 sm:block"
            aria-label="Wishlist"
          >
            ♡
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Cart
          </Link>

          {/* Login */}
          <Link
            to="/login"
            className="hidden rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 sm:block"
          >
            Login
          </Link>

          {/* Mobile Menu */}
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;