
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useCartStore } from "../../store/cartStore";

type Category = {
  _id: string;
  name: string;
};

const Navbar = () => {
  const cartItems = useCartStore((state) => state.items);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        const data = response.data?.data;

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected categories response:", response.data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#10172b] text-white shadow-sm">

      {/* Top Information Bar */}
      <div className="hidden border-b border-white/10 bg-[#202b3e] sm:block">
        <div className="mx-auto flex h-10 max-w-[1720px] items-center justify-between px-6 lg:px-12">
          <p className="text-sm text-slate-400">
            Nexora Premium Multi-Vendor Platform
          </p>

          <p className="text-sm font-medium text-white">
            Your Technology. Your World.
          </p>

          <p className="text-sm text-slate-400">
            Support: 24/7 Helpline
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex h-20 max-w-[1720px] items-center gap-5 px-4 sm:px-6 lg:gap-8 lg:px-12">

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="shrink-0 text-2xl text-white hover:text-blue-400 md:hidden"
          >
            ☰
          </button>

          {/* Desktop Categories Button */}
          <Link
            to="/products"
            className="hidden shrink-0 text-2xl text-white hover:text-blue-400 md:block"
            aria-label="All categories"
          >
            ☰
          </Link>

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <span className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Nexora
            </span>
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mx-auto hidden min-w-0 max-w-[600px] flex-1 md:block"
          >
            <div className="relative">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for premium electronics, brands, stores..."
                aria-label="Search products"
                className="h-12 w-full rounded-xl border border-white/5 bg-[#202b3e] px-5 pr-14 text-sm text-white outline-none placeholder:text-slate-400 focus:border-blue-500"
              />

              <button
                type="submit"
                aria-label="Search"
                className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-xl text-slate-400 hover:text-white"
              >
                ⌕
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5 lg:gap-8">

            {/* Wishlist */}
            <Link
              to="/"
              aria-label="Wishlist"
              className="flex items-center gap-2 text-sm text-white hover:text-blue-400"
            >
              <span className="text-2xl">♡</span>
              <span className="hidden lg:inline">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-sm text-white hover:text-blue-400"
            >
              <span className="text-2xl">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            </Link>

            {/* Sign In */}
            <Link
              to="/login"
              className="flex items-center gap-2 whitespace-nowrap text-sm text-white hover:text-blue-400"
            >
              <span className="text-xl">♙</span>
              <span>Sign In</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <form
          onSubmit={handleSearch}
          className="px-4 pb-4 md:hidden"
        >
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search premium electronics..."
            aria-label="Search products"
            className="h-11 w-full rounded-lg bg-[#202b3e] px-4 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500"
          />
        </form>
      </div>

      {/* Dynamic Category Navigation */}
      <div className="hidden border-b border-white/10 md:block">
        <nav className="mx-auto flex h-14 max-w-[1720px] items-center gap-8 overflow-x-auto px-6 lg:gap-10 lg:px-12">

          <Link
            to="/products"
            className="flex shrink-0 items-center gap-3 text-sm font-semibold text-white hover:text-blue-400"
          >
            <span className="text-xl text-blue-500">☰</span>
            All Categories
          </Link>

          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="shrink-0 text-sm text-slate-400 transition hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-b border-white/10 px-4 py-3 md:hidden">
          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-white/10"
          >
            All Categories
          </Link>

          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-3 text-sm text-slate-300 hover:bg-white/10"
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
