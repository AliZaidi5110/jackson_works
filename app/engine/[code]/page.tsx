"use client";

import React from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/jdm-context';
import {
  getEngineByCode, queryJdmProducts, getPackagesByEngine,
  calculateDeposit, CHASSIS, type JdmProduct,
} from '@/lib/jdm-catalog';
import {
  Wrench, ShieldCheck, Gauge, Zap, ChevronRight, ArrowRight,
  Package, ShoppingBag, Heart, CheckCircle, AlertCircle, Star,
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
  return <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${cls[condition] ?? 'badge-new'}`}>{condition}</span>;
}

function ProductCard({ product, vatInclusive }: { product: JdmProduct; vatInclusive: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const isWished = wishlist.some(w => w.id === product.id);
  const price = vatInclusive ? product.priceIncVat : product.priceExVat;
  const { deposit } = calculateDeposit(product.priceIncVat, product.depositPct);

  return (
    <div className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <ConditionBadge condition={product.condition} />
        </div>
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 border flex items-center justify-center transition-colors ${isWished ? 'border-red-600 text-red-700' : 'border-zinc-300 text-zinc-600 hover:text-red-700'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-3">
        <Link href={`/product/${product.id}`} className="font-bold text-sm text-zinc-950 hover:text-red-700 transition-colors line-clamp-2 font-heading block">
          {product.title}
        </Link>
        <div className="mt-auto">
          <span className="text-xl font-black text-zinc-950">{formatGBP(price)}</span>
          <span className="text-[10px] text-zinc-600 ml-1">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span>
          <p className="text-[11px] text-zinc-600 mt-0.5">Deposit: <span className="text-red-700 font-bold">{formatGBP(deposit)}</span></p>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-100 disabled:text-zinc-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          {product.inStock ? 'Add to Basket' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default function EngineLandingPage() {
  const params = useParams();
  const code = (params?.code as string)?.toUpperCase().replace(/-/g, '-');
  const { vatInclusive, products } = useApp();

  // Try to match the engine code (handles url slugs like "2jz-gte")
  const engine = (() => {
    const raw = (params?.code as string) ?? '';
    const upper = raw.toUpperCase();
    return getEngineByCode(upper) ?? getEngineByCode(upper.replace(/-/g, ''));
  })();

  if (!engine) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-2xl font-black text-zinc-950 font-heading">Engine Not Found</h2>
        <p className="text-zinc-600 text-sm">We could not find an engine matching &quot;{params?.code}&quot;.</p>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">Browse All Parts</Link>
      </div>
    );
  }

  const packages = getPackagesByEngine(engine.code);
  const parts = queryJdmProducts({ products, engine: engine.code, limit: 12 }).products;
  const compatChassis = CHASSIS.filter(c => c.engines.includes(engine.code));

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative min-h-[400px] bg-zinc-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=80" alt={engine.name} className="w-full h-full object-cover opacity-15" />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[250px] bg-red-600/10 blur-3xl rounded-full -translate-x-1/4 translate-y-1/4" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/make/${engine.make}`} className="hover:text-zinc-300 transition-colors capitalize">{engine.make}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-300 font-mono font-bold">{engine.code}</span>
          </nav>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-white font-heading font-mono tracking-tight">{engine.code}</h1>
            <p className="text-xl text-zinc-300 font-bold">{engine.name}</p>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              <span><strong className="text-white">{engine.displacement}</strong> · {engine.config}</span>
              <span><strong className="text-white">{engine.power}</strong></span>
              <span><strong className="text-white">{engine.torque}</strong></span>
              <span>{engine.induction}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Specs, Common Failures, Upgrades */}
      <section className="py-12 bg-zinc-100 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h3 className="font-black text-zinc-950 text-sm font-heading mb-4 flex items-center gap-2"><Gauge className="w-4 h-4 text-red-700" /> Specifications</h3>
            <dl className="space-y-2 text-xs">
              {[
                ['Displacement', engine.displacement],
                ['Configuration', engine.config],
                ['Power', engine.power],
                ['Torque', engine.torque],
                ['Induction', engine.induction],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-zinc-600">{k}</dt>
                  <dd className="text-zinc-950 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h3 className="font-black text-zinc-950 text-sm font-heading mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-amber-700" /> Common Failures</h3>
            <ul className="space-y-2">
              {engine.commonFailures.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-zinc-700"><AlertCircle className="w-3 h-3 text-amber-700 mt-0.5 shrink-0" />{f}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6">
            <h3 className="font-black text-zinc-950 text-sm font-heading mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-green-700" /> Upgrade Paths</h3>
            <ul className="space-y-2">
              {engine.upgradePaths.map(u => (
                <li key={u} className="flex items-start gap-2 text-xs text-zinc-700"><CheckCircle className="w-3 h-3 text-green-700 mt-0.5 shrink-0" />{u}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Compatible chassis */}
      {compatChassis.length > 0 && (
        <section className="py-12 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-zinc-950 font-heading mb-6">Compatible Vehicles</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {compatChassis.map(c => (
                <div key={c.code} className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-700 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-zinc-950">{c.name}</p>
                    <p className="text-[10px] text-zinc-600 font-mono">{c.code} · {c.years}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Engine Packages */}
      {packages.length > 0 && (
        <section className="py-12 bg-zinc-100 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">Ready to fit</p>
                <h2 className="text-2xl font-black text-zinc-950 font-heading">{engine.code} Engine Packages</h2>
              </div>
              <Link href="/#engine-packages" className="text-sm font-bold text-red-700 hover:text-red-900 transition-colors hidden sm:flex items-center gap-2">
                Featured packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map(pkg => {
                const price = vatInclusive ? pkg.priceIncVat : pkg.priceExVat;
                const { deposit } = calculateDeposit(pkg.priceIncVat);
                return (
                  <div key={pkg.id} className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <ConditionBadge condition={pkg.condition} />
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">{pkg.tier}</span>
                    </div>
                    <h3 className="font-bold text-zinc-950 text-sm font-heading">{pkg.title}</h3>
                    <ul className="space-y-1">
                      {pkg.includedItems.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-zinc-600"><CheckCircle className="w-3 h-3 text-green-700 shrink-0" />{item.name}</li>
                      ))}
                      {pkg.includedItems.length > 3 && <li className="text-[11px] text-zinc-600 pl-5">+{pkg.includedItems.length - 3} more</li>}
                    </ul>
                    <div>
                      <span className="text-2xl font-black text-zinc-950">{formatGBP(price)}</span>
                      <span className="text-xs text-zinc-600 ml-1">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span>
                      <p className="text-[11px] text-zinc-600 mt-1">Deposit: <span className="text-red-700 font-bold">{formatGBP(deposit)}</span></p>
                    </div>
                    <Link href="/contact" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs text-center transition-colors block">
                      Enquire about this package
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Parts */}
      {parts.length > 0 && (
        <section className="py-12 bg-zinc-50 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl font-black text-zinc-950 font-heading">{engine.code} Parts</h2>
              <Link href={`/shop?engine=${engine.code}`} className="text-sm font-bold text-red-700 hover:text-red-700 transition-colors flex items-center gap-2">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {parts.slice(0, 8).map(p => (
                <ProductCard key={p.id} product={p} vatInclusive={vatInclusive} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
