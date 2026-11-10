"use client";

import React from 'react';
import Link from 'next/link';
import {
  Wrench, Award, Users, Clock, ShieldCheck, Star,
  MapPin, ChevronRight, Gauge, Zap, ArrowRight,
} from 'lucide-react';

const TEAM = [
  { name: '[TODO: Owner Name]', role: 'Founder & Lead Engine Builder', desc: 'Over [TODO] years of experience building and tuning Japanese performance engines. Specialises in 2JZ and RB platforms.' },
  { name: '[TODO: Technician Name]', role: 'Workshop Technician', desc: 'Engine swaps, gearbox conversions and turbo installations. Experienced with Supra, Skyline, Silvia and Evo builds.' },
  { name: '[TODO: Parts Name]', role: 'Parts & Sales', desc: 'Product sourcing, JDM imports, customer enquiries and order management.' },
];

const MILESTONES = [
  { year: '[TODO]', title: 'Founded', desc: 'Started as a small workshop specialising in Japanese engine imports and rebuilds.' },
  { year: '[TODO]', title: 'Workshop Expanded', desc: 'Moved to a larger facility with dyno, machining and fabrication capabilities.' },
  { year: '[TODO]', title: 'Online Parts Store', desc: 'Launched our e-commerce platform to supply JDM engines and parts across the UK.' },
  { year: 'Today', title: 'UK JDM Specialists', desc: 'Trusted by builders nationwide for engines, parts, packages and workshop services.' },
];

export default function AboutPage() {
  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative min-h-[400px] bg-zinc-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1600&q=80" alt="Workshop" className="w-full h-full object-cover opacity-20" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-6">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
            <Link href="/" className="hover:text-zinc-300">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-300">About Us</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-heading leading-tight">
            About <span className="text-gradient-warm">Our Workshop</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed text-lg">
            {/* TODO: Replace with real company story */}
            We are UK-based JDM engine specialists. We supply, build and fit Japanese performance engines — from used JDM imports to fully forged race builds. Every engine is tested, every build is documented.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-zinc-100 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '[TODO]', label: 'Years in Business', icon: Clock },
              { value: '[TODO]', label: 'Engines Supplied', icon: Gauge },
              { value: '[TODO]', label: 'Builds Completed', icon: Wrench },
              { value: '100%', label: 'Compression Tested', icon: ShieldCheck },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="space-y-2">
                <Icon className="w-6 h-6 text-red-700 mx-auto" />
                <p className="text-3xl font-black text-zinc-950 font-heading">{value}</p>
                <p className="text-xs text-zinc-600 font-bold uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-red-700 text-xs font-black uppercase tracking-widest">Our Story</p>
            <h2 className="text-3xl font-black text-zinc-950 font-heading">Built by Enthusiasts,<br />for Enthusiasts.</h2>
            <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
              <p>
                {/* TODO: Replace with real story from client */}
                What started as a passion for Japanese performance cars in a single-bay garage has grown into a dedicated JDM engine specialist serving builders across the UK. We understand these engines because we build with them ourselves.
              </p>
              <p>
                Our workshop is equipped for full engine strip-downs, machining, assembly, dyno testing and fitting. We source engines directly from Japan through trusted suppliers, and every unit is inspected and compression tested before it leaves us.
              </p>
              <p>
                Whether you need a stock replacement 2JZ-GTE, a forged RB26 for 800+ bhp, or a complete engine swap with fitting — we handle everything in-house.
              </p>
            </div>
            <Link href="/workshop" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">
              View Workshop Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden border border-zinc-200 aspect-[4/3]">
            {/* TODO: Replace with real facility photo */}
            <img src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=800&q=80" alt="Our Workshop" className="w-full h-full object-cover opacity-70" />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">Our Journey</p>
            <h2 className="text-3xl font-black text-zinc-950 font-heading">How We Got Here</h2>
          </div>
          <div className="space-y-6">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="shrink-0 w-20 text-right">
                  <span className="text-lg font-black text-red-700 font-heading">{m.year}</span>
                </div>
                <div className="relative pb-6">
                  <div className="absolute left-0 top-2 bottom-0 w-px bg-zinc-100" />
                  <div className="w-3 h-3 rounded-full bg-red-600 border-2 border-zinc-300 absolute -left-[5px] top-1.5" />
                  <div className="pl-8">
                    <h3 className="font-black text-zinc-950 text-sm font-heading">{m.title}</h3>
                    <p className="text-zinc-600 text-sm mt-1">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">The Team</p>
            <h2 className="text-3xl font-black text-zinc-950 font-heading">Meet the Specialists</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TEAM.map(member => (
              <div key={member.name} className="bg-white border border-zinc-200 rounded-2xl p-6 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-300 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-zinc-600" />
                </div>
                <div>
                  <h3 className="font-black text-zinc-950 text-base font-heading">{member.name}</h3>
                  <p className="text-red-700 text-xs font-bold mt-1">{member.role}</p>
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-zinc-600 text-xs mt-6">TODO: Add real team photos and biographies once confirmed by client.</p>
        </div>
      </section>
    </div>
  );
}
