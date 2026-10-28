import { Link } from "react-router-dom";
import { User, Package, LogOut, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Account() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Top Header */}
      <section className="border-b border-[#e8e8e6] bg-white py-12 px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl mx-auto flex items-baseline justify-between">
          <div>
            <nav className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
              <Link to="/" className="hover:text-black font-medium text-neutral-700">Home</Link>
              <span>/</span>
              <span className="text-neutral-900 font-medium">Client Profile</span>
            </nav>
            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-950 tracking-tight">
              My Maison Account
            </h1>
          </div>

          <Link
            to="/"
            className="text-xs uppercase tracking-luxury text-neutral-500 hover:text-black transition-colors hidden sm:inline-block"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* Main Account Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
        {/* Profile Card */}
        <div className="border border-neutral-200 bg-white">
          <div className="bg-[#0a0a0a] text-white p-8 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white text-neutral-950 font-editorial text-2xl flex items-center justify-center font-normal">
                {user?.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-normal">
                  {user?.name}
                </h2>
                <p className="text-[10px] uppercase tracking-luxury text-[#c5a880] mt-0.5">
                  Distinguished House Client • {user?.role}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="text-xs uppercase tracking-luxury text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8">
            <div className="border-b sm:border-b-0 sm:border-r border-neutral-100 pb-4 sm:pb-0 sm:pr-4">
              <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Registered Name
              </p>
              <p className="text-sm font-medium text-neutral-900 mt-1">
                {user?.name}
              </p>
            </div>

            <div className="border-b sm:border-b-0 sm:border-r border-neutral-100 pb-4 sm:pb-0 sm:pr-4">
              <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Email Dossier
              </p>
              <p className="text-sm font-medium text-neutral-900 mt-1 break-all">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                Membership Tier
              </p>
              <p className="text-sm font-medium text-neutral-900 mt-1 uppercase tracking-wider">
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nav Panels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/orders"
            className="group border border-neutral-200 bg-white p-8 hover:border-black transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400">
                Acquisitions
              </span>
              <Package className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
            </div>

            <h3 className="font-editorial text-2xl text-neutral-950 font-normal mt-3 group-hover:text-neutral-700">
              Orders Dossier
            </h3>

            <p className="text-xs text-neutral-500 font-light mt-1">
              Review previous transactions, tracking status, and receipts.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-950 mt-6 font-medium group-hover:translate-x-1 transition-transform">
              <span>View Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          <Link
            to="/products"
            className="group border border-neutral-200 bg-white p-8 hover:border-black transition-all block"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400">
                The Collections
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black transition-colors" />
            </div>

            <h3 className="font-editorial text-2xl text-neutral-950 font-normal mt-3 group-hover:text-neutral-700">
              Explore Creations
            </h3>

            <p className="text-xs text-neutral-500 font-light mt-1">
              Browse newly arrived pieces and timeless house signatures.
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-950 mt-6 font-medium group-hover:translate-x-1 transition-transform">
              <span>Discover Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Account;