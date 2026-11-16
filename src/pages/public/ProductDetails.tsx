import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { addToCartApi } from "../../services/cartApi";

const ProductDetails = () => {
  const { id } = useParams();

  const addToCart = useCartStore((state) => state.addToCart);

  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    if (!id) {
      alert("Product ID not found");
      return;
    }

    try {
      setLoading(true);

      // Add product to backend cart
      await addToCartApi(id, quantity);

      // Update local Zustand cart
      addToCart({
        id,
        name: "iPhone 16 Pro Max",
        price: 149999,
      });

      alert("Product added to cart successfully!");
    } catch (error: any) {
      console.error("Failed to add product to cart:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to add product to cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/products"
        className="text-sm font-medium text-gray-500 hover:text-black"
      >
        ← Back to Products
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Product Image */}
        <div className="flex min-h-[450px] items-center justify-center rounded-2xl bg-gray-100">
          <span className="text-gray-400">Product Image</span>
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500">
            Smartphones
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            iPhone 16 Pro Max
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">4.8</span>
            <span className="text-gray-500">(124 reviews)</span>
          </div>

          <p className="mt-6 text-3xl font-bold text-gray-900">
            ৳149,999
          </p>

          <p className="mt-6 leading-7 text-gray-600">
            Experience powerful performance, premium design, and advanced
            technology with this product.
          </p>

          {/* Quantity */}
          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Quantity
            </p>

            <div className="flex w-fit items-center rounded-lg border border-gray-200">
              <button
                type="button"
                onClick={decreaseQuantity}
                className="px-4 py-2 text-lg hover:bg-gray-100"
              >
                −
              </button>

              <span className="px-5 py-2 font-medium">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                className="px-4 py-2 text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>

            <button
              type="button"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-100"
            >
              ♡ Add to Wishlist
            </button>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Product ID: {id}
          </p>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;