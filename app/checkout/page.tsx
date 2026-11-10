"use client";

import React, { useState } from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import { useApp } from '@/lib/jdm-context';
import { calculateDeposit } from '@/lib/jdm-catalog';
import {
  ShieldCheck, Truck, Lock, CreditCard, ChevronRight,
  CheckCircle, AlertCircle, Minus, Plus, X, ArrowLeft,
  Info, Clock, Package,
} from 'lucide-react';

type Step = 'basket' | 'details' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateCartQty, vatInclusive, cartTotal, cartDeposit, cartBalance, cartCount } = useApp();
  const [step, setStep] = useState<Step>('basket');
  const [depositTermsAgreed, setDepositTermsAgreed] = useState(false);
  const [orderRef] = useState(() => `JDM-${Math.floor(Math.random() * 9000) + 1000}`);

  // Form state
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address1: '', address2: '', city: '', county: '', postcode: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Shipping rates are not confirmed yet; keep the estimate separate in this preview.
  const shipping = 0;
  const orderTotal = cartTotal + shipping;
  const { deposit, balance } = calculateDeposit(orderTotal);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim())  errs.lastName  = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (!form.address1.trim()) errs.address1 = 'Required';
    if (!form.city.trim())     errs.city     = 'Required';
    if (!form.postcode.trim()) errs.postcode = 'Valid UK postcode required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-white border border-zinc-200 flex items-center justify-center">
          <Package className="w-10 h-10 text-zinc-600" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-zinc-950 font-heading">Your basket is empty</h2>
          <p className="text-zinc-600 text-sm mt-2">Add some products before checking out.</p>
        </div>
        <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
          Browse Parts
        </Link>
      </div>
    );
  }

  if (step === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-700" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-zinc-950 font-heading">Order Confirmed!</h1>
            <p className="text-zinc-600 mt-2">This is a demonstration confirmation. No payment has been taken and no order has been placed.</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider">Order Reference</p>
              <p className="text-2xl font-black text-red-700 font-mono mt-1">{orderRef}</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-wider">Date</p>
              <p className="text-zinc-700 text-sm mt-1">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <hr className="border-zinc-200" />

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Sample total before delivery</span>
              <span className="font-bold text-zinc-950">{formatGBP(orderTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700 font-bold">✓ Deposit Paid (10%)</span>
              <span className="font-black text-green-700">{formatGBP(deposit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-700 font-bold">Balance Due Before Dispatch</span>
              <span className="font-black text-amber-700">{formatGBP(balance)}</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-700 space-y-1.5">
            <p className="font-bold flex items-center gap-2"><Info className="w-3.5 h-3.5" /> What happens next?</p>
              <p>This screen is for layout preview only. The store has no payment, email or order-processing connection.</p>
              <p>Deposit shown: <strong>{formatGBP(deposit)}</strong> · Remaining balance example: <strong>{formatGBP(balance)}</strong>.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account" className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
            View My Orders
          </Link>
          <Link href="/shop" className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-zinc-950 font-heading">Secure Checkout</h1>
        <p className="text-zinc-600 text-sm mt-1">Sample deposit calculation · Payment is not connected</p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {([
          { id: 'basket',  label: 'Basket' },
          { id: 'details', label: 'Your Details' },
          { id: 'payment', label: 'Payment' },
        ] as { id: Step; label: string }[]).map((s, i, arr) => (
          <React.Fragment key={s.id}>
            <button
              onClick={() => { if (s.id === 'basket' || step !== 'basket') setStep(s.id); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${step === s.id ? 'bg-red-600 text-white' : ['basket', 'details', 'payment'].indexOf(step) > ['basket', 'details', 'payment'].indexOf(s.id) ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-zinc-100 text-zinc-600'}`}
            >
              <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">{i + 1}</span>
              {s.label}
            </button>
            {i < arr.length - 1 && <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column – step content */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── STEP: Basket ─────────────────────────────────────────────── */}
          {step === 'basket' && (
            <div className="space-y-4">
              <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-zinc-200 flex items-center gap-2">
                  <Package className="w-4 h-4 text-red-700" />
                  <h2 className="font-bold text-zinc-950 text-sm font-heading">Your Basket ({cartCount} {cartCount === 1 ? 'item' : 'items'})</h2>
                </div>
                <div className="divide-y divide-zinc-800">
                  {cart.map(item => {
                    const price = vatInclusive ? item.product.priceIncVat : item.product.priceExVat;
                    const lineTotal = price * item.qty;
                    const { deposit: lineDeposit } = calculateDeposit(item.product.priceIncVat * item.qty, item.product.depositPct);
                    return (
                      <div key={item.id} className="p-5 flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                          <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <p className="font-bold text-zinc-950 text-sm leading-snug line-clamp-2">{item.product.title}</p>
                          <div className="flex flex-wrap gap-2 text-[10px]">
                            <span className="font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">{item.product.sku}</span>
                            <span className={`px-1.5 py-0.5 rounded font-bold ${item.product.condition === 'New' ? 'badge-new' : item.product.condition === 'Used JDM' ? 'badge-used-jdm' : 'badge-reconditioned'}`}>{item.product.condition}</span>
                          </div>
                          <p className="text-[11px] text-zinc-600">
                            Warranty: <span className="text-zinc-600">{item.product.warranty}</span>
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-300 rounded-lg">
                              <button onClick={() => updateCartQty(item.id, item.qty - 1)} className="w-7 h-7 flex items-center justify-center hover:text-red-700 transition-colors">
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-zinc-950">{item.qty}</span>
                              <button onClick={() => updateCartQty(item.id, item.qty + 1)} className="w-7 h-7 flex items-center justify-center hover:text-green-700 transition-colors">
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-zinc-950 text-base">{formatGBP(lineTotal)}</p>
                              <p className="text-[10px] text-zinc-600">{vatInclusive ? 'inc. VAT' : 'ex. VAT'}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-red-700">
                            10% deposit on this item: <strong>{formatGBP(lineDeposit)}</strong>
                          </p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-zinc-600 hover:text-red-700 transition-colors self-start mt-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between gap-3">
                <Link href="/shop" className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-950 font-bold transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Continue Shopping
                </Link>
                <button onClick={() => setStep('details')} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                  Continue to Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: Details ──────────────────────────────────────────── */}
          {step === 'details' && (
            <div className="space-y-5">
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
                <h2 className="font-bold text-zinc-950 text-base font-heading flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-700" /> Delivery Address
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First Name *" value={form.firstName} onChange={update('firstName')} error={errors.firstName} />
                  <Field label="Last Name *" value={form.lastName} onChange={update('lastName')} error={errors.lastName} />
                </div>
                <Field label="Email Address *" value={form.email} onChange={update('email')} error={errors.email} type="email" />
                <Field label="Phone Number" value={form.phone} onChange={update('phone')} placeholder="+44 (0)7700 123456" />
                <Field label="Address Line 1 *" value={form.address1} onChange={update('address1')} error={errors.address1} placeholder="House number and street" />
                <Field label="Address Line 2" value={form.address2} onChange={update('address2')} placeholder="Flat, apartment, unit (optional)" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Town / City *" value={form.city} onChange={update('city')} error={errors.city} />
                  <Field label="County" value={form.county} onChange={update('county')} placeholder="e.g. West Yorkshire" />
                </div>
                <Field label="Postcode *" value={form.postcode} onChange={update('postcode')} error={errors.postcode} mono uppercase />
                <div>
                  <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">Order Notes (optional)</label>
                  <textarea value={form.notes} onChange={update('notes')} rows={3} placeholder="Any specific instructions, vehicle details or questions…" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors resize-none" />
                </div>
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={() => setStep('basket')} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-950 font-bold transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Basket
                </button>
                <button
                  onClick={() => { if (validate()) setStep('payment'); }}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  Continue to Payment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP: Payment ─────────────────────────────────────────── */}
          {step === 'payment' && (
            <div className="space-y-5">
              {/* Deposit callout */}
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-red-700" />
                  <h3 className="font-bold text-red-700 text-sm">Deposit Payment</h3>
                </div>
                <p className="text-zinc-700 text-sm leading-relaxed">
                  Sample deposit: <strong className="text-zinc-950">{formatGBP(deposit)}</strong>.
                  Example remaining balance: <strong className="text-zinc-950">{formatGBP(balance)}</strong>. No order is placed by this preview.
                </p>
                <div className="bg-zinc-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-600">Sample total before delivery</span>
                    <span className="font-bold text-zinc-950">{formatGBP(orderTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-700 font-bold">Sample deposit (10%)</span>
                    <span className="font-black text-green-700">{formatGBP(deposit)}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-zinc-200 pt-2">
                    <span className="text-amber-700 font-bold">Balance Due Before Dispatch</span>
                    <span className="font-black text-amber-700">{formatGBP(balance)}</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
                <h2 className="font-bold text-zinc-950 text-base font-heading flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-red-700" /> Payment Method
                </h2>
                <div className="space-y-3">
                  <div className="border border-red-600/40 bg-red-50 rounded-xl p-4 text-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-zinc-800">Proposed card / wallet payment</span>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded font-bold text-zinc-600">VISA</span>
                        <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded font-bold text-zinc-600">MC</span>
                        <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded font-bold text-zinc-600">AMEX</span>
                      </div>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-300 rounded-xl p-4 text-center text-zinc-600 text-xs">
                      <Lock className="w-4 h-4 mx-auto mb-2 text-green-700" />
                      Payment provider connection is not configured.
                      <br />
                      <span className="text-amber-700">Demo only — no payment details are collected.</span>
                    </div>
                  </div>
                  <button className="w-full border border-zinc-300 hover:border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-700 rounded-xl p-4 text-sm font-bold text-left transition-colors flex items-center justify-between">
                    <span>PayPal (proposed)</span>
                    <span className="text-[10px] text-zinc-600">Not connected</span>
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={depositTermsAgreed}
                    onChange={e => setDepositTermsAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-400 bg-zinc-100 accent-red-600 w-4 h-4"
                  />
                  <span className="text-sm text-zinc-700 leading-relaxed">
                    I have read and agree to the{' '}
                    <Link href="/deposit-policy" className="text-red-700 hover:text-red-700 font-bold">Deposit & Balance Terms</Link>,{' '}
                    <Link href="/terms" className="text-red-700 hover:text-red-700 font-bold">Terms & Conditions</Link> and{' '}
                    <Link href="/privacy" className="text-red-700 hover:text-red-700 font-bold">Privacy Policy</Link>.
                    I understand the deposit and balance shown are examples only; this preview does not accept orders or payments.
                  </span>
                </label>
              </div>

              <div className="flex justify-between gap-3">
                <button onClick={() => setStep('details')} className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-950 font-bold transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled
                  onClick={() => setStep('confirmation')}
                  className="flex items-center gap-2 bg-zinc-200 text-zinc-700 px-8 py-3.5 rounded-xl font-black text-sm cursor-not-allowed"
                >
                  <Lock className="w-4 h-4" />
                  Payment not connected
                </button>
              </div>

                <div className="flex items-center justify-center gap-2 text-xs text-amber-700">
                <Info className="w-3 h-3" />
                Demo checkout — no payment will be taken
              </div>
            </div>
          )}
        </div>

        {/* Right column – Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-zinc-950 text-sm font-heading">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3">
                {cart.slice(0, 3).map(item => {
                  const price = vatInclusive ? item.product.priceIncVat : item.product.priceExVat;
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-800 text-xs font-bold truncate">{item.product.shortTitle}</p>
                        <p className="text-zinc-600 text-[10px]">Qty: {item.qty}</p>
                      </div>
                      <span className="font-bold text-zinc-950 text-xs whitespace-nowrap">{formatGBP((price * item.qty))}</span>
                    </div>
                  );
                })}
                {cart.length > 3 && (
                  <p className="text-zinc-600 text-xs">+{cart.length - 3} more items</p>
                )}
              </div>

              <hr className="border-zinc-200" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Sample subtotal</span>
                  <span className="text-zinc-800">{formatGBP(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600">Delivery</span>
                  <span className="text-amber-700">To be confirmed</span>
                </div>
                <p className="text-[10px] text-zinc-600">Delivery is not included in this sample total.</p>
                <hr className="border-zinc-200" />
                <div className="flex justify-between text-base font-black">
                  <span className="text-zinc-800">Sample total before delivery</span>
                  <span className="text-zinc-950">{formatGBP(orderTotal)}</span>
                </div>
                <p className="text-[10px] text-amber-700 text-right">Example price; VAT treatment to be confirmed</p>
              </div>

              <hr className="border-zinc-200" />

              {/* Deposit breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Deposit Payment</p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-700">Pay now (10%)</span>
                    <span className="font-black text-green-700">{formatGBP(deposit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-700">Balance due</span>
                    <span className="font-black text-amber-700">{formatGBP(balance)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  Balance due date and collection or dispatch process are TODO — confirm with the business.
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3">
              {[
                { icon: ShieldCheck, text: 'Payment provider not connected' },
                { icon: Truck,       text: 'Delivery details to be confirmed' },
                { icon: Lock,        text: 'No payment details are collected' },
                { icon: Clock,       text: 'Order emails not configured' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs text-zinc-600">
                  <Icon className="w-4 h-4 text-green-700 shrink-0" />
                  {text}
                </div>
              ))}
            </div>

            {/* Deposit policy link */}
            <Link href="/deposit-policy" className="flex items-center gap-2 text-xs text-zinc-600 hover:text-red-700 transition-colors">
              <AlertCircle className="w-3.5 h-3.5" /> Read our Deposit & Balance Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Field helper ──────────────────────────────────────────────────────────────

function Field({ label, value, onChange, error, placeholder, type = 'text', mono, uppercase }: {
  label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string; placeholder?: string; type?: string; mono?: boolean; uppercase?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border ${error ? 'border-red-600' : 'border-zinc-300'} rounded-xl px-4 py-2.5 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors ${mono ? 'font-mono' : ''} ${uppercase ? 'uppercase' : ''}`}
      />
      {error && <p className="text-red-700 text-[11px] mt-1">{error}</p>}
    </div>
  );
}
