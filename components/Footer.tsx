import React from 'react';
import Link from 'next/link';
import StoreLogo from '@/components/StoreLogo';
import { Phone, Mail, MapPin, Clock, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

// TODO: Replace all placeholder contact details when client confirms them.

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 text-zinc-600 text-xs">
      {/* ── Trust bar ─────────────────────────────────────────────── */}
      <div className="border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: ShieldCheck, label: 'Warranty by product',         sub: 'Terms to be confirmed' },
            { icon: Truck,       label: 'UK delivery options',         sub: 'Rates to be confirmed' },
            { icon: RotateCcw,   label: 'Returns information',        sub: 'Policy to be confirmed' },
            { icon: Award,       label: 'Japanese engine parts',      sub: 'Toyota, Nissan and more' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-red-700" />
              </div>
              <div>
                <p className="text-zinc-800 font-bold text-[11px] leading-tight">{label}</p>
                <p className="text-zinc-600 text-[10px]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main footer grid ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">

        {/* Brand */}
        <div className="col-span-2 space-y-4">
          <StoreLogo />
          <p className="text-zinc-600 text-xs leading-relaxed max-w-xs">
            {/* TODO: Replace with client's actual description */}
            Japanese-engine parts, complete engines and workshop services for performance builds. Business identity and service details are still to be confirmed.
          </p>
          <div className="space-y-2 text-[11px]">
            {/* TODO: Replace with real contact details */}
            <span className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-700" />
              TODO — confirm business phone
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-red-700" />
              TODO — confirm business email
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-red-700 shrink-0" />
              TODO — confirm workshop address
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-red-700 shrink-0" />
              TODO — confirm opening hours
            </span>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-bold text-zinc-950 text-xs uppercase tracking-wide mb-4">Shop</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/shop?category=engine-packages',  label: 'Engine Packages' },
              { href: '/shop?category=complete-engines',  label: 'Complete Engines' },
              { href: '/shop?category=turbo-induction',   label: 'Turbo & Induction' },
              { href: '/shop?category=engine-internals',  label: 'Engine Internals' },
              { href: '/shop?category=tcu-transmission',  label: 'TCU / Transmission' },
              { href: '/shop?category=gearbox-kits',      label: 'Gearbox Kits' },
              { href: '/shop?category=used-jdm-parts',    label: 'Used JDM Parts' },
              { href: '/shop?condition=New',              label: 'New Parts' },
            ].map(item => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-zinc-950 hover:translate-x-1 transition-all inline-block">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Engines */}
        <div>
          <h4 className="font-bold text-zinc-950 text-xs uppercase tracking-wide mb-4">Engines</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/engine/2jz-gte',   label: 'Toyota 2JZ-GTE' },
              { href: '/engine/1jz-gte',   label: 'Toyota 1JZ-GTE' },
              { href: '/engine/rb26dett',  label: 'Nissan RB26DETT' },
              { href: '/engine/rb25det',   label: 'Nissan RB25DET' },
              { href: '/engine/sr20det',   label: 'Nissan SR20DET' },
              { href: '/engine/4g63',      label: 'Mitsubishi 4G63' },
              { href: '/engine/ej20',      label: 'Subaru EJ20' },
            ].map(item => (
              <li key={item.href}>
                <Link href={item.href} className="font-mono text-[11px] hover:text-zinc-950 hover:translate-x-1 transition-all inline-block">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h4 className="font-bold text-zinc-950 text-xs uppercase tracking-wide mb-4">Information</h4>
          <ul className="space-y-2.5">
            {[
              { href: '/about',            label: 'About & Our Workshop' },
              { href: '/workshop',         label: 'Workshop Services' },
              { href: '/projects',         label: 'Projects & Builds' },
              { href: '/guides',           label: 'Technical Guides' },
              { href: '/warranty',         label: 'Warranty Policy' },
              { href: '/delivery',         label: 'Delivery & Returns' },
              { href: '/deposit-policy',   label: 'Deposit Policy' },
              { href: '/trade',            label: 'Trade Enquiries' },
              { href: '/contact',          label: 'Contact Us' },
            ].map(item => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-zinc-950 hover:translate-x-1 transition-all inline-block">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────── */}
      <div className="border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <p>
            {/* TODO: Replace with client's real company name, company number and VAT number */}
            © {currentYear} TODO — confirm legal business name, company number, VAT number and registered address
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-600 transition-colors">Terms & Conditions</Link>
            <Link href="/cookies" className="hover:text-zinc-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
