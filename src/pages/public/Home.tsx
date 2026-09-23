import ProductCard from "../../components/product/ProductCard";
const Home = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Your Technology. Your World.
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Discover Technology
              <span className="block">Made for You.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Explore the latest gadgets, electronics, and smart technology
              from trusted sellers in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/products"
                className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Shop Now
              </a>

              <a
                href="/categories"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Explore Categories
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Shop by Category
          </h2>

          <p className="mt-2 text-gray-600">
            Find the technology you need.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            "Smartphones",
            "Laptops",
            "Tablets",
            "Accessories",
            "Audio",
            "Gaming",
          ].map((category) => (
            <a
              key={category}
              href="/products"
              className="rounded-xl border border-gray-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl">
                ⚡
              </div>

              <h3 className="text-sm font-semibold text-gray-900">
                {category}
              </h3>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
  <ProductCard
    id="iphone-16-pro-max"
    name="iPhone 16 Pro Max"
    category="Smartphones"
    price={149999}
    rating={4.8}
  />

  <ProductCard
    id="macbook-pro"
    name="MacBook Pro"
    category="Laptops"
    price={189999}
    rating={4.9}
  />

  <ProductCard
    id="sony-headphones"
    name="Sony Wireless Headphones"
    category="Audio"
    price={32999}
    rating={4.7}
  />

  <ProductCard
    id="gaming-laptop"
    name="Premium Gaming Laptop"
    category="Gaming"
    price={129999}
    rating={4.6}
  />
</div>
    </main>
  );
};

export default Home;