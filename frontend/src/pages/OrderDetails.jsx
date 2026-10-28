import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package, Truck, ShieldCheck, Calendar, MapPin } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMyOrderById } from "../services/orderApi";

function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getMyOrderById(id, token);
        setOrder(data.order);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to load order dossier."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      loadOrder();
    }
  }, [id, token]);

  const getStatusBadge = (status) => {
    const styles = {
      Pending: "border-neutral-400 text-neutral-800 bg-neutral-100",
      Confirmed: "border-neutral-900 text-neutral-950 bg-neutral-100 font-semibold",
      Processing: "border-neutral-900 text-neutral-950 bg-neutral-200 font-semibold",
      Shipped: "border-indigo-900 text-indigo-900 bg-indigo-50 font-semibold",
      Delivered: "border-emerald-800 text-emerald-800 bg-emerald-50 font-semibold",
      Cancelled: "border-red-700 text-red-700 bg-red-50",
    };

    return (
      styles[status] ||
      "border-neutral-300 text-neutral-700 bg-neutral-50"
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center">
        <p className="text-xs uppercase tracking-luxury text-neutral-500">
          Retrieving Acquisition Dossier...
        </p>
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <section className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full border border-neutral-200 bg-white p-12 text-center">
          <h1 className="font-editorial text-3xl text-neutral-900 mb-3">
            Dossier Unavailable
          </h1>

          <p className="text-xs text-red-700 mb-6 font-light">
            {errorMessage || "Order record not found"}
          </p>

          <Link
            to="/orders"
            className="inline-block px-7 py-3.5 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium"
          >
            Return to Order Archive
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Editorial Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors pr-4 border-r border-neutral-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors"
            >
              <span>Back to Orders Dossier</span>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Official Maison Transaction Receipt
              </p>
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight mt-1">
                Order Acquisition
              </h1>
              <p className="text-xs font-mono text-neutral-500 mt-1">
                REFERENCE: #{order._id}
              </p>
            </div>

            <span
              className={`px-4 py-1.5 text-[10px] uppercase tracking-luxury border ${getStatusBadge(
                order.status
              )} w-fit`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </section>

      {/* Main Order Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 space-y-8">
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-200 bg-white p-8 space-y-5">
            <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
              Order Specifics
            </h2>

            <div className="space-y-3.5 text-xs text-neutral-600 divide-y divide-neutral-100">
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Status
                </span>
                <span className="font-medium text-neutral-950">{order.status}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Payment Protocol
                </span>
                <span className="font-medium text-neutral-950">{order.paymentMethod}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Date Recorded
                </span>
                <span className="font-medium text-neutral-950">
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-8 space-y-5">
            <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
              Courier Delivery Details
            </h2>

            <div className="space-y-3.5 text-xs text-neutral-600 divide-y divide-neutral-100">
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Client Name
                </span>
                <span className="font-medium text-neutral-950">
                  {order.deliveryInfo?.fullName}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Telephone
                </span>
                <span className="font-medium text-neutral-950">
                  {order.deliveryInfo?.phone}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Destination City
                </span>
                <span className="font-medium text-neutral-950">
                  {order.deliveryInfo?.city}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Delivery Address
                </span>
                <span className="font-medium text-neutral-950 text-right max-w-xs">
                  {order.deliveryInfo?.address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products in Order */}
        <div className="border border-neutral-200 bg-white p-8 space-y-6">
          <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
            Pieces in this Acquisition
          </h2>

          <div className="divide-y divide-neutral-100">
            {order.items.map((item) => (
              <div
                key={item.product}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-editorial text-xl text-neutral-950">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Rs. {item.price.toLocaleString()} × {item.quantity} {item.quantity === 1 ? "piece" : "pieces"}
                  </p>
                </div>

                <p className="text-sm font-medium text-neutral-950">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-neutral-200 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-luxury text-neutral-500 font-medium">
              Total Acquisition Amount
            </span>
            <span className="text-2xl font-light text-neutral-950">
              Rs. {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;