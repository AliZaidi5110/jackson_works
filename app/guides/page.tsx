"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, Clock, ArrowRight, Tag } from 'lucide-react';

const GUIDES = [
  {
    slug: '2jz-vs-rb26',
    title: '2JZ-GTE vs RB26DETT: Which Engine Should You Choose?',
    excerpt: 'A detailed comparison of the two most iconic JDM inline-six engines. We cover power potential, cost, parts availability, reliability and which is best for different builds.',
    category: 'Engine Comparison',
    readTime: '12 min read',
    date: 'TODO',
  },
  {
    slug: 'engine-swap-checklist',
    title: 'JDM Engine Swap Checklist: Everything You Need',
    excerpt: 'Planning a JDM engine swap? This checklist covers every component, tool and consideration — from engine mounts to wiring, cooling, fuelling and registration.',
    category: 'How-To',
    readTime: '15 min read',
    date: 'TODO',
  },
  {
    slug: 'buying-used-jdm-engine',
    title: 'How to Buy a Used JDM Engine in the UK',
    excerpt: 'What to look for when buying a used JDM import engine: compression tests, grading, mileage, what is included, import documentation, and red flags to avoid.',
    category: 'Buying Guide',
    readTime: '10 min read',
    date: 'TODO',
  },
  {
    slug: 'compression-test-guide',
    title: 'How to Read an Engine Compression Test',
    excerpt: 'Understanding compression test results: what the numbers mean, acceptable ranges for 2JZ, RB26, SR20 and 4G63 engines, and when to walk away.',
    category: 'Technical',
    readTime: '8 min read',
    date: 'TODO',
  },
  {
    slug: 'choosing-gearbox-kit',
    title: 'Choosing the Right Gearbox Kit for Your JDM Build',
    excerpt: 'Manual vs automatic, rebuild vs conversion, torque ratings and drive types. A guide to selecting the correct gearbox kit for 2JZ, RB and SR platforms.',
    category: 'Buying Guide',
    readTime: '11 min read',
    date: 'TODO',
  },
  {
    slug: 'standalone-ecu-guide',
    title: 'Standalone ECU Guide: Haltech vs Link vs AEM',
    excerpt: 'Comparing the most popular standalone ECU options for Japanese engines. Features, price, ease of tuning and which platforms they suit best.',
    category: 'Technical',
    readTime: '14 min read',
    date: 'TODO',
  },
];

const CATEGORIES = [...new Set(GUIDES.map(g => g.category))];

export default function GuidesPage() {
  return (
    <div className="space-y-0">
      <section className="bg-zinc-50 py-12 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-700">Technical Guides</span>
          </nav>
          <h1 className="text-4xl font-black text-zinc-950 font-heading">Technical Guides & Blog</h1>
          <p className="text-zinc-600 mt-2 max-w-xl">In-depth guides, comparisons and how-tos for Japanese engine builds, swaps and tuning.</p>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold">All</span>
            {CATEGORIES.map(cat => (
              <span key={cat} className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 text-xs font-bold hover:border-zinc-400 cursor-pointer transition-colors">{cat}</span>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GUIDES.map(guide => (
              <article key={guide.slug} className="product-card bg-white border border-zinc-200 rounded-2xl overflow-hidden flex flex-col">
                {/* Image placeholder */}
                <div className="aspect-[16/9] bg-zinc-50 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-zinc-800" />
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">{guide.category}</span>
                    <span className="text-[10px] text-zinc-600 flex items-center gap-1"><Clock className="w-3 h-3" />{guide.readTime}</span>
                  </div>
                  <h2 className="font-bold text-sm text-zinc-950 font-heading leading-snug">{guide.title}</h2>
                  <p className="text-xs text-zinc-600 leading-relaxed line-clamp-3">{guide.excerpt}</p>
                  <div className="mt-auto pt-2">
                    {/* TODO: Link to full guide pages when blog system is implemented */}
                    <span className="text-xs font-bold text-red-700 flex items-center gap-1 cursor-pointer hover:text-red-700 transition-colors">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center text-zinc-600 text-xs mt-10">TODO: These are placeholder guide summaries. Full articles to be written and published via the admin CMS.</p>
        </div>
      </section>
    </div>
  );
}
