"use client";

import React, { useState } from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/jdm-context';
import {
  getJdmProductById, queryJdmProducts, calculateDeposit,
  ENGINES, CHASSIS,
  type JdmProduct,
} from '@/lib/jdm-catalog';
import {
  ShieldCheck, Truck, ShoppingBag, Heart, Star, Phone,
  ChevronRight, CheckCircle, Info, ArrowLeft, Package,
  Gauge, Wrench, Zap, Mail,
} from 'lucide-react';

// ── Condition badge ──────────────────────────────────────────────────────────
function ConditionBadge({ condition }: { condition: string }) {
  const cls: Record<string, string> = {
    'New':           'badge-new',
    'Used JDM':      'badge-used-jdm',
    'Reconditioned': 'badge-reconditioned',
    'Rebuilt':       'badge-rebuilt',
    'Aftermarket':   'badge-aftermarket',
  };
  return (
    <span className={`text-xs font-black uppercase px-3 py-1 rounded-lg ${cls[condition] ?? 'badge-new'}`}>
      {condition}
    </span>
  );
}

// ── Related Product Card ─────────────────────────────────────────────────────
function RelatedCard({ product, vatInclusive }: { product: JdmProduct; vatInclusive: boolean }) {
  const price = vatInclusive ? product.priceIncVat : product.priceExVat;
  return (
    <Link href={`/product/${product.id}`} className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-zinc-50">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-2 left-2">
          <ConditionBadge condition={product.condition} />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex flex-wrap gap-1">
          {product.engines.slice(0, 2).map(eng => (
            <span key={eng} className="text-[9px] font-black font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-300">{eng}</span>
          ))}
        </div>
        <h4 className="font-bold text-sm text-zinc-950 line-clamp-2 font-heading">{product.title}</h4>
        <p className="text-lg font-black text-zinc-950">{formatGBP(price)} <span className="text-[10px] text-zinc-600 font-normal">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span></p>
      </div>
    </Link>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const { addToCart, toggleWishlist, wishlist, vatInclusive, products } = useApp();
  const product = getJdmProductById(id, products);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 flex items-center justify-center">
          <Package className="w-10 h-10 text-zinc-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-zinc-950 font-heading">Product Not Found</h2>
          <p className="text-zinc-600 text-sm mt-2">This part may have been sold or removed.</p>
        </div>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
          Browse Parts
        </Link>
      </div>
    );
  }

  const isWished = wishlist.some(w => w.id === product.id);
  const price = vatInclusive ? product.priceIncVat : product.priceExVat;
  const { deposit, balance } = calculateDeposit(product.priceIncVat, product.depositPct);
  const allImages = [product.image, ...product.images].filter(Boolean);

  // Fitment data
  const fittedChassis = CHASSIS.filter(c => product.chassis.includes(c.code));
  const engineData = ENGINES.filter(e => product.engines.includes(e.code));

  // Related products (same engine/category, different product)
  const related = queryJdmProducts({ products, engine: product.engines[0], limit: 8 })
    .products.filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/shop" className="hover:text-zinc-700 transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/shop?category=${product.categoryId}`} className="hover:text-zinc-700 transition-colors capitalize">
          {product.categoryId.replace(/-/g, ' ')}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium line-clamp-1">{product.shortTitle}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Image Gallery ───────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative aspect-[4/3] bg-white border border-zinc-200 rounded-2xl overflow-hidden">
            <img
              src={allImages[activeImage]}
              alt={product.title}
              className="w-full h-full object-contain p-6"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <ConditionBadge condition={product.condition} />
              {product.isNewArrival && (
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">NEW ARRIVAL</span>
              )}
              {product.isBestSeller && (
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">POPULAR</span>
              )}
            </div>
          </div>
          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-colors ${i === activeImage ? 'border-red-600' : 'border-zinc-200 hover:border-zinc-400'}`}
                >
                  <img src={img} alt={`${product.title} view ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ─────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-5">
          {/* Engine badges */}
          <div className="flex flex-wrap gap-2">
            {product.engines.map(eng => (
              <Link key={eng} href={`/engine/${eng.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[10px] font-black font-mono uppercase px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-300 hover:border-red-600 hover:text-red-700 transition-colors">
                {eng}
              </Link>
            ))}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 font-heading leading-tight">{product.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
              <span>SKU: <strong className="text-zinc-700 font-mono">{product.sku}</strong></span>
              <span>Part №: <strong className="text-zinc-700 font-mono">{product.partNumber}</strong></span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-bold text-zinc-600">Brand:</span>
              <span className="text-xs font-bold text-zinc-950">{product.brand}</span>
            </div>
          </div>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-amber-700 fill-amber-400' : 'text-zinc-700'}`} />
                ))}
              </div>
              <span className="text-xs font-bold text-zinc-600">Sample rating — replace with genuine review data</span>
            </div>
          )}

          {/* Price block */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-950">{formatGBP(price)}</span>
              {product.wasPrice && <span className="text-lg text-zinc-600 line-through">{formatGBP(product.wasPrice)}</span>}
              <span className="text-xs text-zinc-600">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span>
            </div>
            {vatInclusive && (
              <p className="text-xs text-zinc-600">Excluding VAT: {formatGBP(product.priceExVat)}</p>
            )}

            {/* Deposit breakdown */}
            <div className="deposit-box px-4 py-3 rounded-xl">
              <p className="text-sm font-bold text-zinc-800">
                Pay <span className="text-red-700 font-black">{formatGBP(deposit)}</span> today (10% deposit)
              </p>
              <p className="text-xs text-zinc-600 mt-1">Balance of {formatGBP(balance)} due before dispatch.</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-zinc-400'}`} />
              <span className={`text-sm font-bold ${product.inStock ? 'text-green-700' : 'text-zinc-600'}`}>{product.stockStatus}</span>
              {product.stockCount > 0 && product.stockCount <= 3 && (
                <span className="text-xs text-amber-700 font-bold">Only {product.stockCount} left</span>
              )}
            </div>

            {/* Used engine details */}
            {product.mileage && (
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 space-y-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Used Engine Details</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-zinc-600">Mileage:</span> <strong className="text-zinc-950">{product.mileage.toLocaleString()} km</strong></div>
                  <div><span className="text-zinc-600">Compression:</span> <strong className="text-zinc-700">{product.specifications['Compression Test'] || 'Tested before dispatch'}</strong></div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-100 disabled:text-zinc-600 text-white font-black py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200/50"
            >
              <ShoppingBag className="w-4 h-4" />
              {product.inStock ? 'Add to Basket' : 'Out of Stock'}
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
              className={`p-4 rounded-xl border transition-colors ${isWished ? 'border-red-600 bg-red-50 text-red-700' : 'border-zinc-300 bg-white text-zinc-600 hover:text-red-700 hover:border-red-200'}`}
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Enquiry */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link href="/contact" className="flex-1 flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 py-3 rounded-xl text-xs font-bold transition-colors">
              <Phone className="w-3.5 h-3.5 text-red-700" /> Contact Details
            </Link>
            <Link href="/contact"
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-700 py-3 rounded-xl text-xs font-bold transition-colors">
              <Mail className="w-3.5 h-3.5 text-red-700" /> Enquiry Preview
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, label: 'Warranty: confirm per item' },
              { icon: Truck, label: 'Delivery: rates to be confirmed' },
              { icon: Wrench, label: 'Fitting: confirm availability' },
              { icon: CheckCircle, label: 'Sample deposit only' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-zinc-600">
                <Icon className="w-4 h-4 text-red-700 shrink-0" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Specifications / Fitment ──────── */}
      <div className="mt-12 space-y-8">

        {/* Description */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-black text-zinc-950 font-heading mb-4">Description</h2>
          <div className="text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </section>

        {/* Specifications */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-black text-zinc-950 font-heading mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {Object.entries(product.specifications).map(([key, value], i) => (
              <div key={key} className={`flex justify-between py-3 px-4 text-sm border-b border-zinc-800 ${i % 2 === 0 ? 'bg-zinc-50' : ''}`}>
                <span className="text-zinc-600 font-medium">{key}</span>
                <span className="text-zinc-950 font-bold text-right">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Fitment */}
        {fittedChassis.length > 0 && (
          <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-black text-zinc-950 font-heading mb-4">Vehicle Fitment</h2>
            <p className="text-xs text-zinc-600 mb-4 flex items-center gap-2">
              <Info className="w-3.5 h-3.5" />
              This part fits the following vehicles. Not sure? Contact us to check.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fittedChassis.map(c => (
                <div key={c.code} className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-zinc-950">{c.name}</p>
                    <p className="text-[10px] text-zinc-600 font-mono">{c.code} · {c.years}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Related Products ──────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-zinc-950 font-heading">Related Parts</h2>
            <Link href={`/shop?engine=${product.engines[0]}`} className="text-sm font-bold text-red-700 hover:text-red-700 transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map(p => (
              <RelatedCard key={p.id} product={p} vatInclusive={vatInclusive} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
