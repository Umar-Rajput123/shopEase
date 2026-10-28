import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, Gift, Clock } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to updates from the Maison.");
  };

  return (
    <footer className="mt-auto bg-[#0a0a0a] text-[#fbfbf9] border-t border-neutral-800">
      {/* Luxury Service Guarantees Strip */}
      <div className="border-b border-neutral-900 bg-neutral-950/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Truck className="w-5 h-5 text-neutral-400 stroke-[1.2] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-white">
                Complimentary Shipping
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                On all domestic orders with secure transit
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <Gift className="w-5 h-5 text-neutral-400 stroke-[1.2] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-white">
                Signature Packaging
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Delivered in our bespoke luxury gift box
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-neutral-400 stroke-[1.2] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-white">
                Authenticity Guaranteed
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Certified quality & artisanal craftsmanship
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <Clock className="w-5 h-5 text-neutral-400 stroke-[1.2] shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-luxury font-medium text-white">
                Client Concierge
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Available 6 days a week for consultations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Links */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Column 1: Client Help & Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-luxury-wide font-semibold text-white mb-6">
              May We Help You?
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Your Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Your Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  Client Profile & Account
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Executive Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: The Maison */}
          <div>
            <h3 className="text-xs uppercase tracking-luxury-wide font-semibold text-white mb-6">
              The Maison
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-400">
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  House Heritage & Archives
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Artisanal Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">
                  Sustainability & Materials
                </Link>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">
                  Careers at ShopEase
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">
                  Press & Media Inquiries
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Boutiques & Services */}
          <div>
            <h3 className="text-xs uppercase tracking-luxury-wide font-semibold text-white mb-6">
              Services & Boutiques
            </h3>
            <ul className="space-y-3.5 text-xs text-neutral-400">
              <li>
                <span className="text-neutral-500 cursor-default">
                  Book an In-Store Consultation
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">
                  Virtual Client Advisor
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">
                  Bespoke Gift Wrapping
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">
                  Cash on Delivery Protection
                </span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">
                  Global Flagship Boutiques
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Maison Updates */}
          <div>
            <h3 className="text-xs uppercase tracking-luxury-wide font-semibold text-white mb-4">
              Sign Up For Updates
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-5">
              Be the first to receive updates on new seasonal collections, private previews, and exclusive Maison events.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative border-b border-neutral-700 focus-within:border-white transition-colors">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  className="w-full bg-transparent py-2.5 text-xs text-white placeholder-neutral-500 outline-none pr-8"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
              <p className="text-[10px] text-neutral-600">
                By subscribing, you agree to our Privacy Policy and terms of communication.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Monogram Copyright Bar */}
      <div className="border-t border-neutral-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500 uppercase tracking-luxury">
          <p>© {currentYear} SHOPEASE MAISON. ALL RIGHTS RESERVED.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/products" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/products" className="hover:text-neutral-300 transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/products" className="hover:text-neutral-300 transition-colors">
              Legal Notes
            </Link>
            <Link to="/products" className="hover:text-neutral-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;