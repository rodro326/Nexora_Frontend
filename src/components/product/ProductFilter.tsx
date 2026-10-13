
type ProductFilterProps = {
  search: string;
  category: string;
  sort: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  categories: string[];
  brands: string[];
  priceBounds: {
    min: number;
    max: number;
  };
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
};

const ProductFilter = ({
  search,
  category,
  sort,
  brand,
  minPrice,
  maxPrice,
  categories,
  brands,
  priceBounds,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
}: ProductFilterProps) => {
  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-base font-bold text-[#10172b]">
        Filter Products
      </h2>

      <div className="my-5 border-t border-slate-100" />

      {/* Search */}
      <div className="mb-6">
        <label className="mb-2 block text-xs font-bold text-[#10172b]">
          SEARCH
        </label>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold text-[#10172b]">
          PRICE RANGE
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs text-slate-500">
            Min price
            <input
              type="number"
              min={priceBounds.min}
              max={maxPrice}
              value={minPrice}
              onChange={(event) =>
                onMinPriceChange(
                  Math.min(Number(event.target.value), maxPrice)
                )
              }
              className="mt-1 w-full rounded border border-slate-200 px-2 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            />
          </label>

          <label className="text-xs text-slate-500">
            Max price
            <input
              type="number"
              min={minPrice}
              max={priceBounds.max}
              value={maxPrice}
              onChange={(event) =>
                onMaxPriceChange(
                  Math.max(Number(event.target.value), minPrice)
                )
              }
              className="mt-1 w-full rounded border border-slate-200 px-2 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span>{minPrice.toLocaleString()}</span>
          <span>{maxPrice.toLocaleString()}</span>
        </div>

        <button
          type="button"
          onClick={() => {
            onMinPriceChange(priceBounds.min);
            onMaxPriceChange(priceBounds.max);
          }}
          className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          Reset price
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold text-[#10172b]">
          CATEGORIES
        </h3>

        <div className="space-y-2">
          {["All", ...categories].map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="radio"
                name="product-category"
                checked={category === item}
                onChange={() => onCategoryChange(item)}
                className="accent-blue-600"
              />
              {item === "All" ? "All Categories" : item}
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold text-[#10172b]">
          BRANDS
        </h3>

        <div className="space-y-2">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="radio"
              name="product-brand"
              checked={brand === "All"}
              onChange={() => onBrandChange("All")}
              className="accent-blue-600"
            />
            All Brands
          </label>

          {brands.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="radio"
                name="product-brand"
                checked={brand === item}
                onChange={() => onBrandChange(item)}
                className="accent-blue-600"
              />
              {item}
            </label>
          ))}
        </div>
      </div>


      {/* Device Color */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold text-[#10172b]">
          DEVICE COLOR
        </h3>

        <div className="flex flex-wrap gap-2">
          {[
            { name: "Black", value: "#111827" },
            { name: "Gray", value: "#64748b" },
            { name: "Silver", value: "#d1d5db" },
            { name: "Orange", value: "#ea580c" },
            { name: "Blue", value: "#2563eb" },
          ].map((color) => (
            <button
              key={color.name}
              type="button"
              title={color.name}
              aria-label={color.name}
              className="h-5 w-5 rounded-full border border-slate-300 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{ backgroundColor: color.value }}
              onClick={() => {
                console.log("Selected device color:", color.name);
              }}
            />
          ))}
        </div>
      </div>

      {/* Storage Size */}
      <div className="mb-6">
        <h3 className="mb-3 text-xs font-bold text-[#10172b]">
          STORAGE SIZE
        </h3>

        <div className="space-y-2">
          {["128 GB", "256 GB", "512 GB", "1 TB"].map((storage) => (
            <label
              key={storage}
              className="flex cursor-pointer items-center gap-2 text-sm text-slate-600"
            >
              <input
                type="checkbox"
                className="rounded border-slate-300 accent-blue-600"
                onChange={(event) => {
                  console.log(
                    "Storage selection:",
                    storage,
                    event.target.checked
                  );
                }}
              />
              {storage}
            </label>
          ))}
        </div>
      </div>


      {/* Sort */}
      <div>
        <h3 className="mb-3 text-xs font-bold text-[#10172b]">
          SORT PRODUCTS
        </h3>

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="w-full rounded-md border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="default">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>
    </aside>
  );
};

export default ProductFilter;
