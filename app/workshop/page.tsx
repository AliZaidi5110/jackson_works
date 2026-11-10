"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench, Gauge, Zap, Cpu, Settings, Layers, Phone,
  Mail, ArrowRight, CheckCircle, Clock, ShieldCheck,
  Star, ChevronRight, Upload,
} from 'lucide-react';

const SERVICES = [
  {
    id: 'engine-swaps',
    icon: Wrench,
    title: 'Engine Swaps',
    price: 'Quote required',
    desc: 'Full JDM engine swaps for Toyota, Nissan, Mitsubishi, Honda, Mazda and Subaru platforms. We handle everything from removal to installation, wiring, cooling and first start.',
    steps: ['Vehicle inspection and assessment', 'Engine removal and bay preparation', 'New engine installation and alignment', 'Wiring, cooling and fuel system connection', 'Fluids, start-up and road test'],
  },
  {
    id: 'engine-rebuilds',
    icon: Settings,
    title: 'Engine Rebuilds',
    price: 'Quote required',
    desc: 'Complete engine strip, inspection, machining and rebuild using OEM or performance components. All builds compression tested and documented.',
    steps: ['Full strip-down and inspection', 'Block boring, honing and machining', 'New gaskets, bearings, seals and rings', 'Assembly with torque specifications', 'Compression test and break-in'],
  },
  {
    id: 'turbo-installation',
    icon: Gauge,
    title: 'Turbo Installation',
    price: 'Quote required',
    desc: 'Single-turbo conversions, turbo upgrades, manifold fitting, oil and water line installation, intercooler and charge pipe routing.',
    steps: ['Existing turbo removal (if applicable)', 'Manifold and turbo fitting', 'Oil and water line installation', 'Intercooler and piping setup', 'Boost leak test and check'],
  },
  {
    id: 'ecu-tuning',
    icon: Zap,
    title: 'ECU Tuning & Dyno',
    price: 'Quote required',
    desc: 'Standalone ECU installation, wiring and mapping on our in-house dyno. Haltech, Link, AEM and OEM ECU tuning for Japanese engines.',
    steps: ['ECU installation and wiring', 'Sensor calibration', 'Base map and idle setup', 'Dyno tuning (power runs)', 'Final health check and report'],
  },
  {
    id: 'tcu-gearbox',
    icon: Cpu,
    title: 'TCU & Gearbox Fitting',
    price: 'Quote required',
    desc: 'Gearbox conversions, TCU installation and calibration, clutch and flywheel fitting, driveshaft modification and prop balancing.',
    steps: ['Gearbox removal and inspection', 'New gearbox or conversion kit fitting', 'TCU wiring and calibration', 'Clutch and flywheel installation', 'Road test and quality check'],
  },
  {
    id: 'diagnostics',
    icon: Settings,
    title: 'Diagnostics & Servicing',
    price: 'Quote required',
    desc: 'Full engine diagnostics, fault finding, compression testing, oil analysis and scheduled servicing for Japanese performance vehicles.',
    steps: ['OBD scan and fault code read', 'Visual and auditory inspection', 'Compression and leak-down test', 'Fault diagnosis and report', 'Repair recommendation and quote'],
  },
  {
    id: 'custom-fabrication',
    icon: Layers,
    title: 'Custom Fabrication',
    price: 'Quote required',
    desc: 'Bespoke exhaust fabrication, intercooler piping, engine mounts, brackets, turbo manifolds and one-off parts made to specification.',
    steps: ['Design and measurement', 'Material selection (stainless, mild steel, aluminium)', 'TIG/MIG welding and fabrication', 'Test fit and adjustment', 'Finishing and installation'],
  },
];

