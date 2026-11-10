'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { ENGINES } from '@/lib/jdm-catalog';
import { PERFORMANCE_PART_GROUPS } from '@/lib/performance-parts';

const fieldClass = 'w-full rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm';

export default function PartsDirectory({ initialEngine }: { initialEngine: string }) {
  const [engine, setEngine] = useState(initialEngine);
  const [groupId, setGroupId] = useState('');
  const [search, setSearch] = useState('');
  const term = search.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const groups = PERFORMANCE_PART_GROUPS
    .filter(group => !groupId || group.id === groupId)
    .map(group => ({ ...group, items: group.items.filter(item => item.id.replace(/-/g, '').includes(term)) }))
    .filter(group => group.items.length > 0);
  const resultCount = groups.reduce((count, group) => count + group.items.length, 0);
  const engineQuery = engine ? `&engine=${encodeURIComponent(engine)}` : '';

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-200">Parts sourcing &amp; fitment</p>
          <h1>Performance <span className="text-gradient-warm">Parts</span></h1>
          <p className="mt-4 max-w-2xl text-zinc-200">Find a part category, then tell us about your engine and chassis. We’ll confirm fitment, availability and price when quoting.</p>
          <Link href={`/workshop?service=fitment-check${engineQuery}#quote`} className="button-bright mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors">
            Find My Car <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 sm:grid-cols-3 sm:p-5">
          <label className="space-y-1">
            <span className="block text-sm font-bold">Search parts</span>
            <span className="relative block">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-600" />
              <input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="e.g. wastegates or clamps" className={`${fieldClass} pl-9`} />
            </span>
          </label>
          <label className="space-y-1">
            <span className="block text-sm font-bold">Category</span>
            <select value={groupId} onChange={event => setGroupId(event.target.value)} className={fieldClass}>
              <option value="">All categories</option>
              {PERFORMANCE_PART_GROUPS.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="block text-sm font-bold">Engine for your enquiry</span>
            <select value={engine} onChange={event => setEngine(event.target.value)} className={fieldClass}>
              <option value="">Choose an engine</option>
              {ENGINES.map(item => <option key={item.code} value={item.code}>{item.code}</option>)}
              <option value="RB25DET NEO">RB25DET NEO</option>
            </select>
          </label>
        </div>

        <p role="status" className="text-sm text-zinc-600">{resultCount} {resultCount === 1 ? 'part category' : 'part categories'}</p>
        {groups.map(group => (
          <section key={group.id} aria-labelledby={`${group.id}-heading`}>
            <h2 id={`${group.id}-heading`}>{group.title}</h2>
            <p className="mb-4 mt-1 text-sm text-zinc-600">{group.description}</p>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map(item => (
                <li key={item.id}>
                  <Link href={`/workshop?part=${item.id}${engineQuery}#quote`} aria-label={`Enquire about ${item.title}`} className="flex h-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold transition-colors hover:border-amber-400">
                    {item.title}<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-red-700" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {resultCount === 0 && (
          <p className="text-sm text-zinc-700">Try another search or <Link href={`/workshop?service=build-planning${engineQuery}#quote`} className="font-bold text-red-700 underline">ask about sourcing a specific part</Link>.</p>
        )}
      </div>
    </>
  );
}
