"use client";

import React from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/jdm-context';
import { getMakeById, queryJdmProducts, ENGINES, CHASSIS, calculateDeposit } from '@/lib/jdm-catalog';
import {
  Wrench, ChevronRight, ArrowRight, ShoppingBag, Heart, Package,
} from 'lucide-react';

export default function MakeLandingPage() {
  const params = useParams();
  const makeId = params?.id as string;
  const { vatInclusive, products } = useApp();
  const make = getMakeById(makeId);

  if (!make) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <h2 className="text-2xl font-black text-zinc-950 font-heading">Make Not Found</h2>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">Browse All Parts</Link>
      </div>
    );
  }

  const makeEngines = ENGINES.filter(e => e.make === makeId);
  const makeChassis = CHASSIS.filter(c => c.make === makeId);
  const makeProducts = queryJdmProducts({ products, make: makeId, limit: 8 }).products;

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative min-h-[350px] bg-zinc-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1600&q=80" alt={make.name} className="w-full h-full object-cover opacity-15" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-300">{make.name}</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">{make.name}</h1>
          <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">{make.description}</p>
        </div>
      </section>

      {/* Engine Tiles */}
      <section className="py-12 bg-zinc-100 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-black text-zinc-950 font-heading mb-6">{make.name} Engines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {makeEngines.map(engine => (
              <Link
                key={engine.code}
                href={`/engine/${engine.code.toLowerCase()}`}
                className="engine-tile bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-zinc-950 font-mono font-heading">{engine.code}</span>
                  <ArrowRight className="engine-tile-arrow w-4 h-4 text-zinc-600 group-hover:text-red-700 transition-colors" />
                </div>
                <p className="text-xs text-zinc-600">{engine.displacement} · {engine.config}</p>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="text-zinc-600"><strong className="text-zinc-700">{engine.power}</strong></span>
                  <span className="text-zinc-600">{engine.induction}</span>
                </div>
                <p className="text-[10px] text-zinc-600 mt-auto">
                  Fits: {engine.commonChassis.slice(0, 3).join(', ')}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Chassis */}
      {makeChassis.length > 0 && (
        <section className="py-12 bg-zinc-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-black text-zinc-950 font-heading mb-6">{make.name} Chassis & Models</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {makeChassis.map(c => (
                <div key={c.code} className="bg-white border border-zinc-200 rounded-xl p-4">
                  <p className="font-bold text-zinc-950 text-sm">{c.name}</p>
                  <p className="text-[10px] text-zinc-600 font-mono mt-1">{c.code} · {c.years}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.engines.map(eng => (
                      <Link key={eng} href={`/engine/${eng.toLowerCase()}`} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-red-700 border border-zinc-300 hover:border-red-600 transition-colors">{eng}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {makeProducts.length > 0 && (
        <section className="py-12 bg-zinc-100 border-t border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl font-black text-zinc-950 font-heading">{make.name} Parts</h2>
              <Link href={`/shop?make=${makeId}`} className="text-sm font-bold text-red-700 hover:text-red-700 transition-colors flex items-center gap-2">View all <ArrowRight className="w-4 h-4" /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {makeProducts.map(p => {
                const price = vatInclusive ? p.priceIncVat : p.priceExVat;
                return (
                  <Link key={p.id} href={`/product/${p.id}`} className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                    <div className="aspect-[4/3] bg-zinc-50"><img src={p.image} alt={p.title} className="w-full h-full object-cover" loading="lazy" /></div>
                    <div className="p-4">
                      <h4 className="font-bold text-sm text-zinc-950 line-clamp-2 font-heading">{p.title}</h4>
                      <p className="text-lg font-black text-zinc-950 mt-2">{formatGBP(price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
