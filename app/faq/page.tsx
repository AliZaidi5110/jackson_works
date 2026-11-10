"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Search } from 'lucide-react';

const FAQ_SECTIONS = [
  {
    title: 'Ordering & Payments',
    items: [
      { q: 'How does the 10% deposit system work?', a: 'The checkout uses a sample 10% deposit to show the proposed layout. No deposit is collected and the business must confirm its payment terms before launch.' },
      { q: 'What payment methods do you accept?', a: 'Payment providers are not connected in this preview. Accepted payment methods are TODO — confirm with the business.' },
      { q: 'Can I pay the full amount upfront?', a: 'Checkout is not live, so no payments can be made. Payment options are TODO — confirm with the business.' },
      { q: 'What happens if I do not pay the balance?', a: 'The balance deadline and cancellation/refund terms have not been confirmed. See the Deposit Policy placeholder.' },
      { q: 'Do you offer trade or wholesale pricing?', a: 'Trade pricing and account access are not configured. TODO — confirm eligibility and VAT pricing with the business.' },
    ],
  },
  {
    title: 'Engines & Parts',
    items: [
      { q: 'Are your used JDM engines compression tested?', a: 'Test status and results must be confirmed for each individual item. Sample listings do not represent real stock.' },
      { q: 'What does "Used JDM" mean?', a: 'In this sample catalogue, the label describes used Japanese-market parts. Product origin, grade and mileage must be verified on the real listing.' },
      { q: 'What is included with a complete engine?', a: 'A complete engine typically includes the long block (block, head, internals), intake and exhaust manifolds, and ancillaries such as alternator brackets. Specific inclusions are listed on each product page. "Engine only" means no gearbox, ECU or loom.' },
      { q: 'What is an Engine Package?', a: 'An Engine Package is a pre-bundled, ready-to-fit combination. We offer tiers from "Engine Only" through to "Full Swap Package" (engine, gearbox, ECU, loom, mounts). Each package page lists exactly what is included.' },
      { q: 'Do you sell new parts as well as used?', a: 'Yes. We stock new OEM genuine parts, aftermarket performance parts from leading brands, reconditioned units, and used JDM imports. Every product has a clear Condition badge (New, Used JDM, Reconditioned, Aftermarket).' },
    ],
  },
  {
    title: 'Delivery & Returns',
    items: [
      { q: 'Do you deliver engines across the UK?', a: 'Delivery areas, carriers, collection availability and lead times are TODO — confirm with the business.' },
      { q: 'How much does delivery cost?', a: 'Rates have not been supplied. The preview checkout excludes delivery from its sample total.' },
      { q: 'Can I return an engine or part?', a: 'The returns policy needs to be supplied by the business and reviewed before launch.' },
      { q: 'Do you ship internationally?', a: 'International shipping availability is TODO — confirm with the business.' },
    ],
  },
  {
    title: 'Workshop & Fitting',
    items: [
      { q: 'Can you fit the engine/parts I buy from you?', a: 'Workshop service availability and fitting capability are TODO — confirm with the business.' },
      { q: 'How do I book my vehicle in?', a: 'The quote form is a preview and does not send requests. Contact details and booking process need confirmation.' },
      { q: 'Do you offer tuning and dyno services?', a: 'Tuning and dyno availability are TODO — confirm with the business.' },
    ],
  },
  {
    title: 'Warranty',
    items: [
      { q: 'What warranty do your engines carry?', a: 'Warranty duration varies by item and has not been confirmed. The sample values in the catalogue are placeholders.' },
      { q: 'What does the warranty cover?', a: 'Coverage and exclusions must be supplied by the business. See the warranty page placeholder.' },
    ],
  },
];

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const filteredSections = searchTerm.trim()
    ? FAQ_SECTIONS.map(s => ({
        ...s,
        items: s.items.filter(i =>
          i.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.a.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      })).filter(s => s.items.length > 0)
    : FAQ_SECTIONS;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">FAQ</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 font-heading mb-2">Frequently Asked Questions</h1>
      <p className="text-zinc-600 mb-8">Find answers to common questions about ordering, engines, delivery, workshop services and more.</p>

      {/* Search */}
      <div className="relative mb-10">
        <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search questions…"
          className="w-full bg-white border border-zinc-300 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
        />
      </div>

      {filteredSections.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-600 text-sm">No matching questions found. Try a different search or <Link href="/contact" className="text-red-700 font-bold hover:text-red-700">contact us</Link>.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredSections.map(section => (
            <div key={section.title}>
              <h2 className="text-lg font-black text-zinc-950 font-heading mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-red-600 rounded-full" />
                {section.title}
              </h2>
              <div className="space-y-2">
                {section.items.map((item, i) => {
                  const key = `${section.title}-${i}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div key={key} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between p-4 text-left gap-4"
                      >
                        <span className="text-sm font-bold text-zinc-950">{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-sm text-zinc-600 leading-relaxed border-t border-zinc-200 pt-3 animate-fadeIn">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 bg-white border border-zinc-200 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-xl font-black text-zinc-950 font-heading">Still have questions?</h3>
        <p className="text-zinc-600 text-sm">Our team is here to help with any engine, parts or workshop enquiry.</p>
        <div className="flex justify-center gap-3">
          <Link href="/contact" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">Contact Us</Link>
          <Link href="/contact" className="border border-zinc-300 hover:border-zinc-500 text-zinc-700 px-6 py-3 rounded-xl font-bold text-sm transition-all">Contact Details</Link>
        </div>
      </div>
    </div>
  );
}
