"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight, Car, CircleDot, ClipboardList, Cpu, Droplets, Gauge,
  GitBranch, Layers, Settings, Wrench, Zap,
} from 'lucide-react';
import { ENGINES, PRIORITY_ENGINES, getEngineByCode } from '@/lib/jdm-catalog';
import { PERFORMANCE_PART_GROUPS, PERFORMANCE_PARTS } from '@/lib/performance-parts';

const SERVICE_GROUPS = [
  {
    id: 'engine-services',
    title: 'Engine builds & management',
    services: [
      {
        id: 'build-planning',
        icon: ClipboardList,
        title: 'Build Planning & Parts Sourcing',
        description: 'Put together a parts list around your engine variant, chassis, power target and budget.',
        topics: ['OEM and aftermarket parts', 'Fitment and parts-list checks', 'Parts-only or supply-and-fit quotes'],
      },
      {
        id: 'engine-swaps',
        icon: Wrench,
        title: 'Engine Swaps',
        description: 'Discuss a 2JZ, RB25 or RB26 conversion, from engine sourcing through to the first start.',
        topics: ['Engine and gearbox packages', 'Mounts and clearance', 'Wiring, fuel and cooling integration'],
      },
      {
        id: 'engine-rebuilds',
        icon: Settings,
        title: 'Rebuilds, Forged Engines & Stroker Kits',
        description: 'Scope an OEM-spec refresh, a forged performance build or a stroker build for your intended use.',
        topics: ['Forged pistons and conrods', 'Crankshafts, bearings and fasteners', 'Camshafts, valvetrain and machining requirements'],
      },
      {
        id: 'supporting-systems',
        icon: Droplets,
        title: 'Fuel, Oiling & Cooling Upgrades',
        description: 'Plan supporting upgrades around the engine, turbo and how the car will be used.',
        topics: ['Injectors, pumps and regulators', 'Oil pumps, oil coolers and catch cans', 'Radiators, hoses and fans'],
      },
      {
        id: 'ecu-tuning',
        icon: Zap,
        title: 'ECU, Wiring & Dyno Tuning',
        description: 'Enquire about engine management, wiring and calibration for your combination.',
        topics: ['Standalone ECUs and conversion looms', 'Sensors, ignition and data logging', 'Mapping and dyno requirements'],
      },
      {
        id: 'diagnostics',
        icon: Settings,
        title: 'Diagnostics & Servicing',
        description: 'Describe running faults or request a health check before committing to an upgrade.',
        topics: ['Fault finding', 'Compression and leak-down testing', 'Servicing and inspection'],
      },
    ],
  },
  {
    id: 'fabrication-services',
    title: 'Turbo systems & fabrication',
    services: [
      {
        id: 'turbo-installation',
        icon: Gauge,
        title: 'Turbo Installation & Boost Control',
        description: 'Check the complete turbo package against your engine, chassis and power target.',
        topics: ['Single-turbo conversions and manifolds', 'Wastegates, actuators and boost controllers', 'Intercoolers, blow-off valves and oil or coolant lines'],
      },
      {
        id: 'custom-fabrication',
        icon: Layers,
        title: 'Custom Work and Fabrication',
        description: 'Discuss bespoke work when an off-the-shelf part does not suit your build.',
        topics: ['Charge pipes, mounts and brackets', 'Stainless steel, Inconel, aluminium or titanium requirements'],
      },
      {
        id: 'custom-exhaust-manifolds',
        icon: Wrench,
        title: 'Custom Exhaust Manifolds',
        description: 'Ask about a manifold built around your cylinder head, engine bay and intended use.',
        topics: ['Turbo, naturally aspirated and supercharged applications', 'Flanges, collectors and wastegate clearance'],
      },
      {
        id: 'under-car-exhausts',
        icon: Layers,
        title: 'Under-Car Exhaust Systems',
        description: 'Scope a bespoke exhaust around the vehicle’s space, noise and flow requirements.',
        topics: ['Downpipes, mid-sections, X-pipes and backboxes', 'Routing, ground clearance and mounting points'],
      },
      {
        id: 'cad-design',
        icon: Settings,
        title: 'CAD Design',
        description: 'Bring drawings, dimensions or an existing part to discuss a custom design.',
        topics: ['Flanges, brackets and prototypes', 'Mounting geometry and fitment requirements'],
      },
      {
        id: 'component-manufacturing',
        icon: Layers,
        title: 'Component Manufacturing',
        description: 'Enquire about a one-off component and the material, finish and tolerances it needs.',
        topics: ['Automotive and other fabrication enquiries', 'Drawings, samples and material specifications'],
      },
      {
        id: 'small-batch-production',
        icon: Settings,
        title: 'Small Batch Production',
        description: 'Discuss repeat production of a part, including quantity, drawings and delivery requirements.',
        topics: ['Prototype and sample requirements', 'Repeat runs and finishing options'],
      },
      {
        id: 'fitment-check',
        icon: Car,
        title: 'Find My Car',
        description: 'Request a fitment check before choosing a manifold, turbo or wastegate.',
        topics: ['Engine variant and vehicle chassis', 'Turbo brand, model, inlet flange and wastegate'],
      },
    ],
  },
  {
    id: 'chassis-services',
    title: 'Drivetrain, chassis & fitment',
    services: [
      {
        id: 'tcu-gearbox',
        icon: Cpu,
        title: 'Gearbox, TCU & Drivetrain Fitting',
        description: 'Plan a manual conversion, automatic controller upgrade or driveline setup.',
        topics: ['Gearbox kits and TCU calibration', 'Clutches and lightweight flywheels', 'Limited-slip differentials, propshafts and axles'],
      },
      {
        id: 'suspension-steering',
        icon: GitBranch,
        title: 'Suspension & Steering Setup',
        description: 'Discuss suspension and steering options for road, track or drift use.',
        topics: ['Coilovers, dampers and springs', 'Adjustable arms, bushes and bracing', 'Steering-angle kits and alignment requirements'],
      },
      {
        id: 'wheel-fitment',
        icon: CircleDot,
        title: 'Wheel & Tyre Fitment',
        description: 'Check wheel and tyre sizing against your chassis, brakes and intended use.',
        topics: ['Width, offset and bolt pattern', 'Tyres, spacers and hardware', 'Arch, suspension and brake clearance'],
      },
      {
        id: 'track-preparation',
        icon: Car,
        title: 'Brakes & Motorsport Preparation',
        description: 'Ask about braking, cockpit and lighting parts for your build.',
        topics: ['Brake packages and hydraulic handbrakes', 'Seat mounts, harnesses and steering controls', 'Headlights, tail lights and fitment checks'],
      },
    ],
  },
];

