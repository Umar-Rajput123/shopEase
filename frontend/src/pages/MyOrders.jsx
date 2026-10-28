import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Clock, ShieldCheck } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../services/orderApi";

function MyOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getMyOrders(token);
        setOrders(data.orders || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            error.message ||
            "Failed to retrieve your order history."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadOrders();
    }
  }, [token]);

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
          Accessing Order Archive...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Editorial Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
              <Link to="/" className="hover:text-black font-medium text-neutral-700">Home</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Order Archive</span>
            </nav>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight">
              My Orders Dossier
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors"
            >
              ← Back to Home
            </Link>
            <span className="text-xs uppercase tracking-luxury text-neutral-400 font-medium">
              {orders.length} {orders.length === 1 ? "Acquisition" : "Acquisitions"} Recorded
            </span>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs text-center uppercase tracking-luxury">
            {errorMessage}
          </div>
        )}

        {!errorMessage && orders.length === 0 && (
          <div className="max-w-md mx-auto text-center border border-neutral-200 bg-white p-12">
            <span className="font-editorial text-4xl text-neutral-400 block mb-3">
              No Recorded Acquisitions
            </span>
            <p className="text-xs text-neutral-500 font-light mb-8 leading-relaxed">
              You have not placed any orders yet. Discover our latest creations and reserve your favorites.
            </p>
            <div className="space-y-3">
              <Link
                to="/products"
                className="inline-block w-full py-4 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-neutral-800"
              >
                Explore Catalogue
              </Link>
              <Link
                to="/"
                className="inline-block w-full py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-luxury font-medium hover:bg-neutral-100"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <article
              key={order._id}
              className="border border-neutral-200 bg-white p-6 sm:p-8 transition-colors hover:border-black"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-editorial text-xl sm:text-2xl text-neutral-950 font-normal">
                      Order Dossier
                    </span>

                    <span
                      className={`px-3 py-1 text-[9px] uppercase tracking-luxury border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-neutral-500">
                    REFERENCE: #{order._id}
                  </p>

                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs pt-2 text-neutral-600">
                    <div>
                      <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block">
                        Pieces
                      </span>
                      <span className="font-medium text-neutral-900">
                        {order.items.length}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block">
                        Total Amount
                      </span>
                      <span className="font-medium text-neutral-900">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block">
                        Recorded Date
                      </span>
                      <span className="font-medium text-neutral-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/orders/${order._id}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <span>Inspect Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;