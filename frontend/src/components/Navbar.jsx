import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Shield,
  Package,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/productApi";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  // Load unique categories dynamically from products
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getProducts();
        if (data && data.products) {
          const unique = Array.from(
            new Set(
              data.products
                .map((p) => p.category?.trim())
                .filter(Boolean)
            )
          );
          setCategories(unique);
        }
      } catch (err) {
        console.error("Failed to load categories in navbar", err);
      }
    };

    loadCategories();
  }, []);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setCategoriesOpen(false);
  };

  const editorialLinkClass = ({ isActive }) =>
    `relative text-[11px] uppercase tracking-luxury font-medium transition-colors duration-200 py-1 ${
      isActive
        ? "text-neutral-950 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-neutral-950"
        : "text-neutral-600 hover:text-neutral-950 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-neutral-950 after:transition-all after:duration-300"
    }`;

  return (
    <>
      {/* Top Luxury Announcement Ticker */}
      <div className="bg-[#0a0a0a] text-[#fbfbf9] px-4 py-2 text-center text-[10px] md:text-[11px] uppercase tracking-luxury font-medium border-b border-neutral-800">
        <div className="mx-auto flex max-w-7xl items-center justify-center">
          <span>Complimentary Express Delivery & Signature Gift Packaging</span>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e8e8e6] transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
          {/* Left Navigation: Mobile Menu Button & Desktop Editorial Links */}
          <div className="flex items-center gap-6 lg:gap-8 flex-1">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex items-center gap-2 text-neutral-800 hover:text-black transition-colors md:hidden"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[10px] uppercase tracking-luxury font-medium hidden sm:inline">
                Menu
              </span>
            </button>

            {/* Desktop Editorial Navigation */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              <NavLink to="/" end className={editorialLinkClass}>
                Home
              </NavLink>

              <NavLink to="/products" className={editorialLinkClass}>
                All Creations
              </NavLink>

              {/* Categories Dropdown in Desktop Nav */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((prev) => !prev)}
                  className="relative text-[11px] uppercase tracking-luxury font-medium transition-colors duration-200 py-1 text-neutral-600 hover:text-neutral-950 flex items-center gap-1"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${
                      categoriesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-3 w-56 bg-white border border-neutral-200 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Link
                      to="/products"
                      onClick={closeMenu}
                      className="block px-5 py-2.5 text-xs uppercase tracking-luxury text-neutral-800 hover:bg-neutral-50 hover:text-black font-medium transition-colors border-b border-neutral-100"
                    >
                      All Collections
                    </Link>

                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <Link
                          key={cat}
                          to={`/products?category=${encodeURIComponent(cat)}`}
                          onClick={closeMenu}
                          className="block px-5 py-2.5 text-xs uppercase tracking-luxury text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors"
                        >
                          {cat}
                        </Link>
                      ))
                    ) : (
                      <span className="block px-5 py-2.5 text-xs text-neutral-400 font-light">
                        No categories listed
                      </span>
                    )}
                  </div>
                )}
              </div>

              {user && user.role !== "admin" && (
                <NavLink to="/orders" className={editorialLinkClass}>
                  My Orders
                </NavLink>
              )}

              {user?.role === "admin" && (
                <>
                  <NavLink to="/admin" className={editorialLinkClass}>
                    Dashboard
                  </NavLink>
                  <NavLink to="/admin/products" className={editorialLinkClass}>
                    Manage Store
                  </NavLink>
                  <NavLink to="/admin/orders" className={editorialLinkClass}>
                    Orders
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          {/* Center Brand Monogram */}
          <div className="flex-shrink-0 text-center">
            <Link
              to="/"
              onClick={closeMenu}
              className="inline-block group text-center"
            >
              <span className="block font-editorial text-2xl sm:text-3xl md:text-[32px] tracking-luxury-wide uppercase font-normal text-neutral-950 transition-opacity duration-300 group-hover:opacity-75">
                S H O P E A S E
              </span>
              <span className="block text-[8px] uppercase tracking-[0.35em] text-neutral-400 font-sans -mt-0.5">
                Maison de Luxe
              </span>
            </Link>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center justify-end gap-5 lg:gap-7 flex-1">
            {/* Search Link */}
            <Link
              to="/products"
              className="text-neutral-700 hover:text-black transition-colors hidden sm:flex items-center gap-1.5"
              title="Search Collections"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
              <span className="text-[11px] uppercase tracking-luxury font-medium hidden lg:inline">
                Search
              </span>
            </Link>

            {/* User Account / Sign In */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/account"
                  className="flex items-center gap-1.5 text-neutral-700 hover:text-black transition-colors"
                  title="My Account"
                >
                  <User className="w-4 h-4 stroke-[1.5]" />
                  <span className="text-[11px] uppercase tracking-luxury font-medium hidden lg:inline">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-black transition-colors hidden md:block"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-neutral-800 hover:text-black text-[11px] uppercase tracking-luxury font-medium hidden sm:inline-block"
              >
                Sign In
              </Link>
            )}

            {/* Shopping Bag Icon with Counter */}
            <Link
              to="/cart"
              className="relative flex items-center text-neutral-900 hover:text-black transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center bg-[#0a0a0a] px-1 text-[9px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Luxury Mobile Navigation Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={closeMenu}
          />

          {/* Drawer Pane */}
          <div className="relative flex flex-col w-full max-w-md bg-[#fbfbf9] h-full shadow-2xl z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-[#e8e8e6]">
              <span className="font-editorial text-xl tracking-luxury-wide uppercase font-normal text-neutral-900">
                S H O P E A S E
              </span>

              <button
                type="button"
                onClick={closeMenu}
                className="flex items-center gap-1.5 text-neutral-500 hover:text-black text-xs uppercase tracking-luxury"
                aria-label="Close menu"
              >
                <span>Close</span>
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="px-6 py-8 flex-1 space-y-6">
              {/* Category Links Section */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-semibold">
                  Collections & Categories
                </p>

                <div className="flex flex-col space-y-3">
                  <Link
                    to="/"
                    onClick={closeMenu}
                    className="font-editorial text-2xl text-neutral-900 hover:opacity-70 transition-opacity flex items-center justify-between"
                  >
                    <span>Home</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>

                  <Link
                    to="/products"
                    onClick={closeMenu}
                    className="font-editorial text-2xl text-neutral-900 hover:opacity-70 transition-opacity flex items-center justify-between"
                  >
                    <span>All Creations</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>

                  {/* Dynamic Category Links */}
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={closeMenu}
                      className="font-editorial text-xl text-neutral-700 hover:text-black transition-colors pl-3 border-l-2 border-neutral-300 flex items-center justify-between"
                    >
                      <span>{cat}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Client Account Area */}
              <div className="pt-6 border-t border-[#e8e8e6] space-y-4">
                <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-semibold">
                  Client Services
                </p>

                <div className="flex flex-col space-y-3">
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="text-sm uppercase tracking-luxury font-medium text-neutral-800 hover:text-black flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                      <span>Shopping Bag ({cartCount})</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to="/account"
                        onClick={closeMenu}
                        className="text-sm uppercase tracking-luxury font-medium text-neutral-800 hover:text-black flex items-center gap-2"
                      >
                        <User className="w-4 h-4 stroke-[1.5]" />
                        <span>My Account ({user.name})</span>
                      </Link>

                      {user.role !== "admin" && (
                        <Link
                          to="/orders"
                          onClick={closeMenu}
                          className="text-sm uppercase tracking-luxury font-medium text-neutral-800 hover:text-black flex items-center gap-2"
                        >
                          <Package className="w-4 h-4 stroke-[1.5]" />
                          <span>My Orders</span>
                        </Link>
                      )}

                      {user.role === "admin" && (
                        <>
                          <Link
                            to="/admin"
                            onClick={closeMenu}
                            className="text-sm uppercase tracking-luxury font-medium text-neutral-800 hover:text-black flex items-center gap-2"
                          >
                            <Shield className="w-4 h-4 stroke-[1.5]" />
                            <span>Admin Dashboard</span>
                          </Link>
                          <Link
                            to="/admin/products"
                            onClick={closeMenu}
                            className="text-sm uppercase tracking-luxury font-medium text-neutral-800 hover:text-black flex items-center gap-2"
                          >
                            <Package className="w-4 h-4 stroke-[1.5]" />
                            <span>Manage Products</span>
                          </Link>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="text-sm uppercase tracking-luxury font-medium text-neutral-500 hover:text-red-700 flex items-center gap-2 pt-2 text-left"
                      >
                        <LogOut className="w-4 h-4 stroke-[1.5]" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="border border-neutral-900 px-4 py-3 text-center text-xs uppercase tracking-luxury font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                      >
                        Sign In
                      </Link>

                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="bg-[#0a0a0a] px-4 py-3 text-center text-xs uppercase tracking-luxury font-medium text-white hover:bg-neutral-800 transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Concierge Reassurance */}
              <div className="pt-6 border-t border-[#e8e8e6] text-[11px] text-neutral-500 space-y-1">
                <p className="uppercase tracking-luxury text-neutral-800 font-semibold">
                  Client Concierge
                </p>
                <p>Monday — Saturday: 9:00 AM — 8:00 PM</p>
                <p>concierge@shopease.luxury</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;