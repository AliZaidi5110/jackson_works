"use client";

import React, { useState, Suspense } from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/jdm-context';
import {
  queryJdmProducts, MAKES, ENGINES, PART_CATEGORIES,
  calculateDeposit, type JdmProduct, type Condition,
} from '@/lib/jdm-catalog';
import {
  Sliders, ShoppingBag, Heart, Star, ChevronDown, SlidersHorizontal,
  X, CheckCircle, ArrowUpDown,
} from 'lucide-react';

// Condition badge
function ConditionBadge({ condition }: { condition: Condition }) {
  const cls: Record<string, string> = {
    'New':           'badge-new',
    'Used JDM':      'badge-used-jdm',
    'Reconditioned': 'badge-reconditioned',
    'Rebuilt':       'badge-rebuilt',
    'Aftermarket':   'badge-aftermarket',
  };
  return <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${cls[condition] ?? 'badge-new'}`}>{condition}</span>;
}

function ShopContent() {
  const searchParams = useSearchParams();
  return <ShopResults key={searchParams.toString()} searchParams={searchParams} />;
}

function ShopResults({ searchParams }: { searchParams: ReturnType<typeof useSearchParams> }) {
  const { vatInclusive, addToCart, toggleWishlist, wishlist, products } = useApp();

  const [search,     setSearch]     = useState(searchParams.get('search') ?? '');
  const [make,       setMake]       = useState(searchParams.get('make')   ?? 'all');
  const [engine,     setEngine]     = useState(searchParams.get('engine') ?? 'all');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') ?? 'all');
  const [condition,  setCondition]  = useState<Condition | ''>('');
  const [inStock,    setInStock]    = useState(false);
  const [sortBy,     setSortBy]     = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');
  const [page,       setPage]       = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const availableEngines = make !== 'all'
    ? MAKES.find(m => m.id === make)?.engines ?? []
    : ENGINES.map(e => e.code);

  const result = queryJdmProducts({
    products,
    search: search || undefined,
    make: make !== 'all' ? make : undefined,
    engine: engine !== 'all' ? engine : undefined,
    categoryId: categoryId !== 'all' ? categoryId : undefined,
    condition: condition || undefined,
    inStock: inStock || undefined,
    sortBy,
    page,
    limit: 24,
  });

  const activeFilters = [
    make !== 'all'       && { key: 'make',      label: MAKES.find(m => m.id === make)?.name ?? make,          clear: () => { setMake('all'); setEngine('all'); } },
    engine !== 'all'     && { key: 'engine',    label: engine,                                                  clear: () => setEngine('all') },
    categoryId !== 'all' && { key: 'category',  label: PART_CATEGORIES.find(c => c.id === categoryId)?.name ?? categoryId, clear: () => setCategoryId('all') },
    condition            && { key: 'condition', label: condition,                                               clear: () => setCondition('') },
    inStock              && { key: 'instock',   label: 'In Stock Only',                                         clear: () => setInStock(false) },
  ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

  const FilterPanel = () => (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="w-4 h-4 text-red-700" />
        <h3 className="font-bold text-zinc-950 text-sm font-heading">Filters</h3>
      </div>

      {/* Make */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Make</label>
        <select
          value={make}
          onChange={e => { setMake(e.target.value); setEngine('all'); setPage(1); }}
          className="w-full bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs rounded-xl p-2.5 focus:outline-none focus:border-red-600"
        >
          <option value="all">All Makes</option>
          {MAKES.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Engine */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Engine</label>
        <select
          value={engine}
          onChange={e => { setEngine(e.target.value); setPage(1); }}
          className="w-full bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs rounded-xl p-2.5 focus:outline-none focus:border-red-600 font-mono"
        >
          <option value="all">All Engines</option>
          {availableEngines.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Category</label>
        <select
          value={categoryId}
          onChange={e => { setCategoryId(e.target.value); setPage(1); }}
          className="w-full bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs rounded-xl p-2.5 focus:outline-none focus:border-red-600"
        >
          <option value="all">All Categories</option>
          {PART_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-600">Condition</label>
        <div className="space-y-1.5">
          {(['', 'New', 'Used JDM', 'Reconditioned', 'Rebuilt', 'Aftermarket'] as const).map(c => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="condition"
                value={c}
                checked={condition === c}
                onChange={() => { setCondition(c as Condition | ''); setPage(1); }}
                className="accent-red-600"
              />
              <span className={`text-xs font-medium transition-colors ${condition === c ? 'text-zinc-950' : 'text-zinc-600 group-hover:text-zinc-800'}`}>
                {c || 'All Conditions'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In stock */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={e => { setInStock(e.target.checked); setPage(1); }}
          className="accent-red-600"
        />
        <span className="text-xs font-medium text-zinc-700">In Stock Only</span>
      </label>

      {/* Clear */}
      {activeFilters.length > 0 && (
        <button
          onClick={() => { setMake('all'); setEngine('all'); setCategoryId('all'); setCondition(''); setInStock(false); setPage(1); }}
          className="w-full text-xs text-red-700 hover:text-red-700 font-bold py-2 border border-red-200 rounded-xl hover:border-red-600/40 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-zinc-200 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 font-heading">
            {categoryId !== 'all'
              ? PART_CATEGORIES.find(c => c.id === categoryId)?.name ?? 'Parts'
              : make !== 'all'
              ? `${MAKES.find(m => m.id === make)?.name} Parts`
              : 'All JDM Parts'}
            <span className="text-red-700 text-lg font-bold ml-3">({result.totalResults} items)</span>
          </h1>
          {engine !== 'all' && (
            <p className="text-zinc-600 text-sm mt-1 font-mono">
              Filtered for: <span className="text-zinc-950 font-bold">{engine}</span>
            </p>
          )}
        </div>

        {/* Sort + mobile filter toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 bg-white border border-zinc-300 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters {activeFilters.length > 0 && <span className="w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px]">{activeFilters.length}</span>}
          </button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-zinc-300 text-zinc-800 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-red-600"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {activeFilters.map(f => (
            <button
              key={f.key}
              onClick={f.clear}
              className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-[11px] font-bold hover:bg-red-50 transition-colors"
            >
              {f.label}
              <X className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <FilterPanel />
        </aside>

        {/* Mobile filter drawer */}
        {filtersOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-zinc-50 backdrop-blur-sm" onClick={() => setFiltersOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-zinc-50 overflow-y-auto p-4 border-r border-zinc-200"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-zinc-950 text-sm">Filters</span>
                <button onClick={() => setFiltersOpen(false)}><X className="w-5 h-5 text-zinc-600" /></button>
              </div>
              <FilterPanel />
            </div>
          </div>
        )}

        {/* Products grid */}
        <main className="lg:col-span-9">
          {result.products.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-16 text-center space-y-4">
              <Sliders className="w-10 h-10 text-zinc-700 mx-auto" />
              <h3 className="text-xl font-bold text-zinc-950 font-heading">No parts found</h3>
              <p className="text-zinc-600 text-sm">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {result.products.map(p => {
                  const isWished = wishlist.some(w => w.id === p.id);
                  const price = vatInclusive ? p.priceIncVat : p.priceExVat;
                  const { deposit } = calculateDeposit(p.priceIncVat, p.depositPct);
                  return (
                    <div key={p.id} className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <ConditionBadge condition={p.condition} />
                          {p.mileage && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-300">
                              {p.mileage.toLocaleString()} km
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleWishlist(p)}
                          aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
                          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 border flex items-center justify-center transition-colors ${isWished ? 'border-red-600 text-red-700' : 'border-zinc-300 text-zinc-600 hover:text-red-700'}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div>
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {p.engines.slice(0, 2).map(eng => (
                              <span key={eng} className="text-[9px] font-black font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-300">{eng}</span>
                            ))}
                          </div>
                          <Link href={`/product/${p.id}`} className="font-bold text-sm text-zinc-950 hover:text-red-700 transition-colors line-clamp-2 font-heading block">
                            {p.title}
                          </Link>
                          <p className="text-[10px] text-zinc-600 mt-1 font-mono">SKU: {p.sku}</p>
                        </div>

                        <div className="mt-auto space-y-1.5">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-zinc-950">{formatGBP(price)}</span>
                            {p.wasPrice && <span className="text-xs text-zinc-600 line-through">{formatGBP(p.wasPrice)}</span>}
                            <span className="text-[10px] text-zinc-600">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600">
                            Deposit: <span className="text-red-700 font-bold">{formatGBP(deposit)}</span>
                          </p>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-green-400' : 'bg-zinc-400'}`} />
                            <span className={`text-[10px] font-semibold ${p.inStock ? 'text-green-700' : 'text-zinc-600'}`}>{p.stockStatus}</span>
                          </div>
                          {p.warranty && (
                            <p className="text-[10px] text-zinc-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> {p.warranty} warranty
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => addToCart(p)}
                            disabled={!p.inStock}
                            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-zinc-100 disabled:text-zinc-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {p.inStock ? 'Add to Basket' : 'Out of Stock'}
                          </button>
                          <Link href={`/product/${p.id}`}
                            className="px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold transition-colors">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold disabled:opacity-40 hover:border-zinc-500 transition-colors"
                >
                  Previous
                </button>
                <span className="px-5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-red-700">
                  Page {page} of {result.totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(result.totalPages, p + 1))}
                  disabled={page >= result.totalPages}
                  className="px-5 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs font-bold disabled:opacity-40 hover:border-zinc-500 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
