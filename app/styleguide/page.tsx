import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Typography Style Guide',
  robots: { index: false, follow: false },
};

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <header className="mb-14 border-b border-zinc-200 pb-10">
        <p className="type-meta mb-3 uppercase tracking-[0.14em] text-red-700">Store design system</p>
        <h1 className="type-h1">Typography style guide</h1>
        <p className="type-body mt-5 text-zinc-700">
          A precise, readable type system for product details, prices, workshop information and administration.
        </p>
      </header>

      <section className="mb-14 space-y-7" aria-labelledby="display-heading">
        <h2 id="display-heading" className="type-h2">Display hierarchy</h2>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-8">
          <p className="type-meta mb-2 text-zinc-600">H1 · Barlow Condensed 800</p>
          <p className="type-h1">Built for the redline</p>
          <p className="type-meta mb-2 mt-8 text-zinc-600">H2 · Barlow Condensed 700</p>
          <p className="type-h2">Japanese engine specialists</p>
          <p className="type-meta mb-2 mt-8 text-zinc-600">H3 · Barlow Condensed 600</p>
          <p className="type-h3">Nissan Skyline RB26DETT</p>
          <p className="type-meta mb-2 mt-8 text-zinc-600">H4 · Inter 600</p>
          <p className="type-h4">Condition and fitment</p>
        </div>
      </section>

      <section className="mb-14 space-y-7" aria-labelledby="body-heading">
        <h2 id="body-heading" className="type-h2">Body and interface</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="type-h3 mb-4">Product description</h3>
            <p className="type-body text-zinc-700">
              Carefully inspected Japanese import engine, supplied with a compression report and clear fitment details.
              Our team can help confirm compatibility before you order.
            </p>
            <p className="type-meta mt-5 text-zinc-600">In stock · Dispatch in 2–4 working days</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <h3 className="type-h3 mb-4">Actions and badges</h3>
            <div className="flex flex-wrap items-center gap-3">
              <button className="type-button rounded-lg bg-red-600 px-5 py-3 text-white">Add to basket</button>
              <span className="type-meta rounded-full border border-green-200 bg-green-50 px-3 py-1 text-green-700">IN STOCK</span>
            </div>
            <p className="type-meta mt-5 text-zinc-600">Buttons use Inter 600; helper text stays readable at small sizes.</p>
          </div>
        </div>
      </section>

      <section className="mb-14 space-y-7" aria-labelledby="data-heading">
        <h2 id="data-heading" className="type-h2">Prices and technical data</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <p className="type-meta text-zinc-600">Performance package</p>
            <p className="type-price mt-2 text-3xl text-zinc-950">£1,499.00</p>
            <p className="type-meta mt-2 text-zinc-600">From £1,250.00 ex. VAT</p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-6">
            <p className="type-meta mb-4 text-zinc-600">Specification · JetBrains Mono 400</p>
            <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-3 type-spec text-zinc-800">
              <dt>Engine code</dt><dd className="type-code">2JZ-GTE</dd>
              <dt>Part number</dt><dd className="type-code">JDM-2JZ-0042</dd>
              <dt>Power</dt><dd>320 bhp</dd>
              <dt>Torque</dt><dd>427 Nm</dd>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="admin-heading">
        <h2 id="admin-heading" className="type-h2 mb-7">Admin data treatment</h2>
        <div className="admin-portal rounded-xl border border-zinc-200 bg-white p-6 text-zinc-800">
          <h3 className="mb-4">Recent inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead><tr className="border-b border-zinc-300 text-zinc-600"><th className="py-3 pr-4 font-medium">Item</th><th className="py-3 pr-4 font-medium">SKU</th><th className="py-3 text-right font-medium">Price</th></tr></thead>
              <tbody><tr className="border-b border-zinc-200"><td className="py-3 pr-4">Toyota 2JZ-GTE</td><td className="type-code py-3 pr-4">JDM-2JZ-0042</td><td className="tabular-nums py-3 text-right">£1,499.00</td></tr></tbody>
            </table>
          </div>
          <p className="type-meta mt-4 text-zinc-600">Inter at a 14px base; mono reserved for SKUs and IDs.</p>
        </div>
      </section>
    </div>
  );
}
