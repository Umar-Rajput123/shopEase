import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Truck, Check, ArrowLeft, Lock } from "lucide-react";

import { createOrder } from "../services/orderApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { token } = useAuth();
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setErrorMessage("Please complete all delivery destination details.");
      return;
    }

    if (!cart || cart.items.length === 0) {
      setErrorMessage("Your shopping bag is currently empty.");
      return;
    }

    setLoading(true);

    try {
      const data = await createOrder(formData, token);

      setCart((previousCart) => {
        if (!previousCart) return previousCart;
        return {
          ...previousCart,
          items: [],
        };
      });

      setSuccessMessage(
        data.message || "Your order has been formally placed with the Maison."
      );

      setFormData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
      });

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order with the Maison."
      );
    } finally {
      setLoading(false);
    }
  };

  const cartTotal =
    cart?.items?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) || 0;

  if (!cart) {
    return (
      <div className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center">
        <p className="text-xs uppercase tracking-luxury text-neutral-500">
          Loading Checkout Dossier...
        </p>
      </div>
    );
  }

  if (cart.items.length === 0 && !successMessage) {
    return (
      <section className="min-h-[75vh] bg-[#fbfbf9] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full border border-neutral-200 bg-white p-12 text-center">
          <span className="font-editorial text-4xl text-neutral-400 block mb-3">
            Your Bag is Empty
          </span>

          <p className="text-xs text-neutral-500 font-light mb-8">
            Please reserve creations before proceeding to checkout.
          </p>

          <div className="space-y-3">
            <Link
              to="/products"
              className="inline-block w-full py-4 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium"
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
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Top Breadcrumb & Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
              <Link to="/" className="hover:text-black font-medium text-neutral-700">Home</Link>
              <span>/</span>
              <Link to="/cart" className="hover:text-black">Shopping Bag</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Checkout</span>
            </nav>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight">
              Checkout & Delivery Dossier
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs uppercase tracking-luxury text-neutral-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypted Protocol</span>
          </div>
        </div>
      </section>

      {/* Main Form and Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        {successMessage && (
          <div className="mb-8 p-5 bg-neutral-950 text-white border border-neutral-800 text-xs uppercase tracking-luxury flex items-center gap-3">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage} Redirecting to your orders dossier...</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs uppercase tracking-luxury text-center">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form (7 cols) */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder} className="border border-neutral-200 bg-white p-8 sm:p-10 space-y-8">
              <div>
                <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
                  Delivery Destination
                </h2>
                <p className="text-xs text-neutral-500 font-light mt-1">
                  Please provide the precise physical address for courier handoff.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Eleanor Vance"
                    disabled={loading}
                    className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                    Contact Telephone *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03XXXXXXXXX"
                    disabled={loading}
                    className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                    City / Region *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Lahore / Karachi"
                    disabled={loading}
                    className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-luxury text-neutral-700 font-medium mb-2">
                    Residence / Suite / Street Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House, building, avenue details..."
                    rows="3"
                    disabled={loading}
                    className="w-full bg-[#fbfbf9] border border-neutral-300 px-4 py-3 text-xs text-neutral-900 outline-none focus:border-black resize-none transition-colors"
                  />
                </div>
              </div>

              {/* Payment Notice */}
              <div className="border border-neutral-200 bg-[#fbfbf9] p-5">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-neutral-800 shrink-0" />
                  <div>
                    <h4 className="text-xs uppercase tracking-luxury font-medium text-neutral-950">
                      Payment Terms: Cash on Delivery (COD)
                    </h4>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">
                      Settle payment directly with our official courier service upon delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || cart.items.length === 0}
                className="w-full py-4 bg-[#0a0a0a] text-white text-xs uppercase tracking-luxury-wide font-medium hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors shadow-md"
              >
                {loading ? "Confirming Allocation..." : `Confirm Order — Rs. ${cartTotal.toLocaleString()}`}
              </button>

              <p className="text-[10px] text-neutral-500 text-center font-light uppercase tracking-luxury">
                By confirming, you authorize dispatch under Maison terms and conditions.
              </p>
            </form>
          </div>

          {/* Right: Order Review (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6">
            <div className="border border-neutral-200 bg-white p-8 space-y-6">
              <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
                Pieces in this Acquisition
              </h2>

              <div className="divide-y divide-neutral-100 max-h-[360px] overflow-y-auto pr-1">
                {cart.items.map((item) => (
                  <div key={item.product._id} className="py-4 flex gap-4">
                    <div className="w-16 h-20 bg-[#f5f4ef] shrink-0 overflow-hidden border border-neutral-200">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] text-neutral-400">
                          Piece
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-editorial text-neutral-950 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-luxury">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-xs text-neutral-900 font-light mt-1">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotals */}
              <div className="space-y-3 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-900">Rs. {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Transit</span>
                  <span className="text-emerald-700 uppercase tracking-luxury text-[10px] font-medium">
                    Complimentary
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Signature Packaging</span>
                  <span className="uppercase tracking-luxury text-[10px] text-neutral-900 font-medium">
                    Included
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-luxury text-neutral-500">
                  Total Due
                </span>
                <span className="text-2xl font-light text-neutral-950">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Modify Bag</span>
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-neutral-400 hover:text-black transition-colors"
              >
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;