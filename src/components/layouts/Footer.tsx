
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#10172b] text-white">
      <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.15fr] lg:gap-12">

          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-extrabold">
              Nexora
            </Link>

            <p className="mt-4 max-w-xs text-xs leading-6 text-slate-400">
              Premium multi-vendor platform presenting cutting-edge
              consumer tech, certified storefronts, and reliable delivery.
            </p>

            <p className="mt-3 text-[11px] font-medium text-blue-500">
              Your Technology. Your World.
            </p>
          </div>

          {/* Shop Products */}
          <div>
            <h3 className="text-xs font-bold">Shop Products</h3>

            <ul className="mt-3 space-y-2.5 text-xs text-slate-400">
              {[
                "Smartphones",
                "High-End Laptops",
                "Pro Audio",
                "Gaming Consoles",
                "Smartwatches",
                "Action Cameras",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to={`/products?category=${encodeURIComponent(item)}`}
                    className="transition hover:text-white"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-xs font-bold">Help &amp; Support</h3>

            <ul className="mt-3 space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/products" className="hover:text-white">
                  Nexora Safety Guarantee
                </Link>
              </li>
              <li>
                <Link to="/vendor/register" className="hover:text-white">
                  Vendor Registration
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white">
                  Shipping &amp; Track Order
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white">
                  Secure Checkout Support
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white">
                  Refunds &amp; Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs font-bold">Join the Vanguard</h3>

            <p className="mt-3 text-xs leading-5 text-slate-400">
              Get notified on global electronics product drops,
              private deals, and premium vendor stores.
            </p>

            <form
              className="mt-4 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                className="min-w-0 flex-1 rounded bg-[#202a40] px-3 py-2.5 text-xs text-white outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500"
              />

              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2.5 text-xs font-bold transition hover:bg-blue-700"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-9 flex flex-col gap-4 border-t border-white/10 pt-6 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Nexora Inc. All certified assets protected.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link to="/" className="hover:text-white">
              Privacy Protocol
            </Link>
            <Link to="/" className="hover:text-white">
              System Agreement
            </Link>
            <Link to="/" className="hover:text-white">
              Platform Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
