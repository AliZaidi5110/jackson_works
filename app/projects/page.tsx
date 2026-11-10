"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Wrench, ArrowRight, Camera } from 'lucide-react';

const PROJECTS = [
  {
    id: 'supra-2jz-swap',
    title: '2JZ-GTE Full Swap – Toyota Supra A80',
    engine: '2JZ-GTE',
    desc: 'Complete engine swap from stock 2JZ-GE to a fully built 2JZ-GTE with single turbo conversion. R154 gearbox, standalone ECU, custom intercooler piping and exhaust fabrication.',
    tags: ['Engine Swap', '2JZ-GTE', 'Single Turbo', 'R154 Gearbox'],
    result: '620 bhp at the flywheel',
  },
  {
    id: 'r34-rb26-rebuild',
    title: 'RB26DETT Forged Rebuild – Skyline R34 GT-R',
    engine: 'RB26DETT',
    desc: 'Full engine strip-down and rebuild with forged CP pistons, Manley rods, Tomei cams, and a large single-turbo conversion targeting 700+ bhp. Haltech Elite ECU with dyno tune.',
    tags: ['Engine Rebuild', 'RB26DETT', 'Forged Build', 'Haltech'],
    result: '712 bhp at the flywheel',
  },
  {
    id: 's15-sr20-turbo',
    title: 'SR20DET Turbo Upgrade – Nissan Silvia S15',
    engine: 'SR20DET',
    desc: 'Turbo upgrade from stock T28 to a Garrett GTX2871R with supporting fuel system, intercooler and Link G4X standalone ECU. Drift-spec build for track use.',
    tags: ['Turbo Upgrade', 'SR20DET', 'Drift Build', 'Link ECU'],
    result: '380 bhp at the wheels',
  },
  {
    id: 'evo9-4g63-rebuild',
    title: '4G63 Forged Rebuild – Mitsubishi Evo IX',
    engine: '4G63',
    desc: 'Full engine rebuild with forged internals, ported head, TD06SH-20G turbo and AEM Infinity ECU. Built for time attack and road use.',
    tags: ['Engine Rebuild', '4G63', 'Evo IX', 'Time Attack'],
    result: '520 bhp at the flywheel',
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-0">
      <section className="bg-zinc-50 py-12 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-700">Projects & Builds</span>
          </nav>
          <h1 className="text-4xl font-black text-zinc-950 font-heading">Projects & Builds</h1>
          <p className="text-zinc-600 mt-2 max-w-xl">A selection of engine builds and swaps completed in our workshop. Each project showcases our approach to quality, testing and performance.</p>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {PROJECTS.map((project, i) => (
            <div key={project.id} className={`bg-white border border-zinc-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0`}>
              {/* Image placeholder */}
              <div className={`aspect-[16/10] lg:aspect-auto bg-zinc-100 flex items-center justify-center ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                {/* TODO: Replace with real project photos */}
                <div className="text-center space-y-3 p-8">
                  <Camera className="w-12 h-12 text-zinc-800 mx-auto" />
                  <p className="text-zinc-700 text-xs font-bold">TODO: Add before/after photos</p>
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">{tag}</span>
                  ))}
                </div>
                <h2 className="text-xl font-black text-zinc-950 font-heading">{project.title}</h2>
                <p className="text-zinc-600 text-sm leading-relaxed">{project.desc}</p>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-600 font-bold uppercase">Result</p>
                    <p className="text-lg font-black text-zinc-950 font-heading">{project.result}</p>
                  </div>
                </div>
                <Link href="/workshop" className="inline-flex items-center gap-2 text-sm font-bold text-red-700 hover:text-red-700 transition-colors">
                  Interested in a similar build? <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <h3 className="text-2xl font-black text-zinc-950 font-heading">Want Us to Build Yours?</h3>
          <p className="text-zinc-600 text-sm">From stock replacements to 1,000+ bhp race engines, we handle it all in-house.</p>
          <Link href="/workshop" className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all">
            View Workshop Services <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
