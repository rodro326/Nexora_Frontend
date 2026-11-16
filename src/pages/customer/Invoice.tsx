
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

type OrderItem = {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  };
  quantity: number;
  price: number;
  subtotal: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

const Invoice = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data?.data);
      } catch (error) {
        console.error("Failed to load order:", error);
        setError("Failed to load invoice. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-gray-500">Loading invoice...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4">
        <p className="mb-4 text-red-500">
          {error || "Order not found."}
        </p>

        <Link
          to="/"
          className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Invoice-only print styles */}
      <style>{`
        @page {
          size: A4;
          margin: 12mm;
        }

        @media print {
          html,
          body,
          #root {
            width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
          }

          body * {
            visibility: hidden !important;
          }

          .invoice-print-area,
          .invoice-print-area * {
            visibility: visible !important;
          }

          .invoice-print-area {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          .invoice-print-card {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }

          .invoice-no-print {
            display: none !important;
            visibility: hidden !important;
          }

          .invoice-print-area table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          .invoice-print-area tr {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }

          .invoice-print-area img {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .invoice-print-area * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      <main className="min-h-screen bg-gray-50 py-10 print:bg-white print:py-0">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 print:max-w-none print:px-0">

          {/* Action Buttons */}
          <div className="mb-6 flex items-center justify-between invoice-no-print">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-black"
            >
              ← Back to Home
            </Link>

            <button
              onClick={() => window.print()}
              className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Print Invoice
            </button>
          </div>

          {/* Invoice Content: Only this section will print */}
          <div className="invoice-print-area">
            <div className="invoice-print-card rounded-2xl bg-white p-6 shadow-sm sm:p-10">

              {/* Header */}
              <div className="flex flex-col justify-between gap-6 border-b border-gray-200 pb-8 sm:flex-row">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Nexora
                  </h1>

                  <p className="mt-2 text-sm text-gray-500">
                    Premium Multi-Vendor Platform
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Your Technology. Your World.
                  </p>
                </div>

                <div className="sm:text-right">
                  <h2 className="text-2xl font-bold text-gray-900">
                    INVOICE
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Order ID:{" "}
                    <span className="font-medium text-gray-800">
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Date:{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-BD")}
                  </p>
                </div>
              </div>

              {/* Customer & Order Information */}
              <div className="grid gap-8 py-8 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Bill To
                  </h3>

                  <p className="font-semibold text-gray-900">
                    {order.shippingAddress.fullName}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {order.shippingAddress.phone}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {order.shippingAddress.address}
                  </p>

                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                    Order Information
                  </h3>

                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between gap-4">
                      <span className="text-gray-500">Order Status:</span>
                      <span className="font-medium capitalize text-gray-900">
                        {order.orderStatus}
                      </span>
                    </p>

                    <p className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium uppercase text-gray-900">
                        {order.paymentMethod}
                      </span>
                    </p>

                    <p className="flex justify-between gap-4">
                      <span className="text-gray-500">Payment Status:</span>
                      <span className="font-medium capitalize text-gray-900">
                        {order.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full text-left">
                  <thead className="border-y border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3 text-center">Quantity</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {order.items.map((item, index) => (
                      <tr
                        key={`${item.product._id}-${index}`}
                        className="border-b border-gray-100"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            {item.product.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="h-12 w-12 rounded-md object-cover"
                              />
                            )}

                            <span className="font-medium text-gray-900">
                              {item.product.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center text-gray-600">
                          {item.quantity}
                        </td>

                        <td className="px-4 py-4 text-right text-gray-600">
                          {formatPrice(item.price)}
                        </td>

                        <td className="px-4 py-4 text-right font-medium text-gray-900">
                          {formatPrice(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="ml-auto mt-8 max-w-sm">
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Invoice Footer */}
              <div className="mt-12 border-t border-gray-200 pt-6 text-center">
                <p className="text-sm text-gray-500">
                  Thank you for shopping with Nexora!
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  This is a system-generated invoice.
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Invoice;
