import Link from 'next/link';
import { ChevronRight, ShieldCheck } from 'lucide-react';

export default function WarrantyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">Warranty</span>
      </nav>

      <div className="bg-white border border-zinc-200 rounded-2xl p-7 sm:p-9">
        <ShieldCheck className="w-10 h-10 text-red-700 mb-5" />
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 font-heading mb-3">Warranty Information</h1>
        <p className="text-zinc-700 leading-relaxed">
          Warranty cover depends on the item and must be confirmed by the business. The examples shown in this store preview are placeholders, not an offer or confirmed warranty term.
        </p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          TODO before launch: add the approved warranty duration, coverage, exclusions, claim process and return arrangements for each product type.
        </div>
        <p className="text-sm text-zinc-600 mt-6">
          Check the final terms supplied with the product before purchase. For a product-specific question, use the <Link href="/contact" className="text-red-700 hover:text-red-700 font-bold">contact page</Link> once the business contact details are confirmed.
        </p>
      </div>
    </div>
  );
}
