import { Link } from "react-router-dom";
import { Package, ShoppingBag, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Editorial Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
              <Link to="/" className="hover:text-black font-medium text-neutral-700">Home</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Maison Executive Office</span>
            </nav>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight">
              Maison Atelier Dashboard
            </h1>
            <p className="mt-2 text-xs text-neutral-500 font-light">
              Welcome, {user?.name}. Oversee product catalogue curation, stock allocations, and client order fulfillments.
            </p>
          </div>

          <Link
            to="/"
            className="text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors shrink-0"
          >
            ← View Storefront Home
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/admin/products"
            className="group border border-neutral-200 bg-white p-8 sm:p-10 hover:border-black transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Atelier Catalog
              </span>
              <Package className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
            </div>

            <h2 className="font-editorial text-3xl text-neutral-950 font-normal mt-4 group-hover:text-neutral-700">
              Manage Creations
            </h2>

            <p className="text-xs text-neutral-500 font-light leading-relaxed mt-2">
              Curate products, upload high-definition Cloudinary imagery, adjust prices, and manage stock allocations.
            </p>

            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-neutral-950 mt-8 font-medium group-hover:translate-x-1 transition-transform">
              <span>Open Catalog Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="group border border-neutral-200 bg-white p-8 sm:p-10 hover:border-black transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Fulfillments
              </span>
              <ShoppingBag className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
            </div>

            <h2 className="font-editorial text-3xl text-neutral-950 font-normal mt-4 group-hover:text-neutral-700">
              Manage Orders & Dispatch
            </h2>

            <p className="text-xs text-neutral-500 font-light leading-relaxed mt-2">
              Review incoming client orders, inspect delivery addresses, and advance order statuses through to delivery.
            </p>

            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-neutral-950 mt-8 font-medium group-hover:translate-x-1 transition-transform">
              <span>Open Orders Dispatch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>

        {/* Admin Credentials Panel */}
        <div className="border border-neutral-200 bg-white p-8">
          <h3 className="font-editorial text-xl text-neutral-950 font-normal mb-4">
            Security & Session
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-1">
                Authorized Executive
              </span>
              <span className="font-medium text-neutral-900">{user?.name}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-1">
                Executive Credentials
              </span>
              <span className="font-medium text-neutral-900">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;