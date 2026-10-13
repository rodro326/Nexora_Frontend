
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getProducts } from "../../services/productApi";
import api from "../../services/api";

type Product = {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  category?: { name: string };
};

type Category = {
  _id: string;
  name: string;
};

type Brand = {
  _id: string;
  name: string;
  slug?: string;
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const results = await Promise.allSettled([
          getProducts(),
          api.get("/categories"),
          api.get("/brands"),
        ]);

        if (!active) return;

        if (results[0].status === "fulfilled") {
          setProducts(results[0].value.data || []);
        } else {
          setError("Products could not be loaded.");
        }

        if (results[1].status === "fulfilled") {
          setCategories(results[1].value.data.data || []);
        }

        if (results[2].status === "fulfilled") {
          setBrands(results[2].value.data.data || []);
        }
      } catch (err) {
        console.error("Home page loading error:", err);
        if (active) setError("Unable to load store data.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const categorySymbols = ["▯", "▱", "♬", "⌑", "◷", "◎"];

  return (
    <main className="bg-[#f7f9fc] text-[#10172b]">
      <section className="bg-[#10172b] text-white">
        <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.9fr] lg:px-14">
          <div>
            <span className="rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold">
              LAUNCH DROP SALE
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-[54px]">
              MacBook Pro M3 Max.
              <span className="block">Unprecedented Power.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Scale your productivity with premium technology and
              high-performance certified vendors on Nexora.
            </p>
            <div className="mt-7 flex flex-wrap gap-8">
              <Link to="/products" className="text-sm font-semibold hover:text-blue-400">
                Explore Exclusive Deal
              </Link>
              <Link to="/vendor/register" className="text-sm font-semibold hover:text-blue-400">
                Learn Vendor Terms →
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl bg-[#202a40]">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=85"
              alt="Premium laptop"
              className="h-[250px] w-full object-cover sm:h-[330px]"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f7f9fc]">
        <div className="mx-auto max-w-[1400px] px-6 py-7 sm:px-8 lg:px-14">
          <h2 className="text-lg font-extrabold">Trending Categories</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category, index) => (
              <Link
                key={category._id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="flex min-h-[60px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 hover:border-blue-300 hover:shadow-sm"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-xl font-bold text-blue-600">
                  {categorySymbols[index % categorySymbols.length]}
                </span>
                <span className="text-xs font-bold">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-14">
          <h2 className="text-base font-extrabold">Deals of the Day</h2>
          <Link to="/products" className="text-xs font-semibold text-blue-600">
            View All Deals →
          </Link>
        </div>
      </section>

      <section className="bg-[#f7f9fc]">
        <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-8 lg:px-14">
          <h2 className="mb-5 text-lg font-extrabold">
            Featured Products on Nexora
          </h2>

          {loading ? (
            <p className="py-10 text-sm text-slate-500">Loading products...</p>
          ) : error ? (
            <p className="py-10 text-sm text-red-600">{error}</p>
          ) : products.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  category={product.category?.name || "Electronics"}
                  price={product.price}
                  image={product.images?.[0]}
                />
              ))}
            </div>
          ) : (
            <p className="py-10 text-sm text-slate-500">No products available.</p>
          )}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 py-7 sm:px-8 lg:px-14">
          <h2 className="text-center text-sm font-extrabold">
            Official Premium Brand Partners
          </h2>
          <div className="mx-auto mt-5 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => (
              <Link
                key={brand._id}
                to={`/products?brand=${encodeURIComponent(brand.slug || brand.name)}`}
                className="rounded-md bg-[#f7f9fc] px-3 py-3 text-center text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
