type ProductFilterProps = {
  search: string;
  category: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

const ProductFilter = ({
  search,
  category,
  sort,
  onSearchChange,
  onCategoryChange,
  onSortChange,
}: ProductFilterProps) => {
  return (
    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
        >
          <option value="all">All Categories</option>
          <option value="Smartphones">Smartphones</option>
          <option value="Laptops">Laptops</option>
          <option value="Tablets">Tablets</option>
          <option value="Audio">Audio</option>
          <option value="Gaming">Gaming</option>
          <option value="Accessories">Accessories</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
        >
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;