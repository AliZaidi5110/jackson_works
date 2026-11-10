"use client";

import React from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useApp } from '@/lib/jdm-context';
import { calculateDeposit } from '@/lib/jdm-catalog';
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from 'lucide-react';

function ConditionBadge({ condition }: { condition: string }) {
  const cls: Record<string, string> = {
    'New': 'badge-new', 'Used JDM': 'badge-used-jdm', 'Reconditioned': 'badge-reconditioned',
    'Rebuilt': 'badge-rebuilt', 'Aftermarket': 'badge-aftermarket',
  };
  return <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${cls[condition] ?? 'badge-new'}`}>{condition}</span>;
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, vatInclusive } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 flex items-center justify-center">
          <Heart className="w-10 h-10 text-zinc-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-zinc-950 font-heading">Your Wishlist is Empty</h1>
          <p className="text-zinc-600 text-sm mt-2">Save items you are interested in and come back to them later.</p>
        </div>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
          Browse Parts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">Wishlist</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 font-heading mb-6">
        Wishlist <span className="text-red-700 text-lg font-bold ml-3">({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {wishlist.map(product => {
          const price = vatInclusive ? product.priceIncVat : product.priceExVat;
          const { deposit } = calculateDeposit(product.priceIncVat, product.depositPct);
          return (
            <div key={product.id} className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] bg-zinc-50 overflow-hidden">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute top-2 left-2"><ConditionBadge condition={product.condition} /></div>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-zinc-50 border border-red-600 text-red-700 flex items-center justify-center"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1 gap-3">
                <div className="flex flex-wrap gap-1 mb-1">
                  {product.engines.slice(0, 2).map(eng => (
                    <span key={eng} className="text-[9px] font-black font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-300">{eng}</span>
                  ))}
                </div>
                <Link href={`/product/${product.id}`} className="font-bold text-sm text-zinc-950 hover:text-red-700 transition-colors line-clamp-2 font-heading block">{product.title}</Link>
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
        })}
      </div>
    </div>
  );
}
