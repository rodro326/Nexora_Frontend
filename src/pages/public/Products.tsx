import { useMemo, useState } from "react";
import ProductGrid from "../../components/product/ProductGrid";
import ProductFilter from "../../components/product/ProductFilter";

const products = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "Smartphones",
    price: 149999,
    rating: 4.8,
  },
  {
    id: "macbook-pro",
    name: "MacBook Pro",
    category: "Laptops",
    price: 189999,
    rating: 4.9,
  },
  {
    id: "sony-headphones",
    name: "Sony Wireless Headphones",
    category: "Audio",
    price: 32999,
    rating: 4.7,
  },
  {
    id: "gaming-laptop",
    name: "Premium Gaming Laptop",
    category: "Gaming",
    price: 129999,
    rating: 4.6,
  },
  {
    id: "ipad-pro",
    name: "iPad Pro",
    category: "Tablets",
    price: 119999,
    rating: 4.8,
  },
  {
    id: "samsung-s25",
    name: "Samsung Galaxy S25 Ultra",
    category: "Smartphones",
    price: 139999,
    rating: 4.7,
  },
  {
    id: "airpods-pro",
    name: "AirPods Pro",
    category: "Audio",
    price: 24999,
    rating: 4.6,
  },
  {
    id: "logitech-mouse",
    name: "Logitech Wireless Mouse",
    category: "Accessories",
    price: 4999,
    rating: 4.5,
  },
];

const Products = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [search, category, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">
          Nexora Store
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          All Products
        </h1>

        <p className="mt-2 text-gray-600">
          Explore our latest technology and electronics.
        </p>
      </div>

      {/* Filters */}
      <ProductFilter
        search={search}
        category={category}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSort}
      />

      {/* Result Count */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {filteredProducts.length} products found
        </p>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <ProductGrid products={filteredProducts} />
      ) : (
        <div className="rounded-xl border border-gray-200 py-20 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No products found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Try a different search or category.
          </p>
        </div>
      )}
    </main>
  );
};

export default Products;