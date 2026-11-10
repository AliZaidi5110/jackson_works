"use client";

import React, { useState } from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useApp } from '@/lib/jdm-context';
import {
  MAKES, ENGINES, PART_CATEGORIES, SAMPLE_PRODUCTS,
  ENGINE_PACKAGES, getFeaturedPackages, queryJdmProducts,
  calculateDeposit,
} from '@/lib/jdm-catalog';
import {
  ChevronRight, Wrench, ShieldCheck, Star, ShoppingBag, Heart,
  Gauge, Zap, Layers, Package, Phone, ArrowRight, CheckCircle,
  Cpu, Clock, Award, Truck, Settings2,
} from 'lucide-react';

const SHOP_CATEGORIES = [
  { id: 'complete-engines', name: 'Complete Engines', icon: Wrench, color: 'bg-amber-100 text-amber-900' },
  { id: 'engine-internals', name: 'Engine Internals', icon: Settings2, color: 'bg-orange-100 text-orange-900' },
  { id: 'turbo-induction', name: 'Turbo & Induction', icon: Gauge, color: 'bg-rose-100 text-rose-900' },
  { id: 'tcu-transmission', name: 'Transmission Controllers', icon: Cpu, color: 'bg-cyan-100 text-cyan-900' },
  { id: 'gearbox-kits', name: 'Gearbox Kits', icon: Layers, color: 'bg-violet-100 text-violet-900' },
];