const fabricationServices = SERVICE_GROUPS.find(group => group.id === 'fabrication-services').services;
const fitmentParts = PERFORMANCE_PART_GROUPS
  .filter(group => ['manifolds', 'turbo-and-boost', 'fabrication-components'].includes(group.id))
  .flatMap(group => group.items);
const fitmentFields = [
  { name: 'turboBrand', label: 'Turbo brand' },
  { name: 'turboModel', label: 'Turbo model' },
  { name: 'turboFlange', label: 'Turbo inlet flange', placeholder: 'e.g. T3, T4 twin-scroll, V-band' },
  { name: 'wastegate', label: 'Wastegate', placeholder: 'e.g. internal or external, size if known' },
];

const fieldClass = 'w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-950 placeholder-zinc-500 focus:border-red-600';
const labelClass = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-600';

function WorkshopContent() {
  const params = useSearchParams();
  const engineCode = (params.get('engine') ?? '').toUpperCase();
  const initialEngine = engineCode === 'RB25DET NEO' ? engineCode : getEngineByCode(engineCode)?.code ?? '';
  const initialService = PERFORMANCE_PARTS.find(item => item.id === params.get('part'))?.title
    ?? SERVICE_GROUPS.flatMap(group => group.services).find(item => item.id === params.get('service'))?.title
    ?? '';
  return <Workshop key={`${initialEngine}:${initialService}`} initialEngine={initialEngine} initialService={initialService} />;
}

export default function WorkshopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-16 text-zinc-600">Loading workshop services…</div>}>
      <WorkshopContent />
    </Suspense>
  );
}

