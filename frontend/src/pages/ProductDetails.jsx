import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Truck,
  Gift,
  ShieldCheck,
  ArrowLeft,
  Check,
  ShoppingBag,
} from "lucide-react";

import { getProductById } from "../services/productApi";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Accordion drawer states
  const [openAccordions, setOpenAccordions] = useState({
    details: true,
    materials: false,
    shipping: false,
    packaging: false,
  });

  const toggleAccordion = (key) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data.product);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to display this creation from the Maison."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      setError("");
      await addItem(product._id, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 4000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add creation to your shopping bag."
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbf9] max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="bg-neutral-200 aspect-[3/4] animate-pulse" />
          <div className="space-y-6 pt-10">
            <div className="h-4 bg-neutral-200 w-1/4" />
            <div className="h-10 bg-neutral-200 w-3/4" />
            <div className="h-6 bg-neutral-200 w-1/3" />
            <div className="h-24 bg-neutral-200 w-full" />
            <div className="h-12 bg-neutral-200 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-[70vh] bg-[#fbfbf9] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center border border-neutral-200 bg-white p-12">
          <h1 className="font-editorial text-3xl text-neutral-900 mb-3">
            Creation Unavailable
          </h1>
          <p className="text-xs text-neutral-500 mb-6 font-light">{error}</p>
          <Link
            to="/products"
            className="inline-block px-7 py-3 bg-neutral-950 text-white text-xs uppercase tracking-luxury font-medium"
          >
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#0a0a0a]">
      {/* Top Breadcrumb & Return Bar */}
      <div className="border-b border-[#e8e8e6] bg-white px-4 sm:px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-600 hover:text-black transition-colors pr-4 border-r border-neutral-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-luxury text-neutral-600 hover:text-black transition-colors"
            >
              <span>All Creations</span>
            </Link>
          </div>

          <nav className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-luxury text-neutral-400">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-black">Catalogue</Link>
            <span>/</span>
            <span className="text-neutral-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Editorial PDP Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Visual Presentation (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Portrait Hero Image */}
            <div className="relative aspect-[3/4] bg-[#f5f4ef] overflow-hidden border border-neutral-200/60">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-luxury text-neutral-400">
                  ShopEase Atelier Piece
                </div>
              )}

              {product.stock > 0 ? (
                <span className="absolute top-4 left-4 text-[9px] uppercase tracking-luxury bg-white/95 px-3 py-1.5 text-neutral-900 border border-neutral-200 font-medium">
                  Atelier Stock Verified
                </span>
              ) : (
                <span className="absolute top-4 left-4 text-[9px] uppercase tracking-luxury bg-neutral-950 text-white px-3 py-1.5">
                  Temporarily Out of Stock
                </span>
              )}
            </div>

            {/* Editorial Reassurance Bar */}
            <div className="grid grid-cols-3 gap-4 border border-neutral-200 bg-white p-5 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-neutral-500 mb-1" />
                <span className="text-[10px] uppercase tracking-luxury text-neutral-800 font-medium">
                  Guaranteed Authentic
                </span>
              </div>
              <div className="flex flex-col items-center border-x border-neutral-200 px-2">
                <Truck className="w-4 h-4 text-neutral-500 mb-1" />
                <span className="text-[10px] uppercase tracking-luxury text-neutral-800 font-medium">
                  Complimentary Shipping
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Gift className="w-4 h-4 text-neutral-500 mb-1" />
                <span className="text-[10px] uppercase tracking-luxury text-neutral-800 font-medium">
                  Signature Box Packaging
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Product Console (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-7">
            {/* Category & Title */}
            <div>
              <p className="text-[10px] uppercase tracking-luxury text-neutral-400 font-medium mb-2">
                {product.category || "House Collection"} • REF. {product._id?.slice(-6).toUpperCase()}
              </p>

              <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-neutral-950 leading-[1.15]">
                {product.name}
              </h1>

              <div className="mt-4 flex items-baseline gap-4">
                <p className="text-xl sm:text-2xl text-neutral-950 font-light tracking-wide">
                  Rs. {product.price.toLocaleString()}
                </p>
                <span className="text-[11px] text-neutral-500 font-light">
                  Tax and import duties included
                </span>
              </div>
            </div>

            {/* Stock Availability Indicator */}
            <div className="border-y border-neutral-200 py-3.5 flex items-center justify-between text-xs">
              <span className="text-neutral-500 uppercase tracking-luxury text-[10px]">
                Availability
              </span>
              {product.stock > 0 ? (
                <span className="text-neutral-900 font-medium uppercase tracking-luxury text-[10px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                  In Stock ({product.stock} pieces remaining)
                </span>
              ) : (
                <span className="text-red-700 font-medium uppercase tracking-luxury text-[10px]">
                  Currently Unavailable
                </span>
              )}
            </div>

            {/* Add to Shopping Bag CTA */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
                className="w-full py-4 bg-[#0a0a0a] text-white text-xs uppercase tracking-luxury-wide font-medium hover:bg-neutral-800 disabled:bg-neutral-300 transition-colors duration-200 flex items-center justify-center gap-2 border border-black shadow-md"
              >
                {adding ? (
                  <span>Reserving in Bag...</span>
                ) : product.stock === 0 ? (
                  <span>Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              {/* Success Notification Banner */}
              {addedSuccess && (
                <div className="p-3 bg-neutral-950 text-white text-xs uppercase tracking-luxury flex items-center justify-between border border-neutral-800 transition-all">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to your Shopping Bag</span>
                  </div>
                  <Link
                    to="/cart"
                    className="underline underline-offset-4 hover:text-neutral-300 font-semibold"
                  >
                    View Bag
                  </Link>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center uppercase tracking-luxury">
                  {error}
                </div>
              )}

              <p className="text-[11px] text-neutral-500 text-center font-light">
                Cash on Delivery supported nationwide. Insured courier handoff.
              </p>
            </div>

            {/* Luxury Accordion Drawers */}
            <div className="border-t border-neutral-200 divide-y divide-neutral-200 pt-2">
              {/* Drawer 1: Details & Silhouette */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-neutral-900"
                >
                  <span>Description & Details</span>
                  {openAccordions.details ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </button>

                {openAccordions.details && (
                  <div className="mt-3 text-xs text-neutral-600 font-light leading-relaxed space-y-2">
                    <p>{product.description || "An exclusive creation from the House archive, rendered with meticulous structural balance and fine finishing."}</p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                      <li>Designed for effortless ergonomic utility</li>
                      <li>Finished with subtle Maison monogram signature</li>
                      <li>Inspected by Master Artisans prior to packaging</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Drawer 2: Materials & Care (category-aware) */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("materials")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-neutral-900"
                >
                  <span>Materials &amp; Care</span>
                  {openAccordions.materials ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </button>

                {openAccordions.materials && (
                  <div className="mt-3 text-xs text-neutral-600 font-light leading-relaxed space-y-2">
                    {(() => {
                      const cat = (product.category || "").toLowerCase();
                      if (cat.includes("leather")) return (
                        <>
                          <p>Crafted in full-grain calfskin and GG Supreme coated canvas using traditional Florentine tanning methods. All hardware in palladium or gold-toned brass alloy.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Store in the provided dust bag, away from direct light</li>
                            <li>Clean with a slightly damp cloth; air dry naturally</li>
                            <li>Avoid contact with water, perfume, and abrasive surfaces</li>
                            <li>Stuff with tissue paper to maintain silhouette during storage</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("shoe")) return (
                        <>
                          <p>Uppers in full-grain calfskin or velvet suede, hand-lasted on traditional wooden lasts. Leather lining and insole for breathability; rubber or leather outsole.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Use a soft-bristle brush to clean suede — never use water directly</li>
                            <li>Apply a leather conditioner monthly to maintain smooth calfskin</li>
                            <li>Cedar shoe trees preserve the shape between wears</li>
                            <li>Rotate pairs to allow the leather to fully recover</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("wear")) return (
                        <>
                          <p>Fabrics sourced from certified Italian mills in Biella and Como. Wool and cashmere fibres are independently tested for diameter and pilling resistance.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Dry clean only — no machine wash or tumble dry</li>
                            <li>Steam gently on reverse; avoid direct iron contact on face</li>
                            <li>Fold knitwear flat to prevent stretching on hangers</li>
                            <li>Store with cedar blocks to deter moths</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("watch")) return (
                        <>
                          <p>Case in 316L surgical-grade stainless steel or scratch-resistant ceramic. Crystal in anti-reflective sapphire. Sealed to stated ISO 22810 water resistance.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Service by authorised watchmakers every 3–5 years</li>
                            <li>Avoid strong magnetic fields and temperature extremes</li>
                            <li>Rinse with fresh water after saltwater exposure</li>
                            <li>Clean bracelet with a soft brush and mild soapy water</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("fragrance")) return (
                        <>
                          <p>Composed by master perfumers in Grasse, France. IFRA-compliant; cruelty-free; no animal-derived ingredients. EDP concentration: 15–20%.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Store upright in a cool, dark location away from humidity</li>
                            <li>Apply to pulse points — wrists, neck, and décolleté</li>
                            <li>Do not spray directly onto delicate fabrics or jewellery</li>
                            <li>Best used within 18 months of opening</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("jewellery") || cat.includes("jewelry")) return (
                        <>
                          <p>Precious metals hallmarked and independently certified. Diamonds graded by GIA-certified gemmologists. All settings inspected for stone security prior to despatch.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Store individually in the provided silk pouch to prevent scratching</li>
                            <li>Clean with warm soapy water and a soft brush; rinse well</li>
                            <li>Remove before swimming, bathing, or using cleaning chemicals</li>
                            <li>Annual professional inspection recommended</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("electronics")) return (
                        <>
                          <p>Outer casing in top-grain leather or GG Supreme canvas. Internal components carry CE, FCC, and UKCA certifications. Batteries are UN38.3 air-freight safe.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Wipe leather surfaces with a dry microfibre cloth only</li>
                            <li>Do not expose to liquids unless explicitly rated waterproof</li>
                            <li>Use only the included or manufacturer-recommended charging cable</li>
                            <li>Recycle responsibly via an authorised e-waste programme</li>
                          </ul>
                        </>
                      );
                      if (cat.includes("home")) return (
                        <>
                          <p>Materials vary by piece: Limoges porcelain, solid cast brass, 100% silk twill, or natural soy wax — all tested to EU safety and food-contact standards where applicable.</p>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                            <li>Porcelain: dishwasher safe on delicate cycle; handwash preferred</li>
                            <li>Candles: trim wick to 5 mm before each burn; max 4h burn time</li>
                            <li>Silk: dry clean or hand wash cold; lay flat to dry</li>
                            <li>Brass: polish periodically with a specialist metal cloth</li>
                          </ul>
                        </>
                      );
                      return (
                        <>
                          <p>Crafted using sustainably sourced, premium-grade materials engineered for lasting durability and refined aesthetics.</p>
                          <p>Protect from prolonged exposure to heat, moisture, and abrasive surfaces. Clean with a soft, dry microfibre cloth.</p>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Drawer 3: Shipping & Delivery */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("shipping")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-neutral-900"
                >
                  <span>Complimentary Shipping & Returns</span>
                  {openAccordions.shipping ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </button>

                {openAccordions.shipping && (
                  <div className="mt-3 text-xs text-neutral-600 font-light leading-relaxed space-y-2">
                    <p>
                      All domestic orders receive complimentary express dispatch within 24–48 business hours via insured courier with real-time tracking updates.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                      <li>Standard delivery: 3–5 business days nationwide</li>
                      <li>Express delivery: 1–2 business days (select cities)</li>
                      <li>All parcels are fully insured and require a signature upon receipt</li>
                      <li>International shipping available — import duties calculated at checkout</li>
                    </ul>
                    <p>
                      Returns and exchanges accepted within 14 days of delivery. Items must be in pristine, unworn condition with all original tags, dust bags, and packaging intact.
                    </p>
                  </div>
                )}
              </div>

              {/* Drawer 4: Packaging */}
              <div className="py-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("packaging")}
                  className="w-full flex items-center justify-between text-left text-xs uppercase tracking-luxury font-medium text-neutral-900"
                >
                  <span>The Maison Gift Packaging</span>
                  {openAccordions.packaging ? (
                    <ChevronUp className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  )}
                </button>

                {openAccordions.packaging && (
                  <div className="mt-3 text-xs text-neutral-600 font-light leading-relaxed space-y-2">
                    <p>
                      Every creation is delivered within our signature structured gift box — finished in ivory matte card with the Maison emblem blind-debossed on the lid, wrapped in silk tissue, and sealed with an adhesive wax stamp.
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-neutral-500 pt-1">
                      <li>Tied by hand with a woven grosgrain satin ribbon in House colours</li>
                      <li>Accompanied by a printed authenticity and provenance dossier</li>
                      <li>Complimentary personalised handwritten gift note on request</li>
                      <li>All packaging materials are 100% recyclable and FSC-certified</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;