// ── Condition badge helper ───────────────────────────────────────────────────
function ConditionBadge({ condition }: { condition: string }) {
  const cls: Record<string, string> = {
    'New':           'badge-new',
    'Used JDM':      'badge-used-jdm',
    'Reconditioned': 'badge-reconditioned',
    'Rebuilt':       'badge-rebuilt',
    'Aftermarket':   'badge-aftermarket',
  };
  return (
    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${cls[condition] ?? 'badge-new'}`}>
      {condition}
    </span>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product, vatInclusive }: { product: any; vatInclusive: boolean }) {
  const { addToCart, toggleWishlist, wishlist } = useApp();
  const isWished = wishlist.some(w => w.id === product.id);
  const price = vatInclusive ? product.priceIncVat : product.priceExVat;
  const { deposit } = calculateDeposit(product.priceIncVat, product.depositPct);

  return (
    <div className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <ConditionBadge condition={product.condition} />
          {product.isNewArrival && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">NEW</span>
          )}
          {product.isBestSeller && (
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">POPULAR</span>
          )}
        </div>
        <button
          onClick={() => toggleWishlist(product)}
          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 border flex items-center justify-center transition-colors ${isWished ? 'border-red-600 text-red-700' : 'border-zinc-300 text-zinc-600 hover:text-red-700'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          {/* Engine badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.engines.slice(0, 2).map((eng: string) => (
              <span key={eng} className="text-[9px] font-black font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-300">
                {eng}
              </span>
            ))}
          </div>
          <Link
            href={`/product/${product.id}`}
            className="font-bold text-sm text-zinc-950 hover:text-red-700 transition-colors line-clamp-2 font-heading leading-snug block"
          >
            {product.title}
          </Link>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-zinc-950">{formatGBP(price)}</span>
            {product.wasPrice && (
              <span className="text-xs text-zinc-600 line-through">{formatGBP(product.wasPrice)}</span>
            )}
            <span className="text-[10px] text-zinc-600">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span>
          </div>
          {/* Deposit callout */}
          <p className="text-[11px] text-zinc-600 mt-0.5">
            10% deposit: <span className="text-red-700 font-bold">{formatGBP(deposit)}</span>
          </p>
          {/* Stock indicator */}
          <div className="flex items-center gap-1 mt-1">
            <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-green-400' : 'bg-zinc-400'}`} />
            <span className={`text-[10px] font-semibold ${product.inStock ? 'text-green-700' : 'text-zinc-600'}`}>
              {product.stockStatus}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-100 disabled:text-zinc-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {product.inStock ? 'Add to Basket' : 'Out of Stock'}
          </button>
          <Link
            href={`/product/${product.id}`}
            className="px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { vatInclusive, setActiveVehicle, addToCart, products } = useApp();
  const [enquiryState, setEnquiryState] = useState('');
  const [fitMake, setFitMake] = useState('');
  const [fitEngine, setFitEngine] = useState('');

  // Filtered engines for fitment finder
  const availableEngines = fitMake
    ? MAKES.find(m => m.id === fitMake)?.engines ?? []
    : ENGINES.map(e => e.code);

  const popularProducts = queryJdmProducts({ products, popular: true, limit: 8 }).products;
  const featuredPackages = getFeaturedPackages();
  const newArrivals = queryJdmProducts({ products, newArrival: true, limit: 4 }).products;

  const handleFitmentSearch = () => {
    setActiveVehicle(fitMake && fitEngine ? { make: fitMake, engine: fitEngine } : null);
    const params = new URLSearchParams();
    if (fitMake) params.set('make', fitMake);
    if (fitEngine) params.set('engine', fitEngine);
    const query = params.toString();
    window.location.href = query ? `/shop?${query}` : '/shop';
  };

  const sendQuickEnquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEnquiryState('Sending…');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Message could not be sent.');
      form.reset();
      setEnquiryState('Thanks — your message has been sent.');
    } catch (error) {
      setEnquiryState(error instanceof Error ? error.message : 'Message could not be sent.');
    }
  };

  return (
    <div className="space-y-0">

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative mx-4 mt-5 overflow-hidden rounded-2xl bg-zinc-950 sm:mx-6 lg:mx-auto lg:w-[calc(100%-3rem)] lg:max-w-[75rem]">
        <div className="hero-overlay absolute inset-0" />

        <div className="relative z-10 grid grid-cols-1 items-center gap-7 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">

          {/* Hero copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-cyan-950/70 border border-cyan-400/40 px-3.5 py-1.5 rounded-full text-cyan-200 text-xs font-bold">
              <span className="w-2 h-2 shrink-0 rounded-full bg-cyan-300" />
              JDM engines, parts &amp; workshop services
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] font-heading">
              Japanese Engine<br />
              <span className="text-gradient-warm">Parts &amp; Upgrades</span>
            </h1>

            <p className="max-w-md text-zinc-200">
              Browse JDM engines, turbo kits, internals and gearbox conversions by make or engine code.
            </p>

            {/* CTA shortcuts */}
            <div className="flex flex-wrap gap-2 pt-2 sm:gap-3">
              <Link
                href="#engine-packages"
                className="button-bright flex items-center gap-2 px-3 py-3 rounded-xl font-black text-sm shadow-xl shadow-amber-400/20 transition-colors sm:px-6"
              >
                <Package className="w-4 h-4" />
                Engine Packages
              </Link>
              <Link
                href="/shop?category=complete-engines"
                className="flex items-center gap-2 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-100 px-3 py-3 rounded-xl font-bold text-sm transition-colors sm:px-6"
              >
                Shop All Engines
              </Link>
              <Link
                href="/workshop"
                className="flex items-center gap-2 bg-transparent border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-3 py-3 rounded-xl font-bold text-sm transition-colors sm:px-6"
              >
                <Wrench className="w-4 h-4 text-red-500" />
                Workshop
              </Link>
            </div>

          </div>

          {/* ── Fitment Finder Card ──────────────────────────────── */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-white p-4 text-zinc-950 shadow-lg sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-900">
                  <Gauge className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="type-h3 font-black leading-none">Engine Finder</h2>
                  <p className="mt-0.5 text-xs text-zinc-600">Find parts for your build</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Make */}
                <div>
                  <label htmlFor="fit-make" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Make
                  </label>
                  <select
                    id="fit-make"
                    value={fitMake}
                    onChange={e => { setFitMake(e.target.value); setFitEngine(''); }}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="">All Makes</option>
                    {MAKES.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Engine */}
                <div>
                  <label htmlFor="fit-engine" className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Engine
                  </label>
                  <select
                    id="fit-engine"
                    value={fitEngine}
                    onChange={e => setFitEngine(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-red-600 transition-colors font-mono"
                  >
                    <option value="">All Engines</option>
                    {availableEngines.map(eng => (
                      <option key={eng} value={eng}>{eng}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleFitmentSearch}
                  className="button-bright w-full font-black py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Gauge className="w-4 h-4" />
                  Find Parts
                </button>

              </div>

              {/* Quick engine shortcuts */}
              <div className="mt-4 border-t border-zinc-200 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Popular engines</p>
                <div className="flex flex-wrap gap-2">
                  {['2JZ-GTE', 'RB26DETT', 'RB25DET', 'SR20DET', '4G63'].map(eng => (
                    <Link
                      key={eng}
                      href={`/engine/${eng.toLowerCase().replace(/\s+/g, '-')}`}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-700 hover:border-amber-400 hover:bg-amber-50 transition-colors"
                    >
                      {eng}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="shop-categories" className="mx-auto max-w-7xl px-4 pb-8 pt-9 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="shop-categories" className="text-zinc-950">Shop by Category</h2>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:underline">
            Browse all parts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SHOP_CATEGORIES.map(({ id, name, icon: Icon, color }) => (
            <Link key={id} href={`/shop?category=${id}`} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-sm font-bold text-zinc-950 transition-colors hover:border-amber-400 sm:p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}><Icon className="h-5 w-5" /></span>
              {name}
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURED ENGINE PACKAGES
      ═══════════════════════════════════════════════════════════════ */}
      <section id="engine-packages" className="scroll-mt-40 bg-zinc-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">Ready to fit</p>
              <h2 className="text-3xl font-black text-zinc-950 font-heading">Engine Packages</h2>
              <p className="text-zinc-600 text-sm mt-1 max-w-xl">Sample package tiers, from engine only through to full swap concepts. Contents, fitment, availability and pricing need confirmation.</p>
            </div>
            <Link
              href="/shop?category=complete-engines"
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-700 transition-colors"
            >
              Browse complete engines <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPackages.slice(0, 3).map(pkg => {
              const price = vatInclusive ? pkg.priceIncVat : pkg.priceExVat;
              const { deposit } = calculateDeposit(pkg.priceIncVat);
              return (
                <div key={pkg.id} className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
                  <div className="relative aspect-[16/9] bg-zinc-50">
                    <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover opacity-80" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <ConditionBadge condition={pkg.condition} />
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                        {pkg.tier}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-2xl font-black text-white font-mono">{pkg.engineCode}</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="font-bold text-zinc-950 text-sm leading-snug font-heading">{pkg.title}</h3>
                      {pkg.mileage && (
                        <p className="text-[11px] text-zinc-600 mt-1">{pkg.mileage.toLocaleString()} km recorded</p>
                      )}
                    </div>
                    {/* Package items preview */}
                    <ul className="space-y-1">
                      {pkg.includedItems.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px] text-zinc-600">
                          <CheckCircle className="w-3 h-3 text-green-700 shrink-0" />
                          {item.name}
                        </li>
                      ))}
                      {pkg.includedItems.length > 3 && (
                        <li className="text-[11px] text-zinc-600 pl-5">+{pkg.includedItems.length - 3} more items included</li>
                      )}
                    </ul>
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-zinc-950">{formatGBP(price)}</span>
                        <span className="text-xs text-zinc-600">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span>
                      </div>
                      <div className="deposit-box px-3 py-2 mt-2 rounded-xl">
                        <p className="text-[11px] font-bold text-zinc-700">
                          Sample deposit <span className="text-red-700 font-black">{formatGBP(deposit)}</span> · Payment not connected
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className={`w-2 h-2 rounded-full ${pkg.inStock ? 'bg-green-400' : 'bg-zinc-400'}`} />
                        <span className={`text-xs font-semibold ${pkg.inStock ? 'text-green-700' : 'text-zinc-600'}`}>
                          {pkg.stockStatus}
                        </span>
                        {pkg.warranty && (
                          <span className="ml-auto text-[10px] text-zinc-600 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-zinc-600" />
                            {pkg.warranty}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href="/contact"
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                      >
                        Enquire <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                      {pkg.fittingAvailable && (
                        <Link
                          href="/workshop"
                          className="px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Wrench className="w-3.5 h-3.5 text-red-700" /> Fitting
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          MAKES / ENGINE PLATFORM TILES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-r from-sky-50 via-white to-violet-50 border-y border-sky-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-cyan-700 text-xs font-black uppercase tracking-widest mb-2">Platform specialist</p>
            <h2 className="text-3xl font-black text-zinc-950 font-heading">Shop by Make</h2>
            <p className="text-zinc-600 text-sm mt-2">Select your platform to browse compatible engines, parts and packages.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MAKES.map(make => (
              <Link
                key={make.id}
                href={`/make/${make.id}`}
                className="engine-tile group flex flex-col items-center gap-3 bg-white border border-zinc-200 rounded-2xl p-5 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center group-hover:border-red-600/50 transition-colors">
                  <Wrench className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <p className="font-bold text-zinc-950 text-sm group-hover:text-zinc-950 transition-colors">{make.name}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{make.engines.length} engines</p>
                </div>
                <ArrowRight className="engine-tile-arrow w-3.5 h-3.5 text-zinc-600 group-hover:text-red-700 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TCU + GEARBOX KITS FEATURE TILES
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* TCU tile */}
            <Link href="/shop?category=tcu-transmission"
              className="group rounded-2xl border border-cyan-500/40 hover:border-cyan-300 transition-colors bg-gradient-to-br from-cyan-50 to-zinc-50 p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-300 text-zinc-950 flex items-center justify-center">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-950 font-heading">TCU / Transmission Controllers</h3>
                <p className="text-zinc-600 text-sm mt-2 leading-relaxed">
                  Standalone and OEM transmission control units for automatic gearboxes. Plug-and-play looms, solenoids, valve bodies and paddle-shift kits.
                </p>
              </div>
              <div className="flex items-center gap-2 text-cyan-700 text-sm font-bold">
                Browse TCUs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Gearbox Kits tile */}
            <Link href="/shop?category=gearbox-kits"
              className="group rounded-2xl border border-violet-500/40 hover:border-violet-300 transition-colors bg-gradient-to-br from-violet-50 to-zinc-50 p-8 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-300 text-zinc-950 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-950 font-heading">Gearbox Kits</h3>
                <p className="text-zinc-600 text-sm mt-2 leading-relaxed">
                  Rebuild, upgrade and conversion kits for Japanese engine builds. Clutch and flywheel kits, bellhousing adapters, and complete gearbox packages.
                </p>
              </div>
              <div className="flex items-center gap-2 text-violet-700 text-sm font-bold">
                Browse Gearbox Kits <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          POPULAR PARTS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">Most ordered</p>
              <h2 className="text-3xl font-black text-zinc-950 font-heading">Popular Parts</h2>
            </div>
            <Link href="/shop?popular=true" className="hidden sm:flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-700 transition-colors">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularProducts.slice(0, 4).map(p => (
              <ProductCard key={p.id} product={p} vatInclusive={vatInclusive} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          WORKSHOP SERVICES TEASER
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl overflow-hidden border border-zinc-200 relative bg-gradient-to-r from-white to-zinc-50">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent" />
            <div className="relative z-10 p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full text-red-700 text-xs font-bold">
                  <Wrench className="w-3.5 h-3.5" />
                  Our Workshop
                </div>
                <h2 className="text-3xl lg:text-4xl font-black text-zinc-950 font-heading leading-tight">
                  Engine Swaps,<br />Rebuilds & Tuning
                </h2>
                <p className="text-zinc-600 leading-relaxed">
                  {/* TODO: Replace with real workshop description */}
                  We supply and fit. Our specialists carry out full engine swaps, rebuilds, gearbox conversions, turbo installations, ECU mapping and diagnostics. Book your vehicle in for a quote.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Wrench, label: 'Engine Swaps' },
                    { icon: Gauge,  label: 'Turbo Installation' },
                    { icon: Zap,    label: 'ECU Tuning & Dyno' },
                    { icon: Cpu,    label: 'TCU & Gearbox Fitting' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-zinc-700">
                      <Icon className="w-4 h-4 text-red-700 shrink-0" />
                      {label}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/workshop"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    View Services
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 border border-zinc-300 hover:border-zinc-500 text-zinc-700 hover:text-zinc-950 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    Get a Quote
                  </Link>
                </div>
              </div>
              {/* TODO: Replace with workshop photo */}
              <div className="hidden lg:block rounded-2xl overflow-hidden border border-zinc-200 aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80"
                  alt="JDM Engine Workshop"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DEPOSIT EXPLAINED
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <p className="text-red-700 text-xs font-black uppercase tracking-widest">How it works</p>
          <h2 className="text-3xl font-black text-zinc-950 font-heading">Secure Your Engine with a 10% Deposit</h2>
          <p className="text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            The store concept illustrates a deposit and balance payment flow. The percentage, stock preparation and payment terms still need confirmation, and no orders or payments can be made in this preview.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8">
            {[
              { step: '01', title: 'Sample deposit', desc: 'An example 10% deposit is displayed; payment is not connected.' },
              { step: '02', title: 'Order preparation', desc: 'The business must confirm its inspection, testing and fulfilment process.' },
              { step: '03', title: 'Sample balance', desc: 'Balance payment process and due date are still to be confirmed.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="bg-white border border-zinc-200 rounded-2xl p-6 text-left space-y-3">
                <span className="text-4xl font-black text-zinc-800 font-heading">{step}</span>
                <h3 className="font-black text-zinc-950 text-base font-heading">{title}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/deposit-policy"
            className="inline-flex items-center gap-2 text-red-700 hover:text-red-700 text-sm font-bold transition-colors mt-4"
          >
            Read our full Deposit Policy <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TRUST STRIP + CONTACT
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Trust */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-zinc-950 font-heading">Why Choose Us?</h2>
            {[
              { icon: Award,       title: 'Japanese engine platforms', desc: 'Browse sample catalogue pages for Toyota, Nissan, Mitsubishi, Honda, Mazda and Subaru applications.' },
              { icon: ShieldCheck, title: 'Warranty details',           desc: 'Warranty terms vary by product and need confirmation from the business before launch.' },
              { icon: Truck,       title: 'UK delivery',                desc: 'Delivery rates, service areas and lead times are TODO — confirm before taking orders.' },
              { icon: Star,        title: 'Customer reviews',           desc: 'Genuine customer reviews will be added once supplied and approved.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-red-700" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 text-sm mb-1">{title}</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick enquiry */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
            <h3 className="text-xl font-black text-zinc-950 font-heading">Quick Enquiry</h3>
            <p className="text-zinc-600 text-sm">Not sure what you need? Use the contact details confirmed by the business before launch.</p>
            <form onSubmit={sendQuickEnquiry} className="space-y-3">
              <input
                name="name"
                required
                type="text"
                placeholder="Your name"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <input
                name="email"
                required
                type="email"
                placeholder="Your email"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <input
                name="subject"
                type="text"
                placeholder="Engine / part you're looking for (e.g. 2JZ-GTE full swap)"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone number (optional)"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
              />
              <textarea
                name="message"
                required
                rows={3}
                placeholder="Any additional details about your build or vehicle…"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors resize-none"
              />
              {enquiryState && <p role="status" className={`text-xs ${enquiryState.startsWith('Thanks') ? 'text-green-700' : 'text-amber-700'}`}>{enquiryState}</p>}
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3 rounded-xl text-sm transition-colors">
                Send Enquiry
              </button>
            </form>
            <p className="text-zinc-600 text-[11px]">
              TODO — add a confirmed business phone number and enquiry destination before launch.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