function Workshop({ initialEngine, initialService }: { initialEngine: string; initialService: string }) {
  const [engine, setEngine] = useState(initialEngine);
  const [service, setService] = useState(initialService);
  const [sending, setSending] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const showFitmentFields = fabricationServices.some(item => item.title === service)
    || fitmentParts.some(item => item.title === service);

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const details = Object.fromEntries(new FormData(form).entries());
    setSending(true);
    setFormMessage('');
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Quote request could not be sent.');
      form.reset();
      setEngine(initialEngine);
      setService(initialService);
      setFormMessage('Thanks — your quote request has been sent.');
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Quote request could not be sent.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-cyan-200">Jackson Works Workshop</p>
          <h1>Workshop <span className="text-gradient-warm">Services</span></h1>
          <p className="mt-4 max-w-2xl text-zinc-200">
            Plan a Toyota 2JZ, Nissan RB25 or Nissan RB26 build. Ask about engine rebuilds and swaps, turbo fabrication,
            drivetrain conversions or setting up the chassis around your power goals.
          </p>
          <a href="#quote" className="button-bright mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-colors">
            Request a quote <ArrowRight className="h-4 w-4" />
          </a>
          <Link href="/performance-parts" className="ml-4 mt-4 inline-flex items-center gap-2 text-sm font-bold text-cyan-200 hover:underline">
            Browse performance parts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="workshop-platforms" className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <h2 id="workshop-platforms">Start with your engine</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PRIORITY_ENGINES.map(({ label, code, variants }) => (
              <article key={code} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <h3 className="text-zinc-950">{label}</h3>
                <p className="text-xs text-zinc-600">{variants}</p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
                  <Link href={`/shop?engine=${encodeURIComponent(code)}`} className="text-zinc-700 hover:underline">Browse parts</Link>
                  <a href="#quote" onClick={() => setEngine(code)} className="text-red-700 hover:underline">Request a quote</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="workshop-services" className="mx-auto max-w-7xl space-y-9 px-4 py-10 sm:px-6 sm:py-14">
        <div>
          <h2 id="workshop-services">Explore services</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Choose a service to start an enquiry. Fitment, parts availability and workshop scope are confirmed when quoting.
          </p>
          <nav aria-label="Workshop service groups" className="mt-4 flex flex-wrap gap-2">
            {SERVICE_GROUPS.map(group => (
              <a key={group.id} href={`#${group.id}`} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-bold hover:border-amber-400">{group.title}</a>
            ))}
          </nav>
        </div>

        {SERVICE_GROUPS.map(group => (
          <section key={group.id} id={group.id} className="scroll-mt-36" aria-labelledby={`${group.id}-title`}>
            <h3 id={`${group.id}-title`} className="mb-4">{group.title}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.services.map(({ id, icon: Icon, title, description, topics }) => (
                <article key={id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-amber-100 text-amber-900">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h4>{title}</h4>
                  </div>
                  <p className="text-sm text-zinc-600">{description}</p>
                  <ul className="ml-4 list-disc space-y-1 text-xs text-zinc-700">
                    {topics.map(topic => <li key={topic}>{topic}</li>)}
                  </ul>
                  <a href="#quote" onClick={() => setService(title)} aria-label={`Request a quote for ${title}`} className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-bold text-red-700 hover:underline">
                    Request a quote <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        ))}
      </section>

      <section id="quote" className="scroll-mt-36 border-t border-zinc-200 bg-zinc-100 py-12 sm:py-16" aria-labelledby="quote-title">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="quote-title">Request a Quote</h2>
          <p className="mb-6 mt-2 text-sm text-zinc-600">Tell us your chassis, exact engine variant and plans for the car so we can check what fits.</p>
          <form onSubmit={submitQuote} className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Your Name *</span>
                <input name="name" required type="text" autoComplete="name" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Phone *</span>
                <input name="phone" required type="tel" autoComplete="tel" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Email *</span>
                <input name="email" required type="email" autoComplete="email" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Vehicle registration (optional)</span>
                <input name="registration" type="text" placeholder="AB12 CDE" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Vehicle / Chassis</span>
                <input name="vehicle" type="text" placeholder="e.g. Supra A80, Skyline R34" className={fieldClass} />
              </label>
              <label>
                <span className={labelClass}>Engine Code</span>
                <input name="engine" type="text" list="workshop-engine-codes" value={engine} onChange={event => setEngine(event.target.value)} placeholder="e.g. RB25DET NEO" className={fieldClass} />
                <datalist id="workshop-engine-codes">
                  {ENGINES.map(item => <option key={item.code} value={item.code} />)}
                  <option value="RB25DET NEO" />
                </datalist>
              </label>
            </div>
            <label className="block">
              <span className={labelClass}>Service Required *</span>
              <select name="service" required value={service} onChange={event => setService(event.target.value)} className={fieldClass}>
                <option value="">Select a service</option>
                {SERVICE_GROUPS.map(group => (
                  <optgroup key={group.id} label={group.title}>
                    {group.services.map(item => <option key={item.id} value={item.title}>{item.title}</option>)}
                  </optgroup>
                ))}
                {PERFORMANCE_PART_GROUPS.map(group => (
                  <optgroup key={group.id} label={`Parts · ${group.title}`}>
                    {group.items.map(item => <option key={item.id} value={item.title}>{item.title}</option>)}
                  </optgroup>
                ))}
                <option value="Other / Not Sure">Other / Not Sure</option>
              </select>
            </label>
            {showFitmentFields && (
              <fieldset className="grid gap-4 rounded-xl border border-zinc-200 p-4 sm:grid-cols-2">
                <legend className="px-1 text-sm font-bold text-zinc-700">Turbo fitment details (optional)</legend>
                {fitmentFields.map(({ name, label, placeholder }) => (
                  <label key={name}>
                    <span className={labelClass}>{label}</span>
                    <input type="text" name={name} maxLength={160} placeholder={placeholder} className={fieldClass} />
                  </label>
                ))}
              </fieldset>
            )}
            <label className="block">
              <span className={labelClass}>Details *</span>
              <textarea name="message" required rows={4} maxLength={5000} placeholder="Tell us about the parts or work you need, any existing modifications and how you use the car." className={fieldClass} />
            </label>
            {formMessage && <p role="status" className={`text-sm ${formMessage.startsWith('Thanks') ? 'text-green-700' : 'text-amber-700'}`}>{formMessage}</p>}
            <button disabled={sending} className="button-bright flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-colors disabled:opacity-60">
              {sending ? 'Sending…' : 'Submit Quote Request'} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
