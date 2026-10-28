import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../services/productApi";

function Home() {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getProducts();
        if (data && data.products) {
          // Take first 4 products for the editorial showcase
          setFeaturedProducts(data.products.slice(0, 4));

          // Extract unique categories
          const uniqueCats = Array.from(
            new Set(
              data.products
                .map((p) => p.category?.trim())
                .filter(Boolean)
            )
          );
          setCategories(uniqueCats);
        }
      } catch (err) {
        console.error("Failed to load featured creations", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeatured();
  }, []);

  const primaryCategory = categories[0] || "Electronics";
  const secondaryCategory = categories[1] || categories[0] || "Electronics";
  const tertiaryCategory = categories[2] || categories[0] || "Electronics";

  return (
    <div className="bg-[#fbfbf9] text-[#0a0a0a]">
      {/* 1. Cinematic Full-Bleed Campaign Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden">
        {/* Background Visual Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Gucci Style High Fashion Campaign"
            className="w-full h-full object-cover object-center opacity-70 scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <span className="inline-block text-[11px] sm:text-xs uppercase tracking-luxury font-medium text-neutral-300 mb-6 bg-white/10 backdrop-blur-md px-4 py-1.5 border border-white/20">
            Fall Winter 2026 Campaign
          </span>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.08] max-w-4xl">
            An Ode to Timeless Elegance
          </h1>

          <p className="mt-6 max-w-xl text-xs sm:text-sm md:text-base text-neutral-300 font-light leading-relaxed tracking-wide">
            Explore architectural silhouettes, rare materials, and artisanal Italian craftsmanship curated for the modern connoisseur.
          </p>

          {user && (
            <p className="mt-4 text-xs uppercase tracking-luxury text-[#c5a880]">
              Welcome back to the Maison, {user.name}
            </p>
          )}

          {/* Action Callouts */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-5">
            <Link
              to="/products"
              className="w-full sm:w-auto px-9 py-4 bg-white text-neutral-950 text-xs uppercase tracking-luxury font-semibold hover:bg-neutral-200 transition-all duration-300 border border-white shadow-lg"
            >
              Explore The Collection
            </Link>

            <Link
              to={`/products?category=${encodeURIComponent(primaryCategory)}`}
              className="w-full sm:w-auto px-9 py-4 bg-transparent text-white text-xs uppercase tracking-luxury font-medium hover:bg-white/15 transition-all duration-300 border border-white/40 backdrop-blur-sm"
            >
              {primaryCategory} Collection
            </Link>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-neutral-400">
          <span className="text-[9px] uppercase tracking-luxury font-medium">Scroll</span>
          <div className="w-[1px] h-8 bg-neutral-400/50 animate-pulse" />
        </div>
      </section>

      {/* 2. Editorial Trilogy: Curated Seasonal Capsules */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] uppercase tracking-luxury text-neutral-500 font-semibold mb-2">
            The Seasonal Capsules
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-neutral-950">
            Iconic Expressions of the House
          </h2>
          <div className="w-12 h-[1px] bg-neutral-400 mx-auto mt-4" />

          {/* Category Pills Bar */}
          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <Link
                to="/products"
                className="px-4 py-2 border border-neutral-300 text-[11px] uppercase tracking-luxury text-neutral-700 hover:border-black hover:text-black transition-colors"
              >
                All Pieces
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="px-4 py-2 border border-neutral-300 text-[11px] uppercase tracking-luxury text-neutral-700 hover:border-black hover:text-black transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <Link
            to={`/products?category=${encodeURIComponent(primaryCategory)}`}
            className="group relative overflow-hidden bg-neutral-900 aspect-[3/4] flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80"
              alt="Leather Goods"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-1">
                Capsule I
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal mb-2">
                {primaryCategory} Collection
              </h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                <span>Explore {primaryCategory}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            to={`/products?category=${encodeURIComponent(secondaryCategory)}`}
            className="group relative overflow-hidden bg-neutral-900 aspect-[3/4] flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=80"
              alt="Ready to Wear"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-1">
                Capsule II
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal mb-2">
                {secondaryCategory !== primaryCategory
                  ? `${secondaryCategory} Line`
                  : "Artisanal Silhouettes"}
              </h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                <span>Explore Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            to={`/products?category=${encodeURIComponent(tertiaryCategory)}`}
            className="group relative overflow-hidden bg-neutral-900 aspect-[3/4] flex flex-col justify-end p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80"
              alt="Artisanal Accessories"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 text-white">
              <span className="text-[10px] uppercase tracking-luxury text-neutral-400 block mb-1">
                Capsule III
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal mb-2">
                High Atelier Creations
              </h3>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                <span>Discover All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Featured Creations Showcase (Live Products from API) */}
      <section className="py-20 border-t border-[#e8e8e6] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-12">
            <div>
              <p className="text-[11px] uppercase tracking-luxury text-neutral-500 font-semibold mb-1">
                Curated Selections
              </p>
              <h2 className="font-editorial text-3xl sm:text-4xl text-neutral-950 font-normal">
                Featured Creations
              </h2>
            </div>

            <Link
              to="/products"
              className="mt-4 md:mt-0 text-xs uppercase tracking-luxury font-medium text-neutral-900 hover:text-neutral-500 transition-colors inline-flex items-center gap-1.5"
            >
              <span>View All Creations</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse space-y-4">
                  <div className="bg-neutral-100 aspect-[3/4]" />
                  <div className="h-4 bg-neutral-100 w-3/4 mx-auto" />
                  <div className="h-3 bg-neutral-100 w-1/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              {featuredProducts.map((product) => (
                <article key={product._id} className="group flex flex-col text-center">
                  <Link
                    to={`/products/${product._id}`}
                    className="relative aspect-[3/4] bg-[#f5f4ef] overflow-hidden mb-4 block border border-neutral-200/50"
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-luxury text-neutral-400">
                        ShopEase Creation
                      </div>
                    )}

                    {product.stock > 0 ? (
                      <span className="absolute top-3 left-3 text-[9px] uppercase tracking-luxury bg-white/90 backdrop-blur-sm px-2.5 py-1 text-neutral-900 border border-neutral-200">
                        In Stock
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 text-[9px] uppercase tracking-luxury bg-neutral-950 text-white px-2.5 py-1">
                        Sold Out
                      </span>
                    )}
                  </Link>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium">
                      {product.category || "The Maison"}
                    </p>

                    <Link
                      to={`/products/${product._id}`}
                      className="font-editorial text-lg text-neutral-950 hover:text-neutral-600 transition-colors block line-clamp-1"
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
          ) : (
            <div className="text-center py-16 bg-neutral-50 border border-neutral-200">
              <p className="font-editorial text-2xl text-neutral-700">
                Discover the new season in our full catalog
              </p>
              <Link
                to="/products"
                className="mt-4 inline-block px-7 py-3 bg-neutral-950 text-white text-xs uppercase tracking-luxury"
              >
                Explore Catalogue
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 4. Split-Screen Editorial Storytelling ("The Art of Craftsmanship") */}
      <section className="border-t border-[#e8e8e6] bg-[#fbfbf9]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[700px]">
          {/* Left Media Column */}
          <div className="relative overflow-hidden min-h-[400px] lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80"
              alt="Artisanal Atelier Craftsmanship"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Right Narrative Column */}
          <div className="flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-20 bg-[#fbfbf9]">
            <span className="text-[11px] uppercase tracking-luxury text-neutral-500 font-semibold mb-4 block">
              Maison Heritage & Atelier
            </span>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-normal leading-tight text-neutral-950 mb-6">
              The Architecture of Craftsmanship
            </h2>

            <blockquote className="font-editorial italic text-lg sm:text-xl text-neutral-700 border-l border-neutral-400 pl-5 my-4 leading-relaxed">
              "True luxury does not clamor for attention; it commands presence through flawless proportion, sacred patience, and timeless form."
            </blockquote>

            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed mb-8">
              Every creation housed within the ShopEase vault represents months of deliberate material sourcing and master artisan tailoring. From hand-burnished edge finishing to solid palladium hardware, our creations are designed to endure across generations.
            </p>

            <div>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury font-semibold text-neutral-950 pb-1 border-b border-neutral-950 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
              >
                <span>Explore Full Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Maison Reassurance & Private Services */}
      <section className="py-20 border-t border-[#e8e8e6] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <p className="text-[11px] uppercase tracking-luxury text-neutral-400 font-medium mb-3">
            Gucci-Grade Standards
          </p>
          <h2 className="font-editorial text-3xl sm:text-4xl text-neutral-950 font-normal mb-14">
            The ShopEase Commitment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            <div className="p-8 border border-neutral-200 bg-[#fbfbf9]">
              <span className="text-xs font-mono text-neutral-400 block mb-3">01 / DISPATCH</span>
              <h3 className="font-editorial text-2xl text-neutral-950 mb-3 font-normal">
                Complimentary Express Shipping
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Every acquisition is inspected and packed within bespoke protective tissue before being couriered with full transit insurance.
              </p>
            </div>

            <div className="p-8 border border-neutral-200 bg-[#fbfbf9]">
              <span className="text-xs font-mono text-neutral-400 block mb-3">02 / PACKAGING</span>
              <h3 className="font-editorial text-2xl text-neutral-950 mb-3 font-normal">
                Signature Gift Presentation
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Enclosed inside our signature structured gift box tied with woven Grosgrain ribbon, accompanied by an embossed certificate.
              </p>
            </div>

            <div className="p-8 border border-neutral-200 bg-[#fbfbf9]">
              <span className="text-xs font-mono text-neutral-400 block mb-3">03 / CONCIERGE</span>
              <h3 className="font-editorial text-2xl text-neutral-950 mb-3 font-normal">
                Personal Client Advisor
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Our knowledgeable client advisors are dedicated to assisting with sizing, material provenance, and private orders.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;