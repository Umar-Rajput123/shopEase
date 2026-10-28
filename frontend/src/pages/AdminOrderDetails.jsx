import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, AlertCircle, Truck, Package, User } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  getAdminOrderById,
  updateOrderStatus,
} from "../services/adminOrderApi";

const statusTransitions = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

function AdminOrderDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getAdminOrderById(id, token);
        setOrder(data.order);
        setSelectedStatus("");
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

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      setErrorMessage("Please select a new fulfillment status.");
      return;
    }

    try {
      setUpdating(true);
      setErrorMessage("");
      setSuccessMessage("");

      const data = await updateOrderStatus(id, selectedStatus, token);

      setOrder(data.order);
      setSelectedStatus("");
      setSuccessMessage(data.message || "Fulfillment status updated.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to update fulfillment status."
      );
    } finally {
      setUpdating(false);
    }
  };

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
          Loading Order Management Dossier...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <section className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full border border-neutral-200 bg-white p-12 text-center">
          <h1 className="font-editorial text-3xl text-neutral-900 mb-3">
            Order Record Not Found
          </h1>

          <p className="text-xs text-red-700 mb-6 font-light">
            {errorMessage || "Unable to retrieve order details."}
          </p>

          <Link
            to="/admin/orders"
            className="inline-block px-7 py-3 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </section>
    );
  }

  const availableStatuses = statusTransitions[order.status] || [];

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Maison Administration Protocol
              </p>
              <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight mt-1">
                Fulfillment Management
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

      {/* Main Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 space-y-8">
        {successMessage && (
          <div className="p-4 bg-neutral-950 text-white border border-neutral-800 text-xs flex items-center gap-2 uppercase tracking-luxury">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs text-center uppercase tracking-luxury">
            {errorMessage}
          </div>
        )}

        {/* Customer & Order Specifics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-neutral-200 bg-white p-8 space-y-5">
            <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
              Client Dossier
            </h2>

            <div className="space-y-3.5 text-xs text-neutral-600 divide-y divide-neutral-100">
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Registered Name
                </span>
                <span className="font-medium text-neutral-950">
                  {order.user?.name || "Unregistered Guest"}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Client Email
                </span>
                <span className="font-medium text-neutral-950 break-all">
                  {order.user?.email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-neutral-200 bg-white p-8 space-y-5">
            <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
              Order Attributes
            </h2>

            <div className="space-y-3.5 text-xs text-neutral-600 divide-y divide-neutral-100">
              <div className="flex justify-between pt-2">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Current Status
                </span>
                <span className="font-medium text-neutral-950">{order.status}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Payment Terms
                </span>
                <span className="font-medium text-neutral-950">{order.paymentMethod}</span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-neutral-400 uppercase tracking-luxury text-[10px]">
                  Timestamp
                </span>
                <span className="font-medium text-neutral-950">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Transition Control */}
        <div className="border border-neutral-200 bg-white p-8 space-y-4">
          <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
            Advance Fulfillment Workflow
          </h2>

          <p className="text-xs text-neutral-500 font-light">
            Current Stage: <strong className="text-neutral-900">{order.status}</strong>
          </p>

          {availableStatuses.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={updating}
                className="w-full sm:max-w-xs bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs uppercase tracking-luxury text-neutral-800 outline-none focus:border-black"
              >
                <option value="">Select Next Status</option>
                {availableStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleStatusUpdate}
                disabled={updating || !selectedStatus}
                className="px-8 py-3.5 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors shadow-sm"
              >
                {updating ? "Advancing..." : "Apply Status Transition"}
              </button>
            </div>
          ) : (
            <div className="p-4 bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 font-light">
              This order has reached its final state ({order.status}) and no further transitions are permissible under Maison policy.
            </div>
          )}
        </div>

        {/* Pieces & Delivery Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pieces (7 cols) */}
          <div className="lg:col-span-7 border border-neutral-200 bg-white p-8 space-y-6">
            <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
              Order Pieces
            </h2>

            <div className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <div
                  key={item.product}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="font-editorial text-lg text-neutral-950">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Rs. {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>

                  <p className="text-xs font-medium text-neutral-950">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline">
              <span className="text-xs uppercase tracking-luxury text-neutral-500">
                Total Order Value
              </span>
              <span className="text-2xl font-light text-neutral-950">
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Delivery (5 cols) */}
          <div className="lg:col-span-5 border border-neutral-200 bg-white p-8 space-y-5 self-start">
            <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
              Delivery Destination
            </h2>

            <div className="space-y-3.5 text-xs text-neutral-600 divide-y divide-neutral-100">
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-0.5">
                  Designated Recipient
                </span>
                <span className="font-medium text-neutral-900">
                  {order.deliveryInfo?.fullName}
                </span>
              </div>

              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-0.5">
                  Contact Phone
                </span>
                <span className="font-medium text-neutral-900">
                  {order.deliveryInfo?.phone}
                </span>
              </div>

              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-0.5">
                  Destination City
                </span>
                <span className="font-medium text-neutral-900">
                  {order.deliveryInfo?.city}
                </span>
              </div>

              <div className="pt-3">
                <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-0.5">
                  Street Address
                </span>
                <span className="font-medium text-neutral-900 leading-relaxed block">
                  {order.deliveryInfo?.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetails;