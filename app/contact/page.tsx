"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronRight, ArrowRight,
  MessageSquare, Wrench, Send,
} from 'lucide-react';

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const submitEnquiry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setFormMessage('');
    const form = event.currentTarget;
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Message could not be sent.');
      form.reset();
      setFormMessage('Thanks — your message has been sent.');
    } catch (error) {
      setFormMessage(error instanceof Error ? error.message : 'Message could not be sent.');
    } finally { setSending(false); }
  };

  return (
    <div className="space-y-0">
      {/* Hero */}
      <section className="bg-zinc-50 py-12 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
            <Link href="/" className="hover:text-zinc-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-zinc-700">Contact Us</span>
          </nav>
          <h1 className="text-4xl font-black text-zinc-950 font-heading">Contact Us</h1>
          <p className="text-zinc-600 mt-2 max-w-xl">Ask about engines, parts, workshop services or trade enquiries. Add your confirmed business contact details before launch.</p>
        </div>
      </section>

      <section className="py-16 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-5">
              <h2 className="text-xl font-black text-zinc-950 font-heading">Get in Touch</h2>

              {[
                { icon: Phone, label: 'Phone', value: 'TODO — confirm business phone', href: '', note: 'Contact detail pending' },
                { icon: Mail, label: 'Email', value: 'TODO — confirm business email', href: '', note: 'Contact detail pending' },
                { icon: MapPin, label: 'Workshop', value: 'TODO — confirm address', href: '', note: 'Location pending' },
              ].map(({ icon: Icon, label, value, href, note }) => (
                <div key={label} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-red-700" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">{label}</p>
                    <p className="text-sm font-bold text-zinc-950">{value}</p>
                    <p className="text-[10px] text-zinc-600">{note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Opening Hours */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-red-700" />
                <h3 className="font-black text-zinc-950 text-sm font-heading">Opening Hours</h3>
              </div>
              {/* TODO: Replace with real hours */}
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hours: 'TODO — confirm' },
                  { day: 'Saturday', hours: 'TODO — confirm' },
                  { day: 'Sunday', hours: 'TODO — confirm' },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-zinc-600">{day}</span>
                    <span className="font-bold text-zinc-950">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-3">
              <h3 className="font-black text-zinc-950 text-sm font-heading mb-3">Quick Links</h3>
              {[
                { href: '/workshop', label: 'Workshop Services', icon: Wrench },
                { href: '/faq', label: 'FAQ', icon: MessageSquare },
                { href: '/delivery', label: 'Delivery & Returns', icon: ArrowRight },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 text-sm text-zinc-700 hover:text-red-700 transition-colors">
                  <Icon className="w-4 h-4 text-zinc-600" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <form onSubmit={submitEnquiry} className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-zinc-950 font-heading">Send Us a Message</h2>
                <p className="text-zinc-600 text-sm mt-1">Whether it is a parts enquiry, workshop booking or general question — we are happy to help.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">First Name *</label>
                  <input name="firstName" required type="text" placeholder="John" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Last Name *</label>
                  <input name="lastName" required type="text" placeholder="Smith" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Email *</label>
                  <input name="email" required type="email" placeholder="you@example.co.uk" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Phone</label>
                  <input name="phone" type="tel" placeholder="07xxx xxx xxx" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Subject *</label>
                <select name="subject" required className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 focus:outline-none focus:border-red-600 transition-colors">
                  <option value="">Select a subject</option>
                  <option value="parts">Parts Enquiry</option>
                  <option value="engine">Engine Enquiry</option>
                  <option value="workshop">Workshop Booking</option>
                  <option value="order">Existing Order</option>
                  <option value="trade">Trade Account</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Vehicle / Engine (optional)</label>
                <input name="vehicle" type="text" placeholder="e.g. Supra A80 / 2JZ-GTE" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 uppercase tracking-wider mb-1.5">Message *</label>
                <textarea name="message" required rows={5} placeholder="Tell us what you need…" className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-2.5 px-3 text-sm text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-red-600 transition-colors resize-none" />
              </div>

              {formMessage && <p role="status" className={`text-sm ${formMessage.startsWith('Thanks') ? 'text-green-700' : 'text-amber-700'}`}>{formMessage}</p>}
              <button disabled={sending} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-200 disabled:text-zinc-600 text-white font-black py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200/50">
                <Send className="w-4 h-4" /> {sending ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section id="map" className="border-t border-zinc-200">
        <div className="bg-white h-80 flex items-center justify-center">
          <div className="text-center space-y-3">
            <MapPin className="w-10 h-10 text-zinc-700 mx-auto" />
            <p className="text-zinc-600 text-sm font-bold">TODO: Embed Google Maps once address is confirmed</p>
            <p className="text-zinc-600 text-xs">Google Business Profile integration pending</p>
          </div>
        </div>
      </section>
    </div>
  );
}
