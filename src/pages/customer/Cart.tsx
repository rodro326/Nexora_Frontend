import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";


const Cart = () => {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = items.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
            🛒
          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-2 max-w-md text-sm text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-500">Nexora Store</p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Shopping Cart
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review your items before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="hidden border-b border-gray-200 px-6 py-4 text-sm font-medium text-gray-500 sm:grid sm:grid-cols-12">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 p-5 last:border-b-0 sm:px-6"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
                  {/* Product */}
                  <div className="flex items-center gap-4 sm:col-span-6">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">
                          No Image
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-900">
                        {item.name}
                      </h2>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="mt-2 text-xs font-medium text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between sm:col-span-2 sm:block sm:text-center">
                    <span className="text-sm text-gray-500 sm:hidden">
                      Price
                    </span>

                    <span className="text-sm font-medium text-gray-900">
                      ৳{item.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between sm:col-span-2 sm:block">
                    <span className="text-sm text-gray-500 sm:hidden">
                      Quantity
                    </span>

                    <div className="flex w-fit items-center rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="px-3 py-1.5 text-lg hover:bg-gray-100"
                      >
                        −
                      </button>

                      <span className="min-w-9 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="px-3 py-1.5 text-lg hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="flex items-center justify-between sm:col-span-2 sm:block sm:text-right">
                    <span className="text-sm text-gray-500 sm:hidden">
                      Total
                    </span>

                    <span className="font-semibold text-gray-900">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/products"
            className="mt-5 inline-flex text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-900">
                  ৳{shipping.toLocaleString()}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>

                  <span className="text-xl font-bold text-gray-900">
                    ৳{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Link
  to="/checkout"
  className="mt-6 block w-full rounded-lg bg-black px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-800"
>
  Proceed to Checkout
</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;