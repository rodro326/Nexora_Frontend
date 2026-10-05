import { useState } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { createOrder } from "../../services/orderApi";

const Checkout = () => {
  const items = useCartStore((state) => state.items);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shipping = items.length > 0 ? 100 : 0;
  const total = subtotal + shipping;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!formData.fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }
  
    if (!formData.phone.trim()) {
      alert("Please enter your phone number.");
      return;
    }
  
    if (!formData.email.trim()) {
      alert("Please enter your email address.");
      return;
    }
  
    if (!formData.address.trim()) {
      alert("Please enter your shipping address.");
      return;
    }
  
    if (!formData.city.trim()) {
      alert("Please enter your city.");
      return;
    }
  
    if (!formData.postalCode.trim()) {
      alert("Please enter your postal code.");
      return;
    }
  
    try {
      const order = await createOrder({
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
        paymentMethod,
      });
  
      console.log("Order Created:", order);
  
      alert("Order created successfully!");
    } catch (error) {
      console.error("Order creation failed:", error);
  
      alert("Failed to create order. Please try again.");
    }
  };

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

          <p className="mt-2 text-sm text-gray-500">
            Add some products before proceeding to checkout.
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
          Checkout
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Complete your information to place your order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact Information */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Contact Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Shipping Address
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Address */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="House, road, area..."
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Dhaka"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="1230"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400"
                />
              </div>
            </div>
          </section>

          {/* Delivery Method */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Method
            </h2>

            <div className="mt-5">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    value="standard"
                    defaultChecked
                    className="h-4 w-4"
                  />

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Standard Delivery
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Delivery within 2–5 business days
                    </p>
                  </div>
                </div>

                <span className="text-sm font-semibold text-gray-900">
                  ৳100
                </span>
              </label>
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Payment Method
            </h2>

            <div className="mt-5 space-y-3">
              {/* COD */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                  paymentMethod === "cod"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Cash on Delivery
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Pay when your order arrives.
                  </p>
                </div>
              </label>

              {/* Online Payment */}
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                  paymentMethod === "online"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="h-4 w-4"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Online Payment
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Pay securely through SSLCommerz.
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">
                        No Image
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>

                <span className="font-medium text-gray-900">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>

                <span className="font-medium text-gray-900">
                  ৳{shipping.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between border-t border-gray-200 pt-4">
                <span className="font-semibold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  ৳{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              className="mt-6 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Place Order
            </button>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm font-medium text-gray-500 hover:text-black"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;