export default function WorkshopPage() {
  const [sending, setSending] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const submitQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setFormMessage('');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Quote request could not be sent.');
      form.reset();
      setFormMessage('Thanks — your quote request has been sent.');
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Quote request could not be sent.');
    } finally { setSending(false); }
  };

  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="relative min-h-[400px] bg-zinc-950 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* TODO: Replace with real workshop photography */}
          <img
            src="https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&w=1600&q=80"
            alt="JDM Engine Workshop"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-950/60 border border-red-800/50 px-3.5 py-1.5 rounded-full text-red-300 text-xs font-bold">
            <Wrench className="w-3.5 h-3.5" />
            Our Workshop
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-heading leading-tight">
            Workshop<br />
            <span className="text-gradient-warm">Services.</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl leading-relaxed">
            We supply and fit. Our specialists carry out full engine swaps, rebuilds, gearbox conversions, turbo installations, ECU mapping and diagnostics. Experienced with 2JZ, RB26, RB25, SR20, 4G63 and more.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#quote" className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
              Get a Quote <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/contact" className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
              <Phone className="w-4 h-4 text-red-500" /> Contact Details
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">What we do</p>
            <h2 className="text-3xl font-black text-zinc-950 font-heading">Our Services</h2>
            <p className="text-zinc-600 text-sm mt-2 max-w-xl mx-auto">
              From engine swaps to custom fabrication, we handle every aspect of your JDM build.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(service => {
              const Icon = service.icon;
              const isOpen = selectedService === service.id;
              return (
                <div
                  key={service.id}
                  className={`bg-white border rounded-2xl p-6 transition-all cursor-pointer ${isOpen ? 'border-red-600 shadow-lg shadow-red-200/50' : 'border-zinc-200 hover:border-zinc-400'}`}
                  onClick={() => setSelectedService(isOpen ? null : service.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-red-700" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-zinc-950 text-base font-heading">{service.title}</h3>
                      <p className="text-red-700 text-sm font-bold mt-1">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-zinc-600 text-sm leading-relaxed mt-4">{service.desc}</p>

                  {isOpen && (
                    <div className="mt-5 pt-5 border-t border-zinc-200 space-y-2 animate-fadeIn">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">Process</p>
                      {service.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm">
                          <span className="text-red-700 font-black text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-zinc-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section id="quote" className="py-16 bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-red-700 text-xs font-black uppercase tracking-widest mb-2">Get started</p>
            <h2 className="text-3xl font-black text-zinc-950 font-heading">Request a Quote</h2>
            <p className="text-zinc-600 text-sm mt-2">Quote request form concept. Enquiry handling and response times need business confirmation.</p>
          </div>

          <form onSubmit={submitQuote} className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Your Name *</label>
                <input name="name" required type="text" placeholder="John Smith" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Phone *</label>
                <input name="phone" required type="tel" placeholder="07xxx xxx xxx" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Email *</label>
                <input name="email" required type="email" placeholder="you@example.co.uk" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Vehicle Reg (optional)</label>
                <input name="registration" type="text" placeholder="AB12 CDE" className="uk-plate-input w-full py-2.5 px-3 text-sm text-center focus:outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Vehicle / Chassis</label>
                <input name="vehicle" type="text" placeholder="e.g. Supra A80, Skyline R34" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Engine Code</label>
                <input name="engine" type="text" placeholder="e.g. 2JZ-GTE, RB26DETT" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Service Required *</label>
              <select name="service" required className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 focus:outline-none focus:border-red-600 transition-colors">
                <option value="">Select a service</option>
                {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                <option value="other">Other / Not Sure</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Details *</label>
              <textarea name="message" required rows={4} placeholder="Describe the work you need – be as specific as possible…" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Photos (optional)</label>
              <div className="border-2 border-dashed border-zinc-300 rounded-xl py-8 text-center text-zinc-600 text-sm">
                <Upload className="w-6 h-6 mx-auto mb-2 text-zinc-600" />
                <p>Photo uploads will be available when file storage is configured.</p>
              </div>
            </div>
            <p className="text-xs text-zinc-600">Quote requests are emailed to the business contact configured for this site.</p>
            {formMessage && <p role="status" className={`text-sm ${formMessage.startsWith('Thanks') ? 'text-green-700' : 'text-amber-700'}`}>{formMessage}</p>}
            <button disabled={sending} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 disabled:text-zinc-600 text-white font-black py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200/50">
              {sending ? 'Sending…' : 'Submit Quote Request'} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-zinc-600 text-[11px] text-center">TODO: Confirm contact details and response times.</p>
          </form>
        </div>
      </section>
    </div>
  );
}
