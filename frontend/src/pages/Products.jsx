import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowUpDown, X, ChevronRight, SlidersHorizontal } from "lucide-react";
import { getProducts } from "../services/productApi";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [sort, setSort] = useState("");

  // Sync category with URL searchParams (e.g. if navigated from Navbar, Home, or back/forward)
  useEffect(() => {
    const currentUrlCat = searchParams.get("category") || "";
    setCategory(currentUrlCat);
  }, [searchParams]);

  // Load all unique categories once from the master catalog
  useEffect(() => {
    const fetchAllCategories = async () => {
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
          setAllCategories(unique);
        }
      } catch (err) {
        console.error("Failed to load categories list", err);
      }
    };

    fetchAllCategories();
  }, []);

  // Fetch filtered products whenever search, category, or sort changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts({
          search,
          category,
          sort,
        });

        setProducts(data.products || []);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load creations from the Maison"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category, sort]);

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    if (selectedCat) {
      setSearchParams({ category: selectedCat });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setSearchParams({});
  };

  // Combine fetched categories with currently selected category if it's not in the list
  const displayCategories = useMemo(() => {
    const set = new Set(allCategories);
    if (category) set.add(category);
    return Array.from(set);
  }, [allCategories, category]);

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Editorial Header Banner */}
      <section className="border-b border-[#e8e8e6] bg-white py-14 sm:py-20 px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
            <Link to="/" className="hover:text-black transition-colors font-medium text-neutral-700">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              onClick={() => handleCategorySelect("")}
              className="hover:text-black transition-colors"
            >
              All Creations
            </Link>
            {category && (
              <>
                <span>/</span>
                <span className="text-neutral-900 font-semibold">{category}</span>
              </>
            )}
          </nav>

          <h1 className="font-editorial text-4xl sm:text-5xl md:text-6xl font-normal text-neutral-950 tracking-tight">
            {category ? `${category} Collection` : "All Creations"}
          </h1>

          <p className="mt-4 max-w-xl mx-auto text-xs sm:text-sm text-neutral-500 font-light leading-relaxed">
            Discover a synthesis of visionary contemporary design and timeless heritage. Each silhouette is individually finished with artisanal exactitude.
          </p>

          <div className="mt-6 text-[11px] uppercase tracking-luxury text-neutral-400 font-medium">
            {loading ? "Discovering pieces..." : `${products.length} Creations Available`}
          </div>
        </div>
      </section>

      {/* Luxury Filter & Category Navigation Strip */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e8e6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategorySelect("")}
              className={`px-4 py-2 text-xs uppercase tracking-luxury transition-all whitespace-nowrap ${
                category === ""
                  ? "bg-neutral-950 text-white font-medium"
                  : "bg-transparent text-neutral-600 hover:text-black border border-neutral-200"
              }`}
            >
              All Creations
            </button>

            {displayCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-luxury transition-all whitespace-nowrap ${
                  category.toLowerCase() === cat.toLowerCase()
                    ? "bg-neutral-950 text-white font-medium"
                    : "bg-transparent text-neutral-600 hover:text-black border border-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            {/* Search Input */}
            <div className="relative flex-1 md:w-56">
              <input
                type="text"
                placeholder="Search pieces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#fbfbf9] border border-neutral-300 pl-8 pr-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 outline-none focus:border-black transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Select */}
            <div className="relative shrink-0">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-[#fbfbf9] border border-neutral-300 px-4 py-2 pr-8 text-xs uppercase tracking-luxury text-neutral-800 outline-none focus:border-black cursor-pointer"
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Reset Filters */}
            {(search || category || sort) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs uppercase tracking-luxury text-neutral-500 hover:text-black underline underline-offset-4 shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-800 text-xs uppercase tracking-luxury text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="animate-pulse space-y-4">
                <div className="bg-neutral-200 aspect-[3/4] w-full" />
                <div className="h-4 bg-neutral-200 w-3/4 mx-auto" />
                <div className="h-3 bg-neutral-200 w-1/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center max-w-md mx-auto border border-neutral-200 bg-white p-12">
            <span className="font-editorial text-3xl sm:text-4xl text-neutral-400 block mb-3">
              {category
                ? `No Pieces in "${category}"`
                : "No Creations Located"}
            </span>
            <p className="text-xs text-neutral-500 font-light mb-6">
              {category
                ? `We could not locate any active pieces currently classified under "${category}". Explore our complete catalogue.`
                : "No pieces match your current search criteria. Please adjust your keywords."}
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-6 py-3 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium hover:bg-neutral-800 transition-colors"
            >
              View All Creations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16">
            {products.map((product) => (
              <article key={product._id} className="group flex flex-col text-center">
                {/* Product Imagery */}
                <Link
                  to={`/products/${product._id}`}
                  className="relative aspect-[3/4] bg-[#f5f4ef] overflow-hidden mb-4 block border border-neutral-200/50"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-luxury text-neutral-400">
                      ShopEase Atelier
                    </div>
                  )}

                  {/* Stock or Status Badge */}
                  {product.stock > 0 ? (
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-luxury bg-white/95 backdrop-blur-sm px-2.5 py-1 text-neutral-900 border border-neutral-200">
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-luxury bg-neutral-950 text-white px-2.5 py-1">
                      Sold Out
                    </span>
                  )}
                </Link>

                {/* Product Metadata */}
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                    {product.category || "Maison de Luxe"}
                  </p>

                  <Link
                    to={`/products/${product._id}`}
                    className="font-editorial text-lg sm:text-xl text-neutral-950 hover:text-neutral-600 transition-colors block line-clamp-1"
                  >
                    {product.name}
                  </Link>

                  <p className="text-xs text-neutral-700 font-light tracking-wide">
                    Rs. {product.price.toLocaleString()}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Products;