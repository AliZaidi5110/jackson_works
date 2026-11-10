"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Users, CheckCircle, ArrowRight } from 'lucide-react';

export default function TradePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">Trade Account</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 font-heading mb-2">Trade & Wholesale</h1>
      <p className="text-zinc-600 mb-10">Exclusive pricing for workshops, garages and trade customers. Apply for a trade account to access ex-VAT pricing, volume discounts and priority stock.</p>

      {/* Benefits */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4 mb-8">
        <h2 className="text-xl font-black text-zinc-950 font-heading flex items-center gap-2">
          <Users className="w-5 h-5 text-red-700" /> Trade Account Benefits
        </h2>
        <ul className="space-y-3">
          {[
            'Ex-VAT pricing across all engines, parts and packages',
            'Volume discounts on larger orders',
            'Priority access to new JDM imports',
            'Dedicated account manager',
            'Credit terms available (subject to approval)',
            'Workshop fitting partnerships',
            'Bulk CSV import for stock lists',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
              <CheckCircle className="w-4 h-4 text-green-700 mt-0.5 shrink-0" />{item}
            </li>
          ))}
        </ul>
      </section>

      {/* Application Form */}
      <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-black text-zinc-950 font-heading">Apply for a Trade Account</h2>
        <p className="text-zinc-600 text-sm">Fill in your details below and we will review your application within 48 hours.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Business Name *</label>
            <input type="text" placeholder="Your garage / workshop name" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Contact Name *</label>
            <input type="text" placeholder="John Smith" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Email *</label>
            <input type="email" placeholder="you@yourgarage.co.uk" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Phone *</label>
            <input type="tel" placeholder="07xxx xxx xxx" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">VAT Number</label>
            <input type="text" placeholder="GB 123 456 789" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Website (optional)</label>
            <input type="url" placeholder="https://yourgarage.co.uk" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Tell us about your business *</label>
          <textarea rows={4} placeholder="What do you specialise in? What JDM platforms do you work with? Estimated monthly order volume?" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors resize-none" />
        </div>

        {/* TODO: Wire up to form submission */}
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200/50">
          Submit Trade Application <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
