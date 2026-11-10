"use client";

import React, { useEffect, useState } from 'react';
import { useApp } from '@/lib/jdm-context';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [toast]);

  if (!toast && !visible) return null;

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-green-400" />,
    error:   <XCircle    className="w-4 h-4 text-red-400"   />,
    info:    <Info       className="w-4 h-4 text-blue-400"  />,
  };

  const colours = {
    success: 'border-green-800/50 bg-green-950/90',
    error:   'border-red-800/50   bg-red-950/90',
    info:    'border-blue-800/50  bg-blue-950/90',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-24 lg:bottom-6 right-4 z-[200] max-w-sm transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl ${colours[toast?.type ?? 'info']}`}>
        {icons[toast?.type ?? 'info']}
        <p className="text-sm text-zinc-100 font-medium flex-1 leading-snug">{toast?.message}</p>
        <button onClick={() => setVisible(false)} className="text-zinc-500 hover:text-zinc-300 ml-1 mt-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
