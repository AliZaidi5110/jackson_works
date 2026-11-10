"use client";

import React from 'react';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import {
  User, Package, Heart, Clock, Settings, LogOut, ChevronRight,
  ShieldCheck, CreditCard,
} from 'lucide-react';

const SAMPLE_ORDERS = [
  { ref: 'JDM-2401', date: '30 Oct 2026', total: 3200, deposit: 320, balance: 2880, status: 'Deposit Paid', items: '2JZ-GTE Complete Engine (Used JDM)' },
  { ref: 'JDM-2397', date: '26 Oct 2026', total: 249, deposit: 249, balance: 0, status: 'Completed', items: 'Aeromotive Fuel Pressure Regulator' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Deposit Paid': 'bg-amber-50 text-amber-700 border-amber-200',
    'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
    'Balance Paid': 'bg-green-50 text-green-700 border-green-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-zinc-100 text-zinc-600 border-zinc-300',
  };
  return <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${map[status] ?? 'bg-zinc-100 text-zinc-600 border-zinc-300'}`}>{status}</span>;
}

export default function AccountPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
        <Link href="/" className="hover:text-zinc-700">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-700">My Account</span>
      </nav>

      <h1 className="text-3xl font-black text-zinc-950 font-heading mb-8">My Account</h1>

      {/* Login prompt – shown when not logged in */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6 mb-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-300 mx-auto flex items-center justify-center">
            <User className="w-8 h-8 text-zinc-600" />
          </div>
          <h2 className="text-xl font-black text-zinc-950 font-heading">Sign In or Create an Account</h2>
          <p className="text-zinc-600 text-sm">Track your orders, view deposit balances and manage your wishlist.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" placeholder="you@example.co.uk" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Password</label>
            <input type="password" placeholder="••••••••" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* TODO: Wire up to auth system */}
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors">Sign In</button>
          <button className="border border-zinc-300 hover:border-zinc-500 text-zinc-700 font-bold px-8 py-3 rounded-xl text-sm transition-colors">Create Account</button>
        </div>
        <p className="text-center text-zinc-600 text-xs">TODO: Auth.js integration with credentials login and 2FA for admin</p>
      </div>

      {/* Account Dashboard Preview */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Package, label: 'My Orders', value: `${SAMPLE_ORDERS.length} orders`, href: '#orders' },
            { icon: Heart, label: 'Wishlist', value: 'View saved items', href: '/wishlist' },
            { icon: CreditCard, label: 'Balance Due', value: '£2,880.00', href: '#orders' },
          ].map(({ icon: Icon, label, value, href }) => (
            <Link key={label} href={href} className="bg-white border border-zinc-200 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-400 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                <Icon className="w-5 h-5 text-red-700" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-600 uppercase">{label}</p>
                <p className="text-sm font-bold text-zinc-950">{value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Orders */}
        <section id="orders" className="bg-white border border-zinc-200 rounded-2xl p-6">
          <h3 className="font-black text-zinc-950 text-lg font-heading mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {SAMPLE_ORDERS.map(order => (
              <div key={order.ref} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-red-700 font-mono">{order.ref}</span>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-zinc-600">{order.items}</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">{order.date}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-bold text-zinc-950">{formatGBP(order.total)}</p>
                  {order.balance > 0 && (
                    <div>
                      <p className="text-[10px] text-zinc-600">Balance due: <span className="text-amber-700 font-bold">{formatGBP(order.balance)}</span></p>
                      <button className="text-[10px] bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-lg mt-1 transition-colors">Pay Balance</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
