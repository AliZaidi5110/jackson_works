"use client";

import React, { useState, useRef, useEffect } from 'react';
import StoreLogo from '@/components/StoreLogo';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useApp } from '@/lib/jdm-context';
import {
  ShoppingBag, Heart, Search, Phone, X, Menu,
  ChevronDown, Settings, Zap, Gauge, Cpu, GitBranch, Package, Layers,
} from 'lucide-react';
import { MAKES, ENGINES } from '@/lib/jdm-catalog';

// ── Mega-menu configuration ──────────────────────────────────────────────────

const MEGA_MENU_MAKES = [
  { id: 'toyota',    label: 'Toyota',     engines: ['2JZ-GTE', '2JZ-GE', '1JZ-GTE', '1JZ-GE', '3S-GTE', '1UZ-FE'] },
  { id: 'nissan',    label: 'Nissan',     engines: ['RB26DETT', 'RB25DET', 'RB20DET', 'SR20DET', 'CA18DET', 'VQ35'] },
  { id: 'mitsubishi',label: 'Mitsubishi', engines: ['4G63', '4B11'] },
  { id: 'honda',     label: 'Honda',      engines: ['K20', 'B16', 'B18', 'F20C'] },
  { id: 'mazda',     label: 'Mazda',      engines: ['13B', 'BP', 'MZR'] },
  { id: 'subaru',    label: 'Subaru',     engines: ['EJ20', 'EJ25', 'FA20'] },
];

