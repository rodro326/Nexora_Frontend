import { useEffect, useMemo, useState } from "react";
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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts();

        setProducts(response.data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category?.name)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const searchTerm = search.toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
    }

    if (category !== "All") {
      result = result.filter(
        (product) => product.category?.name === category
      );
    }

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">Nexora Store</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          All Products
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Explore the latest technology products from Nexora.
        </p>
      </div>

      <ProductFilter
  search={search}
  category={category}
  sort={sort}
  onSearchChange={setSearch}
  onCategoryChange={setCategory}
  onSortChange={setSort}
/>

      {loading && (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">Loading products...</p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-sm text-gray-500">
            No products found.
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
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
      )}
    </main>
  );
};

export default Products;