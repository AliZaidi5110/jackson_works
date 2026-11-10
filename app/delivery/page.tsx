"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Truck, Package, RotateCcw, CheckCircle, Clock } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">Delivery & Returns</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 font-heading mb-2">Delivery & Returns</h1>
      <p className="text-zinc-600 mb-10">Delivery and returns details for this store preview.</p>

      <div className="space-y-8">
        {/* Delivery options */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-zinc-950 font-heading flex items-center gap-2">
            <Truck className="w-5 h-5 text-red-700" /> UK Delivery
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-left">
                  <th className="py-3 text-zinc-600 font-bold text-xs uppercase">Item Type</th>
                  <th className="py-3 text-zinc-600 font-bold text-xs uppercase">Method</th>
                  <th className="py-3 text-zinc-600 font-bold text-xs uppercase">Cost</th>
                  <th className="py-3 text-zinc-600 font-bold text-xs uppercase">Lead Time</th>
                </tr>
              </thead>
              <tbody className="text-zinc-700">
                <tr className="border-b border-zinc-200">
                  <td className="py-3 font-bold text-zinc-950">Small parts (under 30 kg)</td>
                  <td className="py-3">TODO — confirm carrier</td>
                  <td className="py-3 text-amber-700">TODO — confirm rate</td>
                  <td className="py-3 text-amber-700">TODO — confirm lead time</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-3 font-bold text-zinc-950">Engines & gearboxes</td>
                  <td className="py-3">TODO — confirm carrier</td>
                  <td className="py-3 text-amber-700">TODO — confirm rate</td>
                  <td className="py-3 text-amber-700">TODO — confirm lead time</td>
                </tr>
                <tr className="border-b border-zinc-200">
                  <td className="py-3 font-bold text-zinc-950">Engine packages</td>
                  <td className="py-3">TODO — confirm carrier</td>
                  <td className="py-3 text-amber-700">TODO — confirm rate</td>
                  <td className="py-3 text-amber-700">TODO — confirm lead time</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-zinc-950">Click and collect</td>
                  <td className="py-3">Collect from workshop</td>
                  <td className="py-3 text-amber-700">TODO — confirm</td>
                  <td className="py-3 text-amber-700">TODO — confirm</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-zinc-600">TODO: Confirm delivery areas, rates, carriers, lead times, collection arrangements and international availability.</p>
        </section>

        {/* Returns */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-zinc-950 font-heading flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-red-700" /> Returns Policy
          </h2>
          <div className="space-y-3 text-sm text-zinc-700 leading-relaxed">
            <p>This preview does not state the business's cancellation, returns or refund policy. The final wording must be supplied and checked before the store accepts orders.</p>
            <p className="text-amber-700">TODO: Add approved returns process, time limits, condition requirements, return costs, refund timing and any lawful exceptions after professional review.</p>
          </div>
        </section>

        <p className="text-xs text-zinc-600">TODO: Confirm exact delivery rates, carriers and returns policy with client. Last updated: TODO.</p>
      </div>
    </div>
  );
}