const SPECIAL_CATEGORIES = [
  { id: 'engine-packages',   label: 'Engine Packages',              icon: Package,    color: 'text-red-700',  desc: 'Ready-to-fit bundles' },
  { id: 'tcu-transmission',  label: 'TCU / Transmission Controllers',icon: Cpu,        color: 'text-blue-700', desc: 'Standalone & OEM TCUs' },
  { id: 'gearbox-kits',      label: 'Gearbox Kits',                 icon: Layers,     color: 'text-purple-700',desc: 'Rebuild & conversion kits' },
  { id: 'turbo-induction',   label: 'Turbo & Induction',            icon: Gauge,      color: 'text-amber-700', desc: 'Turbos, manifolds, BOVs' },
  { id: 'ignition-ecu',      label: 'ECU & Electronics',            icon: Zap,        color: 'text-green-700', desc: 'ECUs, coils, sensors' },
  { id: 'drivetrain',        label: 'Drivetrain',                   icon: GitBranch,  color: 'text-cyan-700',  desc: 'Diffs, driveshafts, mounts' },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Header() {
  const { cartCount, cartTotal, wishlist, vatInclusive, setVatInclusive, activeVehicle } = useApp();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [activeMakeMega, setActiveMakeMega] = useState<string | null>(null);
  const megaRef = useRef<HTMLDivElement>(null);

  // Close mega-menus on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setActiveMega(null);
        setActiveMakeMega(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {/* ── Promo Strip ──────────────────────────────────────────────────── */}
      <div className="promo-strip text-xs font-bold py-2 px-4 text-center flex justify-center items-center flex-wrap gap-x-3 gap-y-1">
        <span className="hidden sm:inline">Japanese engine parts & workshop</span>
        <span className="hidden sm:inline">•</span>
        <span>Sample listings — confirm fitment, price and availability before ordering</span>
        <span className="hidden md:inline">•</span>
        <span className="hidden md:inline">Online payments are not active yet</span>
      </div>

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div className="hidden md:block bg-zinc-100 border-b border-zinc-200 py-1.5 px-6 text-xs text-zinc-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5 font-medium">
            <Link href="/contact" className="flex items-center gap-1.5 hover:text-zinc-950"><Phone className="h-3.5 w-3.5" /> Contact &amp; fitment help</Link>
            <Link href="/about" className="hover:text-zinc-950">About Jackson Works</Link>
          </div>
          <div className="flex items-center gap-5">
            {/* VAT toggle */}
            <button
              onClick={() => setVatInclusive(!vatInclusive)}
              className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors"
              aria-label="Toggle VAT display"
            >
              <span className={vatInclusive ? 'text-green-700' : 'text-zinc-600'}>Inc. VAT</span>
              <span className="text-zinc-600">/</span>
              <span className={!vatInclusive ? 'text-amber-700' : 'text-zinc-600'}>Ex. VAT</span>
            </button>
            <Link href="/account" className="hover:text-zinc-950 transition-colors">My Account</Link>
            <Link href="/trade" className="hover:text-zinc-950 transition-colors font-semibold text-amber-700">Trade Login</Link>
            <Link href="/admin" className="hover:text-zinc-950 transition-colors text-red-700 font-semibold flex items-center gap-1">
              <Settings className="w-3 h-3" /> Admin
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Header ──────────────────────────────────────────────────── */}
      <header className="store-header sticky top-0 z-40 backdrop-blur-md border-b" ref={megaRef} onKeyDown={event => {
        if (event.key === 'Escape') {
          setActiveMega(null);
          setActiveMakeMega(null);
          setMobileOpen(false);
        }
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-2 gap-y-3 sm:gap-6">

          {/* Logo */}
          <StoreLogo />

          {/* ── Search ─────────────────────────────────────────────── */}
          <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1">
            <form action="/shop" method="GET" className="relative">
              <Search className="w-4 h-4 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                name="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search parts, engines or SKU…"
                className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-3 pl-10 pr-20 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors"
                aria-label="Search parts"
              />
              <button
                type="submit"
                className="button-bright absolute right-1.5 top-1/2 -translate-y-1/2 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* ── Actions ────────────────────────────────────────────── */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
            {/* Active Vehicle indicator */}
            {activeVehicle && (
              <div className="hidden lg:flex items-center gap-2 bg-white border border-zinc-300 px-3 py-2 rounded-xl text-xs">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-zinc-600 font-medium">{activeVehicle.engine}</span>
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 rounded-xl bg-white border border-zinc-300 hover:border-zinc-400 transition-colors sm:p-2.5" aria-label={`Wishlist (${wishlist.length} items)`}>
              <Heart className="h-5 w-5 text-zinc-700" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="button-bright flex items-center gap-2.5 p-2.5 rounded-xl font-bold text-sm transition-colors sm:px-4"
              aria-label={`Shopping basket, ${cartCount} items, ${formatGBP(cartTotal)}`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-[10px] font-extrabold uppercase opacity-80">Basket ({cartCount})</span>
                <span className="text-xs font-black">{formatGBP(cartTotal)}</span>
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="lg:hidden p-2 rounded-xl bg-white border border-zinc-300 sm:p-2.5"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="hidden border-t border-zinc-200 bg-zinc-50 lg:block">
          <nav className="mx-auto flex max-w-7xl items-center gap-1 px-6 py-1.5" aria-label="Primary navigation">
            <Link href="/shop" onMouseEnter={() => setActiveMega(null)} className="rounded-lg px-3.5 py-2 text-sm font-bold text-zinc-950 hover:bg-zinc-200">
              All Parts
            </Link>

            {/* Shop by Make */}
            <div className="relative group">
              <button
                onFocus={() => { setActiveMega('make'); setActiveMakeMega(null); }}
                onMouseEnter={() => { setActiveMega('make'); setActiveMakeMega(null); }}
                aria-expanded={activeMega === 'make'}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeMega === 'make' ? 'text-zinc-950 bg-zinc-100' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'}`}
              >
                Shop by Make
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMega === 'make' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Engine Packages */}
            <Link href="/#engine-packages"
              onMouseEnter={() => setActiveMega(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
              <Package className="w-3.5 h-3.5 text-red-700" />
              Engine Packages
            </Link>

            {/* TCU */}
            <Link href="/shop?category=tcu-transmission"
              onMouseEnter={() => setActiveMega(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
              <Cpu className="w-3.5 h-3.5 text-blue-700" />
              TCU
            </Link>

            {/* Gearbox Kits */}
            <Link href="/shop?category=gearbox-kits"
              onMouseEnter={() => setActiveMega(null)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
              <Layers className="w-3.5 h-3.5 text-purple-700" />
              Gearbox Kits
            </Link>

            {/* Workshop */}
            <Link href="/workshop"
              onMouseEnter={() => setActiveMega(null)}
              className="px-3.5 py-2 rounded-lg text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors">
              Workshop
            </Link>

            {/* More */}
            <button
              onFocus={() => setActiveMega('more')}
              onMouseEnter={() => setActiveMega('more')}
              aria-expanded={activeMega === 'more'}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${activeMega === 'more' ? 'text-zinc-950 bg-zinc-100' : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'}`}
            >
              More
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMega === 'more' ? 'rotate-180' : ''}`} />
            </button>
          </nav>
        </div>

        {/* ── Mega-menu: Shop by Make ─────────────────────────────── */}
        {activeMega === 'make' && (
          <div
            className="mega-menu absolute left-0 right-0 top-full bg-zinc-50 border-b border-zinc-200 shadow-2xl"
            onMouseLeave={() => { setActiveMega(null); setActiveMakeMega(null); }}
          >
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-12 gap-6">
              {/* Make list */}
              <div className="col-span-3 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">Select Make</p>
                {MEGA_MENU_MAKES.map(make => (
                  <button
                    key={make.id}
                    onMouseEnter={() => setActiveMakeMega(make.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors text-left ${activeMakeMega === make.id ? 'bg-amber-100 text-zinc-950 border border-amber-300' : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'}`}
                  >
                    <span>{make.label}</span>
                    <ChevronDown className="w-3 h-3 -rotate-90" />
                  </button>
                ))}
                <hr className="border-zinc-200 my-2" />
                <Link href="/shop" className="block px-3 py-2 rounded-lg text-sm font-semibold text-red-700 hover:bg-zinc-100 transition-colors">
                  View All Parts →
                </Link>
              </div>

              {/* Engines for selected make */}
              <div className="col-span-4 border-l border-zinc-200 pl-6">
                {activeMakeMega ? (
                  <>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">
                      {MEGA_MENU_MAKES.find(m => m.id === activeMakeMega)?.label} Engines
                    </p>
                    <div className="space-y-1">
                      {MEGA_MENU_MAKES.find(m => m.id === activeMakeMega)?.engines.map(eng => (
                        <Link
                          key={eng}
                          href={`/engine/${eng.toLowerCase().replace(/\s+/g, '-')}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-mono font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                          {eng}
                        </Link>
                      ))}
                      <Link
                        href={`/make/${activeMakeMega}`}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-700 hover:bg-zinc-100 transition-colors mt-2"
                      >
                        All {MEGA_MENU_MAKES.find(m => m.id === activeMakeMega)?.label} parts →
                      </Link>
                    </div>
                  </>
                ) : (
                  <p className="text-zinc-600 text-sm pt-6">Hover a make to see its engines</p>
                )}
              </div>

              {/* Part categories */}
              <div className="col-span-5 border-l border-zinc-200 pl-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">Shop by Part Type</p>
                <div className="grid grid-cols-2 gap-1">
                  {SPECIAL_CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.id}
                        href={cat.id === 'engine-packages' ? '/#engine-packages' : `/shop?category=${cat.id}`}
                        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-zinc-100 transition-colors group"
                      >
                        <Icon className={`w-4 h-4 ${cat.color} mt-0.5 shrink-0`} />
                        <div>
                          <span className="text-sm font-semibold text-zinc-800 group-hover:text-zinc-950 block leading-snug">{cat.label}</span>
                          <span className="text-[11px] text-zinc-600">{cat.desc}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Mega-menu: More ────────────────────────────────────────── */}
        {activeMega === 'more' && (
          <div
            className="mega-menu absolute right-0 top-full w-72 bg-zinc-50 border border-zinc-200 rounded-b-2xl shadow-2xl"
            onMouseLeave={() => setActiveMega(null)}
          >
            <div className="p-4 space-y-1">
              {[
                { href: '/workshop', label: 'Workshop Services' },
                { href: '/projects', label: 'Projects & Builds' },
                { href: '/guides', label: 'Technical Guides' },
                { href: '/about', label: 'About & Our Workshop' },
                { href: '/warranty', label: 'Warranty' },
                { href: '/delivery', label: 'Delivery & Returns' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/trade', label: 'Trade Account' },
              ].map(item => (
                <Link key={item.href} href={item.href}
                  className="block px-3 py-2 rounded-lg text-sm text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Mobile menu ──────────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-zinc-200 bg-zinc-50 px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
            {/* Mobile makes */}
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1 mb-2">Shop by Make</p>
            {MEGA_MENU_MAKES.map(make => (
              <Link key={make.id} href={`/make/${make.id}`}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {make.label}
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-zinc-600" />
              </Link>
            ))}

            <hr className="border-zinc-200 my-3" />

            {[
              { href: '/shop', label: 'All Parts' },
              { href: '/#engine-packages', label: 'Engine Packages', accent: true },
              { href: '/shop?category=tcu-transmission', label: 'TCU / Transmission' },
              { href: '/shop?category=gearbox-kits', label: 'Gearbox Kits' },
              { href: '/workshop', label: 'Workshop Services' },
              { href: '/guides', label: 'Technical Guides' },
              { href: '/contact', label: 'Contact Us' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${item.accent ? 'text-red-700 hover:bg-red-50' : 'text-zinc-800 hover:bg-zinc-100'}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile VAT toggle */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white border border-zinc-200 mt-3">
              <span className="text-xs font-bold text-zinc-600">Price display:</span>
              <button
                onClick={() => setVatInclusive(true)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${vatInclusive ? 'bg-green-100 text-green-800' : 'text-zinc-600 hover:text-zinc-700'}`}
              >Inc. VAT</button>
              <button
                onClick={() => setVatInclusive(false)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${!vatInclusive ? 'bg-amber-50 text-amber-700' : 'text-zinc-600 hover:text-zinc-700'}`}
              >Ex. VAT</button>
            </div>
          </div>
        )}
      </header>

      {/* ── Sticky mobile CTA ────────────────────────────────────────── */}
      <div className="sticky-mobile-cta lg:hidden flex items-center gap-2 p-3">
        <Link href="/contact"
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 border border-zinc-300 text-zinc-950 font-bold py-3 rounded-xl text-sm"
          aria-label="Contact details"
        >
          <Phone className="w-4 h-4 text-red-700" />
          Contact
        </Link>
        <Link href="/cart"
          className="button-bright flex-1 flex items-center justify-center gap-2 font-bold py-3 rounded-xl text-sm transition-colors"
          aria-label="View basket"
        >
          <ShoppingBag className="w-4 h-4" />
          Basket ({cartCount})
        </Link>
      </div>
    </>
  );
}
