"use client";

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LockKeyhole, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, code }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Sign-in failed.');
      const requested = searchParams.get('next');
      const next = requested?.startsWith('/admin') && requested !== '/admin/login' ? requested : '/admin';
      window.location.assign(next);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Sign-in failed.');
    } finally { setBusy(false); }
  };

  const fieldClass = 'w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600';
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-zinc-950 text-zinc-100">
      <form onSubmit={submit} className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-7 sm:p-9 space-y-5 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-800/50 flex items-center justify-center"><LockKeyhole className="w-5 h-5 text-red-400" /></div>
        <div><h1 className="text-2xl font-black text-white">Owner sign-in</h1><p className="text-sm text-zinc-400 mt-1">Use your admin email, password and authenticator code.</p></div>
        <label className="block space-y-1.5"><span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email</span><input required type="email" autoComplete="username" className={fieldClass} value={email} onChange={event => setEmail(event.target.value)} /></label>
        <label className="block space-y-1.5"><span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</span><input required type="password" autoComplete="current-password" className={fieldClass} value={password} onChange={event => setPassword(event.target.value)} /></label>
        <label className="block space-y-1.5"><span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Authenticator code</span><input required inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" className={`${fieldClass} font-mono tracking-[0.4em]`} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} /></label>
        {error && <p role="alert" className="text-sm text-amber-300">{error}</p>}
        <button disabled={busy} className="w-full bg-red-600 hover:bg-red-500 disabled:bg-zinc-700 text-white font-black py-3 rounded-xl text-sm">{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="text-xs text-zinc-500 flex items-start gap-2"><ShieldCheck className="w-4 h-4 shrink-0" /> Owner access requires the server credentials and TOTP secret in the environment settings.</p>
      </form>
    </main>
  );
}
