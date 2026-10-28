import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft, Gift, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const [giftBox, setGiftBox] = useState(true);

  const handleIncrease = async (item) => {
    try {
      await updateItem(item.product._id, item.quantity + 1);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update quantity"
      );
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await updateItem(item.product._id, item.quantity - 1);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update quantity"
      );
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItem(item.product._id);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to remove creation"
      );
    }
  };

  if (!cart) {
    return (
      <div className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center">
        <p className="text-xs uppercase tracking-luxury text-neutral-500">
          Accessing Shopping Bag...
        </p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <section className="min-h-[75vh] bg-[#fbfbf9] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full border border-neutral-200 bg-white p-12 text-center">
          <span className="font-editorial text-4xl text-neutral-400 block mb-3">
            Your Bag is Empty
          </span>

          <p className="text-xs text-neutral-500 font-light leading-relaxed mb-8">
            There are currently no creations reserved in your shopping bag. Explore our latest arrivals and seasonal collections.
          </p>

          <div className="space-y-3">
            <Link
              to="/products"
              className="inline-block w-full py-4 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-neutral-800 transition-colors"
            >
              Explore Collections
            </Link>
            <Link
              to="/"
              className="inline-block w-full py-3 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-luxury font-medium hover:bg-neutral-100 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const cartTotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Editorial Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
              <Link to="/" className="hover:text-black font-medium text-neutral-700">Home</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Shopping Bag</span>
            </nav>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight">
              Your Shopping Bag
            </h1>
          </div>

          <p className="text-xs uppercase tracking-luxury text-neutral-500 font-medium">
            {cart.items.length} {cart.items.length === 1 ? "Creation" : "Creations"} Reserved
          </p>
        </div>
      </section>

      {/* Main Bag Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Bag Items List (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-neutral-200 bg-white divide-y divide-neutral-200">
              {cart.items.map((item) => (
                <article
                  key={item.product._id}
                  className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 transition-colors hover:bg-neutral-50/50"
                >
                  {/* Item Portrait Thumbnail */}
                  <Link
                    to={`/products/${item.product._id}`}
                    className="w-full sm:w-28 h-36 bg-[#f5f4ef] shrink-0 overflow-hidden border border-neutral-200/80 block"
                  >
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] uppercase tracking-luxury text-neutral-400">
                        Atelier
                      </div>
                    )}
                  </Link>

                  {/* Item Info & Actions */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                            {item.product.category || "House Collection"}
                          </p>
                          <Link
                            to={`/products/${item.product._id}`}
                            className="font-editorial text-xl sm:text-2xl text-neutral-950 hover:text-neutral-600 transition-colors block mt-1"
                          >
                            {item.product.name}
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          className="text-neutral-400 hover:text-black transition-colors p-1"
                          title="Remove from bag"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.5]" />
                        </button>
                      </div>

                      <p className="text-xs text-neutral-500 font-light mt-2">
                        Unit Price: Rs. {item.product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity & Line Total */}
                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-neutral-300 bg-white">
                        <button
                          type="button"
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-xs font-medium text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(item)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Subtotal */}
                      <p className="text-sm sm:text-base font-normal text-neutral-950 tracking-wide">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Complimentary Gift Box Option */}
            <div className="border border-neutral-200 bg-white p-6 flex items-start gap-4">
              <Gift className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs uppercase tracking-luxury font-medium text-neutral-900">
                    Complimentary Maison Gift Packaging
                  </h4>
                  <input
                    type="checkbox"
                    checked={giftBox}
                    onChange={(e) => setGiftBox(e.target.checked)}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-neutral-500 font-light mt-1">
                  Enclosed in our signature structured box tied by hand with luxury satin ribbon and an embossed greeting dossier.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Sticky Summary Column (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-6">
            <div className="border border-neutral-200 bg-white p-8 space-y-6">
              <h2 className="font-editorial text-2xl text-neutral-950 font-normal">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-xs text-neutral-600 border-b border-neutral-200 pb-5">
                <div className="flex justify-between">
                  <span className="font-light">Creations Subtotal</span>
                  <span className="text-neutral-900">Rs. {cartTotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-light">Estimated Express Delivery</span>
                  <span className="uppercase tracking-luxury text-[10px] text-emerald-700 font-medium">
                    Complimentary
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-light">Payment Method</span>
                  <span className="uppercase tracking-luxury text-[10px] text-neutral-900 font-medium">
                    Cash on Delivery
                  </span>
                </div>

                {giftBox && (
                  <div className="flex justify-between">
                    <span className="font-light">Signature Gift Box</span>
                    <span className="uppercase tracking-luxury text-[10px] text-neutral-900 font-medium">
                      Included
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs uppercase tracking-luxury text-neutral-500">
                  Total (Taxes Included)
                </span>
                <span className="text-2xl font-light text-neutral-950 tracking-tight">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="w-full py-4 bg-[#0a0a0a] text-white text-xs uppercase tracking-luxury-wide font-medium hover:bg-neutral-800 transition-colors shadow-md block text-center"
              >
                Proceed to Checkout
              </button>

              <div className="space-y-2 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 w-full text-center text-xs uppercase tracking-luxury text-neutral-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue Exploring Catalogue</span>
                </Link>

                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 w-full text-center text-xs uppercase tracking-luxury text-neutral-400 hover:text-black transition-colors"
                >
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>

            {/* Reassurance Guarantees */}
            <div className="border border-neutral-200 bg-[#fbfbf9] p-6 space-y-4 text-xs text-neutral-600 font-light">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>Full transit insurance and security inspection on every piece.</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
                <span>Cash on delivery payment collected directly at your doorstep.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;