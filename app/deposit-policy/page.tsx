"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

export default function DepositPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">Deposit Policy</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 font-heading mb-2">Deposit Policy</h1>
      <p className="text-zinc-600 mb-10">This page describes a proposed deposit flow for the store preview. No payment is currently accepted.</p>

      <div className="space-y-8">
        {/* How it works */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-zinc-950 font-heading flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-red-700" /> How the Deposit Works
          </h2>
          <div className="space-y-3 text-sm text-zinc-700 leading-relaxed">
            <p>The design uses a <strong className="text-zinc-950">sample 10% deposit</strong> to illustrate how an advance-payment checkout could work. The business has not confirmed its deposit amount, refund terms, or balance due date.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              {[
                { step: '01', title: 'Deposit example', desc: 'The preview displays a sample deposit amount. Payment is not connected.' },
                { step: '02', title: 'Order handling', desc: 'The business must confirm its inspection, preparation and fulfilment process.' },
                { step: '03', title: 'Balance example', desc: 'Payment methods and balance due date are not yet configured.' },
              ].map(s => (
                <div key={s.step} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                  <span className="text-3xl font-black text-zinc-800 font-heading">{s.step}</span>
                  <h3 className="font-black text-zinc-950 text-sm">{s.title}</h3>
                  <p className="text-xs text-zinc-600">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deposit details */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-zinc-950 font-heading">Deposit Details</h2>
          <ul className="space-y-3">
            {[
            'Deposit percentage and the total it applies to: TODO — confirm with the business.',
            'Products and categories covered by a deposit: TODO — confirm with the business.',
            'Any item-specific deposit overrides: TODO — confirm with the business.',
            'Any low-value threshold for full payment: TODO — confirm with the business.',
            'Deposit and balance payment methods: TODO — connect and confirm with the business.',
            'Balance due date and reminders: TODO — confirm with the business.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                <CheckCircle className="w-4 h-4 text-green-700 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Balance payment */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-zinc-950 font-heading">Balance Payment</h2>
          <ul className="space-y-3">
            {[
              'When your order is marked "Ready", we email you a secure payment link for the balance.',
              'Reminder emails are sent at intervals until the balance is paid.',
              'The balance must be paid before dispatch or collection. We do not dispatch until the balance is cleared.',
              'The balance can also be recorded manually (bank transfer or cash on collection).',
              'Your customer account shows each order, deposit paid, balance due and a "Pay Balance" button.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-zinc-700">
                <CheckCircle className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Cancellation & refunds */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-black text-zinc-950 font-heading flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700" /> Cancellation & Refund of Deposit
          </h2>
          <div className="space-y-3 text-sm text-zinc-700 leading-relaxed">
            <p>No deposit refund or cancellation terms have been confirmed. This preview does not create an order or payment obligation.</p>
            <p className="text-amber-700">TODO: Add the business's approved cancellation, refund, balance deadline and non-payment terms after professional review.</p>
          </div>
        </section>

        {/* Legal */}
        <section className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-black text-zinc-950 font-heading">Legal</h2>
          <p className="text-sm text-zinc-600 leading-relaxed">TODO: Have the final policy and checkout wording reviewed, then connect the payment and order systems before accepting deposits.</p>
          <p className="text-xs text-zinc-600">Last updated: TODO</p>
        </section>
      </div>
    </div>
  );
}
