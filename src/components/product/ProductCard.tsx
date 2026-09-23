import { Link } from "react-router-dom";

type ProductCardProps = {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  rating?: number;
};

const ProductCard = ({
  id,
  name,
  category,
  price,
  image,
  rating = 4.5,
}: ProductCardProps) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image */}
      <Link to={`/products/${id}`}>
        <div className="relative flex h-56 items-center justify-center bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-sm text-gray-400">Product Image</span>
          )}

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 rounded-full bg-white p-2 text-lg shadow-sm transition hover:bg-gray-100"
            onClick={(event) => event.preventDefault()}
          >
            ♡
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5">
        <p className="text-xs font-medium text-gray-500">
          {category}
        </p>

        <Link to={`/products/${id}`}>
          <h3 className="mt-2 line-clamp-2 min-h-12 font-semibold text-gray-900 hover:text-gray-600">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-yellow-500">★</span>

          <span className="text-sm font-medium text-gray-700">
            {rating}
          </span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">
            ৳{price.toLocaleString()}
          </p>

          <button
            type="button"
            className="rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;