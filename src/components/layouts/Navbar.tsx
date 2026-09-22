const Navbar = () => {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Nexora
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Home
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Products
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Categories
          </a>

          <a
            href="#"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Brands
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:block"
          >
            Login
          </button>

          <button
            type="button"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Cart
          </button>

          {/* Mobile Menu */}
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 md:hidden"
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