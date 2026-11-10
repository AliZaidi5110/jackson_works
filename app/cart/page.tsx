"use client";

import React from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useApp } from '@/lib/jdm-context';
import { calculateDeposit } from '@/lib/jdm-catalog';
import {
  Trash2, ShoppingBag, Plus, Minus, Package, ArrowRight,
  ShieldCheck, Truck, Lock, ChevronRight,
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
    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${cls[condition] ?? 'badge-new'}`}>
      {condition}
    </span>
  );
}

export default function CartPage() {
  const {
    cart, removeFromCart, updateCartQty,
    vatInclusive, cartTotal, cartDeposit, cartBalance, cartCount,
  } = useApp();

  const shipping = 0; // Rates are not confirmed; the displayed total is a sample before delivery.
  const orderTotal = cartTotal + shipping;
  const { deposit, balance } = calculateDeposit(orderTotal);

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-zinc-600" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-zinc-950 font-heading">Your Basket is Empty</h1>
          <p className="text-zinc-600 text-sm mt-2">Add some JDM engines, parts or packages to get started.</p>
        </div>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2">
          Browse Parts <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-700 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700 font-medium">Shopping Basket</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 font-heading mb-6">
        Shopping Basket
        <span className="text-red-700 text-lg font-bold ml-3">({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Cart Items ──────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map(item => {
            const product = item.product;
            const price = vatInclusive ? product.priceIncVat : product.priceExVat;
            const lineTotal = price * item.qty;
            const lineDeposit = calculateDeposit(product.priceIncVat * item.qty, product.depositPct);

            return (
              <div key={item.id} className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5">
                <div className="flex gap-4">
                  {/* Image */}
                  <Link href={`/product/${product.id}`} className="w-20 h-20 sm:w-24 sm:h-24 bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden shrink-0">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <ConditionBadge condition={product.condition} />
                          {product.engines.slice(0, 1).map(eng => (
                            <span key={eng} className="text-[9px] font-black font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-300">{eng}</span>
                          ))}
                        </div>
                        <Link href={`/product/${product.id}`} className="font-bold text-sm text-zinc-950 hover:text-red-700 transition-colors line-clamp-2 block">
                          {product.title}
                        </Link>
                        <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">SKU: {product.sku}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-600 hover:text-red-700 transition-colors p-1 shrink-0"
                        aria-label={`Remove ${product.title} from basket`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price + Qty */}
                    <div className="flex items-center justify-between mt-3 gap-4 flex-wrap">
                      <div className="flex items-center bg-zinc-50 border border-zinc-300 rounded-xl">
                        <button
                          onClick={() => updateCartQty(item.id, item.qty - 1)}
                          className="px-3 py-2 text-zinc-600 hover:text-zinc-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-zinc-950 px-2 min-w-[24px] text-center">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item.id, item.qty + 1)}
                          className="px-3 py-2 text-zinc-600 hover:text-zinc-950 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-zinc-950">{formatGBP(lineTotal)}</p>
                        <p className="text-[10px] text-zinc-600">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order Summary ────────────────────────────────────────── */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5 sticky top-28">
            <h3 className="text-lg font-black text-zinc-950 font-heading pb-3 border-b border-zinc-200">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600">Subtotal ({cartCount} items)</span>
                <span className="font-bold text-zinc-950">{formatGBP(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">Delivery</span>
                <span className="font-bold text-amber-700">To be confirmed</span>
              </div>
              <p className="text-[10px] text-zinc-600">Delivery cost is not included in this sample.</p>

              <hr className="border-zinc-200" />

              <div className="flex justify-between text-lg font-black">
                <span className="text-zinc-800">Sample total before delivery</span>
                <span className="text-zinc-950">{formatGBP(orderTotal)}</span>
              </div>
              <p className="text-[10px] text-amber-700">Example prices; VAT treatment to be confirmed</p>
            </div>

            {/* Deposit breakdown */}
            <div className="deposit-box px-4 py-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-700 font-bold">Pay today (10% deposit)</span>
                <span className="text-red-700 font-black text-lg">{formatGBP(deposit)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-600">Balance due before dispatch</span>
                <span className="text-zinc-700 font-bold">{formatGBP(balance)}</span>
              </div>
            </div>

            {/* Checkout button */}
            <Link
              href="/checkout"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200/50 block text-center"
            >
              <Lock className="w-4 h-4" />
              Proceed to Checkout
            </Link>

            <Link href="/shop" className="w-full text-center block text-xs font-bold text-zinc-600 hover:text-zinc-700 transition-colors py-2">
              ← Continue Shopping
            </Link>

            {/* Trust */}
            <div className="space-y-2 pt-3 border-t border-zinc-200">
              {[
                { icon: ShieldCheck, label: 'Warranty terms to be confirmed' },
                { icon: Truck, label: 'Delivery rates to be confirmed' },
                { icon: Lock, label: 'Checkout is a non-payment preview' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-zinc-600">
                  <Icon className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
