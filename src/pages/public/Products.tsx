
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";
import { getProducts } from "../../services/productApi";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug: string;
  };
};

const PAGE_SIZE = 9;

const Products = () => {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    () => searchParams.get("search") || ""
  );
  const [category, setCategory] = useState(
    () => searchParams.get("category") || "All"
  );
  const [sort, setSort] = useState("default");
  const [brand, setBrand] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();
        const productData = response.data;

        if (!Array.isArray(productData)) {
          throw new Error("Unexpected products API response.");
        }

        setProducts(productData);

        const prices = productData
          .map((product: Product) => Number(product.price))
          .filter((price: number) => Number.isFinite(price));

        setMinPrice(prices.length ? Math.min(...prices) : 0);
        setMaxPrice(prices.length ? Math.max(...prices) : 0);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.category?.name)
            .filter((name): name is string => Boolean(name))
        )
      ).sort(),
    [products]
  );

  const brands = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.brand?.name)
            .filter((name): name is string => Boolean(name))
        )
      ).sort(),
    [products]
  );

  const priceBounds = useMemo(() => {
    const prices = products
      .map((product) => Number(product.price))
      .filter((price) => Number.isFinite(price));

    return {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const query = search.trim().toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (product) => product.category?.name === category
      );
    }

    if (brand !== "All") {
      result = result.filter(
        (product) => product.brand?.name === brand
      );
    }

    result = result.filter(
      (product) =>
        Number(product.price) >= minPrice &&
        Number(product.price) <= maxPrice
    );

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    products,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    sort,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, brand, minPrice, maxPrice, sort]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <main className="min-h-screen bg-[#f7f9fc]">
      {/* Page Heading */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6 lg:px-10">
          <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-800">
              {category === "All" ? "Products" : category}
            </span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#10172b]">
                {category === "All" ? "All Products" : category}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {loading
                  ? "Loading products..."
                  : `Showing ${filteredProducts.length} of ${products.length} products`}
              </p>
            </div>

            <div className="text-sm text-slate-500">
              {brand !== "All" && (
                <span>
                  Brand: <strong>{brand}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Layout */}
      <section className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">

          {/* Sidebar Filters */}
          <ProductFilter
            search={search}
            category={category}
            sort={sort}
            brand={brand}
            minPrice={minPrice}
            maxPrice={maxPrice}
            categories={categories}
            brands={brands}
            priceBounds={priceBounds}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onSortChange={setSort}
            onBrandChange={setBrand}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
          />

          {/* Product Results */}
          <div className="min-w-0">
            {/* Results Toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                {loading
                  ? "Loading products..."
                  : `${filteredProducts.length} products found`}
              </p>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <span>Sort by</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="default">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </label>
            </div>

            {loading && (
              <div className="flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white">
                <p className="text-sm text-slate-500">
                  Loading products...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-red-200 bg-white p-6 text-center">
                <p className="text-sm text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-md bg-[#10172b] px-4 py-2 text-sm text-white"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="flex min-h-80 items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center">
                <div>
                  <h2 className="font-bold text-[#10172b]">
                    No products found
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Try changing your search or filters.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                      setBrand("All");
                      setSort("default");
                      setMinPrice(priceBounds.min);
                      setMaxPrice(priceBounds.max);
                    }}
                    className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && visibleProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      category={product.category?.name || "Uncategorized"}
                      price={product.price}
                      image={product.images?.[0]}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`h-9 min-w-9 rounded-lg border px-3 text-sm ${
                          currentPage === page
                            ? "border-blue-600 bg-blue-600 font-semibold text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-blue-500"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        setCurrentPage((page) =>
                          Math.min(totalPages, page + 1)
                        )
                      }
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:border-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Products;
