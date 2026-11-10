import Link from 'next/link';
import { ChevronRight, FileText } from 'lucide-react';

export default function PolicyPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">{title}</span>
      </nav>
      <section className="bg-white border border-zinc-200 rounded-2xl p-7 sm:p-9">
        <FileText className="w-9 h-9 text-red-700 mb-5" />
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 font-heading mb-3">{title}</h1>
        <p className="text-zinc-700 leading-relaxed">{description}</p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          TODO before launch: provide the business-specific policy and have it reviewed. This preview is not legal advice and does not establish customer terms.
        </div>
      </section>
    </div>
  );
}
