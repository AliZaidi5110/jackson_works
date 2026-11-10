"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { formatGBP } from '@/lib/format';
import Link from 'next/link';
import {
  LayoutDashboard, Package, ShoppingCart, MessageSquare, Settings,
  BarChart3, Users, AlertTriangle, TrendingUp, TrendingDown,
  Plus, Search, Filter, Edit2, Trash2, Eye, Copy, Download,
  Upload, ChevronDown, ChevronRight, Check, X, Star, Wrench,
  Truck, ShieldCheck, FileText, Bell, LogOut, Menu, Layers,
  Cpu, Archive, Tag, Globe, Image as ImageIcon, DollarSign, Activity,
  Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Gauge, Zap,
} from 'lucide-react';
import { SAMPLE_PRODUCTS, ENGINE_PACKAGES, calculateDeposit, type JdmProduct, type Condition } from '@/lib/jdm-catalog';
import { useApp } from '@/lib/jdm-context';

// ── Types ──────────────────────────────────────────────────────────────────────

type AdminTab = 'dashboard' | 'products' | 'orders' | 'enquiries' | 'content' | 'settings';

interface StatCard {
  label: string;
  value: string;
  sub?: string;
  trend?: number;
  icon: React.ElementType;
  colour: string;
}

interface OrderRow {
  id: string;
  customer: string;
  date: string;
  total: number;
  deposit: number;
  balance: number;
  status: 'Deposit Paid' | 'Processing' | 'Ready' | 'Balance Paid' | 'Completed' | 'Cancelled' | 'Refunded';
  items: string;
}

interface EnquiryRow {
  id: string;
  name: string;
  engine: string;
  type: 'Part Enquiry' | 'Workshop Quote' | 'Contact';
  date: string;
  status: 'New' | 'Replied' | 'Won';
  email: string;
}

// ── Sample data ────────────────────────────────────────────────────────────────

const SAMPLE_ORDERS: OrderRow[] = [
  { id: 'JDM-2401', customer: 'James Mitchell', date: '30 Oct 2026', total: 3200, deposit: 320, balance: 2880, status: 'Deposit Paid', items: '2JZ-GTE Complete Engine (Used JDM)' },
  { id: 'JDM-2400', customer: 'Sarah Chen',    date: '29 Oct 2026', total: 1850, deposit: 185, balance: 1665, status: 'Processing',   items: 'RB26DETT Engine Package – Full Swap' },
  { id: 'JDM-2399', customer: 'Daniel Ford',   date: '28 Oct 2026', total:  580, deposit:  58, balance:  522, status: 'Ready',        items: 'HKS Adjustable Cam Gears 2JZ x2' },
  { id: 'JDM-2398', customer: 'Lewis Patel',   date: '27 Oct 2026', total: 4750, deposit: 475, balance: 4275, status: 'Balance Paid', items: 'RB26DETT Rebuilt Engine + R154 Kit' },
  { id: 'JDM-2397', customer: 'Emma Williams', date: '26 Oct 2026', total:  249, deposit: 249, balance:    0, status: 'Completed',    items: 'Aeromotive Fuel Pressure Regulator' },
  { id: 'JDM-2396', customer: 'Tom Brooks',    date: '25 Oct 2026', total:  890, deposit:  89, balance:  801, status: 'Cancelled',    items: 'SR20DET Engine + Gearbox' },
  { id: 'JDM-2395', customer: 'Amy Grant',     date: '24 Oct 2026', total: 1200, deposit: 120, balance: 1080, status: 'Completed',    items: 'Greddy T78 Turbocharger' },
];

const SAMPLE_ENQUIRIES: EnquiryRow[] = [
  { id: 'ENQ-0891', name: 'Marcus Reed',   engine: '2JZ-GTE full swap Supra',      type: 'Workshop Quote',  date: '30 Oct 2026', status: 'New',     email: 'marcus@example.co.uk' },
  { id: 'ENQ-0890', name: 'Claire Adams',  engine: 'RB26DETT parts – pistons',      type: 'Part Enquiry',   date: '29 Oct 2026', status: 'Replied', email: 'claire@example.co.uk' },
  { id: 'ENQ-0889', name: 'Ravi Sharma',   engine: 'SR20DET engine + box R32',      type: 'Part Enquiry',   date: '28 Oct 2026', status: 'Won',     email: 'ravi@example.co.uk' },
  { id: 'ENQ-0888', name: 'Joe Thompson',  engine: 'General question about deposit', type: 'Contact',        date: '28 Oct 2026', status: 'Replied', email: 'joe@example.co.uk' },
  { id: 'ENQ-0887', name: 'Helen Price',   engine: '4G63 rebuild kit Evo 9',        type: 'Workshop Quote',  date: '27 Oct 2026', status: 'New',     email: 'helen@example.co.uk' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Deposit Paid': 'bg-amber-950 text-amber-400 border-amber-700',
    'Processing':   'bg-blue-950 text-blue-400 border-blue-700',
    'Ready':        'bg-purple-950 text-purple-400 border-purple-700',
    'Balance Paid': 'bg-green-950 text-green-400 border-green-700',
    'Completed':    'bg-emerald-950 text-emerald-400 border-emerald-700',
    'Cancelled':    'bg-zinc-800 text-zinc-400 border-zinc-700',
    'Refunded':     'bg-red-950 text-red-400 border-red-700',
    'New':          'bg-red-950 text-red-400 border-red-700',
    'Replied':      'bg-blue-950 text-blue-400 border-blue-700',
    'Won':          'bg-green-950 text-green-400 border-green-700',
    'In Stock':     'bg-green-950 text-green-400 border-green-700',
    'Out of Stock': 'bg-zinc-800 text-zinc-500 border-zinc-700',
    'Pre-order':    'bg-amber-950 text-amber-400 border-amber-700',
    'Enquire Only': 'bg-purple-950 text-purple-400 border-purple-700',
    'Published':    'bg-green-950 text-green-400 border-green-700',
    'Draft':        'bg-zinc-800 text-zinc-400 border-zinc-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${map[status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
      {status}
    </span>
  );
}

function SidebarLink({ icon: Icon, label, tab, active, onClick }: {
  icon: React.ElementType; label: string; tab: AdminTab; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`admin-sidebar-link w-full text-left ${active ? 'active' : ''}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function Dashboard() {
  const stats: StatCard[] = [
    { label: 'Revenue (Oct)',       value: '£28,420', sub: 'inc. VAT',          trend: 12.4,  icon: TrendingUp,   colour: 'text-green-400' },
    { label: 'Orders This Month',   value: '34',      sub: '6 awaiting balance', trend: 8.1,  icon: ShoppingCart, colour: 'text-blue-400' },
    { label: 'Deposits Received',   value: '£4,210',  sub: '14 open orders',    trend: 15.2,  icon: DollarSign,   colour: 'text-amber-400' },
    { label: 'Balance Outstanding', value: '£19,890', sub: '10 orders',          trend: -4.3, icon: AlertCircle,  colour: 'text-red-400' },
    { label: 'Low Stock Items',     value: '7',       sub: 'needs attention',   trend: 0,     icon: AlertTriangle,colour: 'text-orange-400' },
    { label: 'New Enquiries',       value: '12',      sub: '3 workshop quotes',  trend: 22.0, icon: MessageSquare,colour: 'text-purple-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white font-heading">Dashboard</h2>
          <p className="text-zinc-500 text-sm mt-0.5">Overview for October 2026 — <span className="text-zinc-400">TODO: connect to live database</span></p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-bold">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.colour}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-white font-heading">{stat.value}</p>
              {stat.sub && <p className="text-[11px] text-zinc-600 mt-0.5">{stat.sub}</p>}
            </div>
            {stat.trend !== 0 && (
              <div className={`flex items-center gap-1 text-[11px] font-bold ${stat.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.trend)}% vs last month
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h3 className="font-bold text-white text-sm font-heading">Recent Orders</h3>
          <Link href="#" className="text-xs text-red-400 hover:text-red-300 font-bold">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Balance Due</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {SAMPLE_ORDERS.map(order => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-red-400">{order.id}</td>
                  <td className="px-5 py-3 font-semibold text-zinc-200">{order.customer}</td>
                  <td className="px-5 py-3 text-zinc-400 max-w-xs truncate">{order.items}</td>
                  <td className="px-5 py-3 text-right font-black text-white">£{order.total.toLocaleString()}</td>
                  <td className={`px-5 py-3 text-right font-bold ${order.balance > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                    {order.balance > 0 ? formatGBP(order.balance) : 'Paid'}
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-3 text-zinc-500">{order.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors" title="View order"><Eye className="w-3 h-3" /></button>
                      {order.balance > 0 && (
                        <button className="p-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-400 transition-colors text-[10px] font-bold px-2.5">
                          Send Payment Link
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low stock alert */}
      <div className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-amber-300 text-sm font-heading">Low Stock Alerts</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SAMPLE_PRODUCTS.filter(p => p.stockCount <= 2 && p.stockCount > 0).slice(0, 6).map(p => (
            <div key={p.id} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3">
              <div>
                <p className="text-zinc-200 text-xs font-bold truncate max-w-[160px]">{p.shortTitle}</p>
                <p className="text-zinc-600 text-[10px] font-mono">{p.sku}</p>
              </div>
              <span className="text-amber-400 font-black text-sm">{p.stockCount} left</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Products ───────────────────────────────────────────────────────────────────

function ProductsTab() {
  const { products, saveProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editing, setEditing] = useState<JdmProduct | null>(null);
  const [conditionFilter, setConditionFilter] = useState('all');
  const [publishFilter, setPublishFilter] = useState('all');
  const importRef = useRef<HTMLInputElement>(null);
  const allProducts = products;

  const filtered = allProducts.filter(p =>
    (!search || p.title.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase())) &&
    (conditionFilter === 'all' || p.condition === conditionFilter) &&
    (publishFilter === 'all' || (publishFilter === 'published' ? p.isPublished !== false : p.isPublished === false))
  );

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <h2 className="text-2xl font-black text-white font-heading">Products</h2>
          <p className="text-zinc-500 text-sm">{allProducts.length} products in catalogue</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <input ref={importRef} type="file" accept=".csv,text/csv" className="hidden" onChange={async event => {
            const file = event.target.files?.[0];
            if (!file) return;
            const rows = parseProductCsv(await file.text());
            rows.forEach(saveProduct);
            event.target.value = '';
          }} />
          <button onClick={() => importRef.current?.click()} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
          <button onClick={() => downloadProductsCsv(allProducts)} className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, SKU, part number…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <div className="flex items-center gap-2 bg-red-950/40 border border-red-800/40 px-4 py-2 rounded-xl text-xs font-bold text-red-300">
              {selected.length} selected
              <button onClick={() => { products.filter(p => selected.includes(p.id)).forEach(p => saveProduct({ ...p, isPublished: true })); setSelected([]); }} className="hover:text-white">Publish</button>
              <button onClick={() => { selected.forEach(deleteProduct); setSelected([]); }} className="hover:text-white">Delete</button>
            </div>
          )}
          <select value={conditionFilter} onChange={event => setConditionFilter(event.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-red-600">
            <option value="all">All Conditions</option>
            <option>New</option>
            <option>Used JDM</option>
            <option>Reconditioned</option>
            <option>Rebuilt</option>
            <option>Aftermarket</option>
          </select>
          <select value={publishFilter} onChange={event => setPublishFilter(event.target.value)} className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-300 focus:outline-none focus:border-red-600">
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" aria-label="Select all filtered products" checked={filtered.length > 0 && filtered.every(p => selected.includes(p.id))} onChange={event => setSelected(event.target.checked ? filtered.map(p => p.id) : [])} className="rounded border-zinc-600 bg-zinc-800 accent-red-600" />
                </th>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price (inc. VAT)</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-left">Condition</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.slice(0, 20).map(p => (
                <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="rounded border-zinc-600 bg-zinc-800 accent-red-600"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden shrink-0">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-200 max-w-[200px] truncate">{p.title}</p>
                        <p className="text-zinc-600 text-[10px]">{p.make} · {p.engines?.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-amber-400">{p.sku}</td>
                  <td className="px-4 py-3 text-zinc-400">{p.categoryId}</td>
                  <td className="px-4 py-3 text-right font-black text-white">{formatGBP(p.priceIncVat ?? (p as any).price ?? 0)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${p.stockCount > 5 ? 'text-green-400' : p.stockCount > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                      {p.stockCount}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={p.condition} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.isPublished === false ? 'Draft' : 'Published'} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setEditing(p); setShowAddModal(true); }} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors" title="Edit"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => saveProduct({ ...p, id: Date.now(), sku: `${p.sku}-COPY`, partNumber: `${p.partNumber}-COPY`, title: `${p.title} (copy)`, shortTitle: `${p.shortTitle} (copy)`, isPublished: false })} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors" title="Duplicate"><Copy className="w-3 h-3" /></button>
                      <button onClick={() => { if (window.confirm(`Delete ${p.title}?`)) deleteProduct(p.id); }} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-900 text-zinc-400 hover:text-red-400 transition-colors" title="Delete"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && <ProductEditorModal product={editing} onClose={() => { setShowAddModal(false); setEditing(null); }} onSave={saveProduct} />}
    </div>
  );
}

const PRODUCT_CSV_COLUMNS = ['sku', 'title', 'shortTitle', 'partNumber', 'brand', 'make', 'engines', 'chassis', 'categoryId', 'condition', 'priceIncVat', 'priceExVat', 'stockCount', 'stockStatus', 'warranty', 'image', 'description'];

function escapeCsv(value: unknown) {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadProductsCsv(products: JdmProduct[]) {
  const lines = [PRODUCT_CSV_COLUMNS.join(','), ...products.map(product => PRODUCT_CSV_COLUMNS.map(key => {
    const value = (product as any)[key];
    return escapeCsv(Array.isArray(value) ? value.join('|') : value);
  }).join(','))];
  const url = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'jdm-products.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"' && quoted && csv[i + 1] === '"') { field += '"'; i++; }
    else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(field); field = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && csv[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function parseProductCsv(csv: string): JdmProduct[] {
  const [header = [], ...rows] = parseCsvRows(csv);
  const keys = header.map(key => key.trim());
  return rows.flatMap((cells, index) => {
    const raw = Object.fromEntries(keys.map((key, i) => [key, (cells[i] ?? '').trim()]));
    if (!raw.title || !raw.sku) return [];
    const condition = (['New', 'Used JDM', 'Reconditioned', 'Rebuilt', 'Aftermarket'].includes(raw.condition) ? raw.condition : 'New') as Condition;
    const priceIncVat = Number(raw.priceIncVat || raw.price || 0);
    const priceExVat = Number(raw.priceExVat || 0);
    const stockCount = Math.max(0, Number(raw.stockCount || 0));
    const stockStatus = (['In Stock', 'Out of Stock', 'Pre-order', 'Enquire Only'].includes(raw.stockStatus) ? raw.stockStatus : stockCount > 0 ? 'In Stock' : 'Out of Stock') as JdmProduct['stockStatus'];
    return [{
      id: Date.now() + index, sku: raw.sku, partNumber: raw.partNumber || raw.sku,
      title: raw.title, shortTitle: raw.shortTitle || raw.title.slice(0, 54), brand: raw.brand || 'TODO: Confirm brand',
      make: (raw.make || 'Toyota').toLowerCase(), engines: (raw.engines || '').split('|').map(x => x.trim()).filter(Boolean),
      chassis: (raw.chassis || '').split('|').map(x => x.trim()).filter(Boolean),
      categoryId: raw.categoryId || 'complete-engines', subcategoryId: raw.categoryId || 'complete-engines', condition,
      priceIncVat, priceExVat, wasPrice: null, inStock: stockCount > 0, stockCount, stockStatus,
      warranty: raw.warranty || 'TODO: Confirm warranty', depositPct: 10, rating: 0, reviewCount: 0,
      image: raw.image || '/images/apex_hero_banner.jpg', images: [], isFeatured: false, isPopular: false,
      isNewArrival: false, isBestSeller: false, isPublished: false, specifications: {},
      searchTerms: `${raw.title} ${raw.sku} ${raw.engines || ''}`.toLowerCase(), description: raw.description || '',
      seoTitle: '', seoDescription: '',
    }];
  });
}

function ProductEditorModal({ product, onClose, onSave }: { product: JdmProduct | null; onClose: () => void; onSave: (product: JdmProduct) => void }) {
  const [title, setTitle] = useState(product?.title ?? '');
  const [sku, setSku] = useState(product?.sku ?? '');
  const [partNumber, setPartNumber] = useState(product?.partNumber ?? '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [make, setMake] = useState(product?.make ?? 'toyota');
  const [engines, setEngines] = useState(product?.engines.join(', ') ?? '');
  const [chassis, setChassis] = useState(product?.chassis.join(', ') ?? '');
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? 'complete-engines');
  const [condition, setCondition] = useState<Condition>(product?.condition ?? 'New');
  const [priceIncVat, setPriceIncVat] = useState(product?.priceIncVat ?? 0);
  const [priceExVat, setPriceExVat] = useState(product?.priceExVat ?? 0);
  const [stockCount, setStockCount] = useState(product?.stockCount ?? 0);
  const [stockStatus, setStockStatus] = useState<JdmProduct['stockStatus']>(product?.stockStatus ?? 'Out of Stock');
  const [mileage, setMileage] = useState(product?.mileage ?? 0);
  const [warranty, setWarranty] = useState(product?.warranty ?? 'TODO: Confirm warranty');
  const [image, setImage] = useState(product?.image ?? '/images/apex_hero_banner.jpg');
  const [description, setDescription] = useState(product?.description ?? '');
  const [published, setPublished] = useState(product?.isPublished !== false);

  const save = (publish: boolean) => {
    if (!title.trim() || !sku.trim()) return;
    const engineList = engines.split(',').map(value => value.trim()).filter(Boolean);
    const record: JdmProduct = {
      ...(product ?? {} as JdmProduct), id: product?.id ?? Date.now(), title: title.trim(), shortTitle: title.trim().slice(0, 54),
      sku: sku.trim(), partNumber: partNumber.trim() || sku.trim(), brand: brand.trim() || 'TODO: Confirm brand', make,
      engines: engineList, chassis: chassis.split(',').map(value => value.trim()).filter(Boolean), categoryId, subcategoryId: categoryId,
      condition, priceIncVat: Number(priceIncVat) || 0, priceExVat: Number(priceExVat) || 0, wasPrice: product?.wasPrice ?? null,
      stockCount: Number(stockCount) || 0, inStock: Number(stockCount) > 0, stockStatus,
      mileage: Number(mileage) || undefined, warranty: warranty.trim() || 'TODO: Confirm warranty', depositPct: product?.depositPct ?? 10,
      rating: product?.rating ?? 0, reviewCount: product?.reviewCount ?? 0, image: image.trim(), images: product?.images ?? [],
      isFeatured: product?.isFeatured ?? false, isPopular: product?.isPopular ?? false, isNewArrival: product?.isNewArrival ?? false,
      isBestSeller: product?.isBestSeller ?? false, isPublished: publish, specifications: product?.specifications ?? {},
      searchTerms: `${title} ${sku} ${engineList.join(' ')}`.toLowerCase(), description,
      seoTitle: product?.seoTitle ?? '', seoDescription: product?.seoDescription ?? '',
    };
    onSave(record);
    onClose();
  };

  const inputClass = 'w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-600';
  const field = (label: string, value: string | number, onChange: (value: any) => void, type = 'text', placeholder = '') => (
    <label className="block space-y-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">{label}</span><input className={inputClass} type={type} value={value} placeholder={placeholder} onChange={event => onChange(type === 'number' ? Number(event.target.value) : event.target.value)} /></label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-sm">
      <form onSubmit={event => { event.preventDefault(); save(published); }} className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5">
        <div className="flex items-start justify-between"><div><h3 className="text-xl font-black text-white">{product ? 'Edit Product' : 'Add Product'}</h3><p className="text-zinc-500 text-xs mt-1">Changes appear in the storefront on this browser.</p></div><button type="button" onClick={onClose} className="text-zinc-400 hover:text-white" aria-label="Close">✕</button></div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field('Product title *', title, setTitle, 'text', 'Toyota 2JZ-GTE engine')}
          {field('SKU / part number *', sku, setSku, 'text', 'JDM-2JZ-001')}
          {field('Part number', partNumber, setPartNumber)}
          {field('Brand', brand, setBrand, 'text', 'TODO: confirm brand')}
          <label className="block space-y-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Make</span><select className={inputClass} value={make} onChange={event => setMake(event.target.value)}>{['Toyota', 'Nissan', 'Mitsubishi', 'Honda', 'Mazda', 'Subaru'].map(value => <option key={value} value={value.toLowerCase()}>{value}</option>)}</select></label>
          <label className="block space-y-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Condition</span><select className={inputClass} value={condition} onChange={event => setCondition(event.target.value as Condition)}>{['New', 'Used JDM', 'Reconditioned', 'Rebuilt', 'Aftermarket'].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="block space-y-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Category</span><select className={inputClass} value={categoryId} onChange={event => setCategoryId(event.target.value)}>{[['complete-engines','Complete Engines'],['engine-packages','Engine Packages'],['engine-internals','Engine Internals'],['cylinder-head','Cylinder Head & Valvetrain'],['turbo-induction','Turbo & Induction'],['fuel-system','Fuel System'],['ignition-ecu','Ignition & ECU'],['tcu-transmission','TCU / Transmission'],['gearbox-kits','Gearbox Kits'],['cooling-lubrication','Cooling & Lubrication'],['exhaust','Exhaust'],['drivetrain','Drivetrain'],['used-jdm-parts','Used JDM Parts'],['new-parts','New Parts'],['accessories','Accessories']].map(([value,label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          {field('Compatible engines (comma separated)', engines, setEngines, 'text', '2JZ-GTE, 2JZ-GE')}
          {field('Chassis fitment (comma separated)', chassis, setChassis, 'text', 'JZA80, JZX100')}
          {field('Price inc VAT (£)', priceIncVat, setPriceIncVat, 'number')}
          {field('Price ex VAT (£)', priceExVat, setPriceExVat, 'number')}
          {field('Stock quantity', stockCount, setStockCount, 'number')}
          {field('Mileage (km)', mileage, setMileage, 'number')}
          {field('Warranty', warranty, setWarranty, 'text', 'TODO: confirm')}
          {field('Main image URL', image, setImage, 'url')}
        </div>
        <label className="block space-y-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Stock status</span><select className={inputClass} value={stockStatus} onChange={event => setStockStatus(event.target.value as JdmProduct['stockStatus'])}>{['In Stock', 'Out of Stock', 'Pre-order', 'Enquire Only'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label className="block space-y-1.5"><span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Description</span><textarea className={`${inputClass} min-h-28`} value={description} onChange={event => setDescription(event.target.value)} /></label>
        <label className="flex items-center gap-2 text-sm text-zinc-300"><input type="checkbox" checked={published} onChange={event => setPublished(event.target.checked)} className="accent-red-600" /> Publish in shop</label>
        <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5"><button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-sm">Cancel</button><button type="submit" className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-bold">Save Product</button></div>
      </form>
    </div>
  );
}

// ── Add Product Modal ─────────────────────────────────────────────────────────

function AddProductModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'basic' | 'images' | 'pricing' | 'stock' | 'seo'>('basic');
  const tabs = ['basic', 'images', 'pricing', 'stock', 'seo'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <div>
            <h3 className="text-xl font-black text-white font-heading">Add New Product</h3>
            <p className="text-zinc-500 text-xs mt-0.5">Fill in the details below. You can save as draft at any time.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab nav */}
        <div className="flex border-b border-zinc-800 px-6 shrink-0">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-xs font-bold capitalize border-b-2 transition-colors ${tab === t ? 'border-red-600 text-red-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
              {t === 'seo' ? 'SEO' : t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'basic' && (
            <div className="space-y-5">
              <FormField label="Product Title *" placeholder="e.g. Toyota 2JZ-GTE Complete Engine – Used JDM Import" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="SKU / Part Number *" placeholder="e.g. JDM-2JZ-ENG-001" mono />
                <FormField label="Brand" placeholder="e.g. Toyota OEM / HKS" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Make *" options={['Toyota', 'Nissan', 'Mitsubishi', 'Honda', 'Mazda', 'Subaru']} />
                <FormSelect label="Condition *" options={['New', 'Used JDM', 'Reconditioned', 'Rebuilt', 'Aftermarket']} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect label="Category *" options={['Engine Packages', 'Complete Engines', 'Engine Internals', 'Turbo & Induction', 'Fuel System', 'Gearbox Kits', 'TCU / Transmission', 'Cooling & Lubrication', 'Drivetrain']} />
                <FormField label="Mileage (km) – used engines" placeholder="e.g. 65000" type="number" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Description *</label>
                <textarea rows={5} placeholder="Describe the product in detail. Include condition, specification and any known wear…" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors resize-none" />
                <p className="text-zinc-600 text-[11px] mt-1">Rich text editor available when connected to database.</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Compatible Engines (multi-select)</label>
                <div className="flex flex-wrap gap-2">
                  {['2JZ-GTE', '2JZ-GE', '1JZ-GTE', 'RB26DETT', 'RB25DET', 'SR20DET', '4G63', 'EJ20'].map(eng => (
                    <button key={eng} className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-red-950 border border-zinc-700 hover:border-red-700 text-zinc-400 hover:text-red-300 text-[10px] font-mono font-bold transition-colors">
                      {eng}
                    </button>
                  ))}
                </div>
              </div>
              <FormField label="Warranty" placeholder="e.g. 3 Months, 12 Months on rebuilt" />
            </div>
          )}

          {tab === 'images' && (
            <div className="space-y-5">
              <div className="border-2 border-dashed border-zinc-700 hover:border-red-600 rounded-2xl p-10 text-center cursor-pointer transition-colors">
                <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-300 font-bold text-sm">Drag & drop images here</p>
                <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WebP up to 10 MB each. Auto-compressed to WebP.</p>
                <button className="mt-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-2 rounded-xl text-xs font-bold transition-colors">
                  Browse Files
                </button>
              </div>
              <p className="text-zinc-500 text-xs">
                <strong className="text-zinc-400">Tip:</strong> Upload multiple angles for engines. First image becomes the main product image. Add alt text for accessibility and SEO.
              </p>
              <FormField label="Video URL (YouTube / Vimeo)" placeholder="https://www.youtube.com/watch?v=…" />
            </div>
          )}

          {tab === 'pricing' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Price (exc. VAT) *" placeholder="0.00" type="number" prefix="£" />
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Price (inc. VAT) – auto</label>
                  <div className="w-full bg-zinc-950/60 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-500">Calculated at 20% VAT</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Sale Price (exc. VAT)" placeholder="0.00 – leave blank if not on sale" type="number" prefix="£" />
                <FormField label="Deposit Override (%)" placeholder="10 – leave blank for global default" type="number" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Sale Start Date" type="date" />
                <FormField label="Sale End Date" type="date" />
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 space-y-1">
                <p>✓ VAT is calculated automatically at 20%</p>
                <p>✓ Deposit is 10% of total (inc. VAT) by default</p>
                <p>✓ Balance = 90% paid before dispatch or collection</p>
                <p className="text-amber-400">TODO: enable Klarna / Clearpay once client confirms finance provider</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Product Variants</label>
                <div className="space-y-2">
                  {['Engine Only', 'Engine + Gearbox', 'Engine + ECU + Loom', 'Full Swap Package'].map(variant => (
                    <div key={variant} className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                      <input type="checkbox" className="rounded border-zinc-600 bg-zinc-800 accent-red-600" />
                      <span className="text-zinc-300 text-xs flex-1">{variant}</span>
                      <input type="text" placeholder="£0.00" className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-300 text-right focus:outline-none focus:border-red-600" />
                    </div>
                  ))}
                  <button className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 font-bold transition-colors mt-1">
                    <Plus className="w-3.5 h-3.5" /> Add variant
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'stock' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Stock Quantity *" placeholder="0" type="number" />
                <FormSelect label="Stock Status *" options={['In Stock', 'Out of Stock', 'Pre-order', 'Enquire Only']} />
              </div>
              <FormField label="Low Stock Alert Threshold" placeholder="e.g. 2 – alert when stock falls below this" type="number" />
              <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                <input type="checkbox" id="published" className="rounded border-zinc-600 bg-zinc-800 accent-red-600" />
                <label htmlFor="published" className="text-zinc-300 text-sm font-bold cursor-pointer">Published (visible in shop)</label>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                  <input type="checkbox" id="featured" className="rounded border-zinc-600 bg-zinc-800 accent-red-600" />
                  <label htmlFor="featured" className="text-zinc-300 text-xs font-bold cursor-pointer">Featured</label>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                  <input type="checkbox" id="popular" className="rounded border-zinc-600 bg-zinc-800 accent-red-600" />
                  <label htmlFor="popular" className="text-zinc-300 text-xs font-bold cursor-pointer">Popular</label>
                </div>
                <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
                  <input type="checkbox" id="newArrival" className="rounded border-zinc-600 bg-zinc-800 accent-red-600" />
                  <label htmlFor="newArrival" className="text-zinc-300 text-xs font-bold cursor-pointer">New Arrival</label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Weight (kg)" placeholder="e.g. 185 for complete engine" type="number" />
                <FormField label="Dimensions (L×W×H cm)" placeholder="e.g. 80×60×70" />
              </div>
            </div>
          )}

          {tab === 'seo' && (
            <div className="space-y-5">
              <FormField label="SEO Title" placeholder="e.g. Toyota 2JZ-GTE Engine for Sale UK | JDM Specialists" />
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Meta Description</label>
                <textarea rows={3} placeholder="155–160 character description for search engines…" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors resize-none" />
              </div>
              <FormField label="URL Slug" placeholder="toyota-2jz-gte-complete-engine-used-jdm" />
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 space-y-1">
                <p>✓ Schema.org Product markup auto-generated</p>
                <p>✓ Open Graph tags auto-generated</p>
                <p>✓ Clean URL structure: /shop/[make]/[engine]/[slug]</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-zinc-800 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm font-bold transition-colors">
            Cancel
          </button>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-bold transition-colors">
              Save as Draft
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors">
              Publish Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, placeholder, type = 'text', mono, prefix }: {
  label: string; placeholder?: string; type?: string; mono?: boolean; prefix?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">{prefix}</span>}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full bg-zinc-950 border border-zinc-700 rounded-xl ${prefix ? 'pl-7' : 'px-4'} py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-red-600 transition-colors ${mono ? 'font-mono' : ''}`}
        />
      </div>
    </div>
  );
}

function FormSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">{label}</label>
      <select className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-600 transition-colors">
        <option value="">Select…</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────

function OrdersTab() {
  const [filter, setFilter] = useState('all');
  const statuses = ['all', 'Deposit Paid', 'Processing', 'Ready', 'Balance Paid', 'Completed', 'Cancelled'];

  const filtered = filter === 'all' ? SAMPLE_ORDERS : SAMPLE_ORDERS.filter(o => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white font-heading">Orders</h2>
          <p className="text-zinc-500 text-sm">{SAMPLE_ORDERS.length} orders this month</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors capitalize ${filter === s ? 'bg-red-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'}`}
          >
            {s === 'all' ? 'All Orders' : s}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3 text-left">Order</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Items</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3 text-right">Deposit</th>
                <th className="px-5 py-3 text-right">Balance</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-red-400">{order.id}</td>
                  <td className="px-5 py-4 font-semibold text-zinc-200">{order.customer}</td>
                  <td className="px-5 py-4 text-zinc-400 max-w-[200px] truncate">{order.items}</td>
                  <td className="px-5 py-4 text-right font-black text-white">£{order.total.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-green-400 font-bold">£{order.deposit}</td>
                  <td className={`px-5 py-4 text-right font-bold ${order.balance > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                    {order.balance > 0 ? formatGBP(order.balance) : '—'}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                  <td className="px-5 py-4 text-zinc-500">{order.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"><Eye className="w-3 h-3" /></button>
                      <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"><FileText className="w-3 h-3" /></button>
                      {order.balance > 0 && (
                        <button className="px-2.5 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 text-amber-400 font-bold transition-colors text-[10px]">
                          Send Balance Link
                        </button>
                      )}
                      {order.status === 'Ready' && order.balance === 0 && (
                        <button className="px-2.5 py-1.5 rounded-lg bg-green-950 hover:bg-green-900 text-green-400 font-bold transition-colors text-[10px]">
                          Mark Dispatched
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deposit rules callout */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-xs text-zinc-400 space-y-2">
        <p className="font-bold text-zinc-300 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Deposit & Dispatch Rules</p>
        <ul className="space-y-1 ml-6 list-disc">
          <li>Dispatch is <strong className="text-white">blocked</strong> while a balance is outstanding.</li>
          <li>Balance payment links expire after 14 days. Reminder emails sent at 3, 7 and 13 days.</li>
          <li>Manual bank transfers can be recorded here — tick "Balance received (bank transfer)" on the order.</li>
          <li className="text-amber-400">TODO: Connect Stripe webhooks to auto-update payment status.</li>
          <li className="text-amber-400">TODO: Confirm cancellation and refund policy with solicitor (UK Consumer Contracts Regulations).</li>
        </ul>
      </div>
    </div>
  );
}

// ── Enquiries ─────────────────────────────────────────────────────────────────

function EnquiriesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white font-heading">Enquiries</h2>
          <p className="text-zinc-500 text-sm">{SAMPLE_ENQUIRIES.filter(e => e.status === 'New').length} new, {SAMPLE_ENQUIRIES.length} total</p>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-zinc-950 text-zinc-500 uppercase font-bold border-b border-zinc-800">
              <tr>
                <th className="px-5 py-3 text-left">Ref</th>
                <th className="px-5 py-3 text-left">Name</th>
                <th className="px-5 py-3 text-left">Enquiry</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {SAMPLE_ENQUIRIES.map(enq => (
                <tr key={enq.id} className={`hover:bg-zinc-800/40 transition-colors ${enq.status === 'New' ? 'bg-red-950/5' : ''}`}>
                  <td className="px-5 py-4 font-mono font-bold text-purple-400">{enq.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-zinc-200">{enq.name}</p>
                    <p className="text-zinc-600 text-[10px]">{enq.email}</p>
                  </td>
                  <td className="px-5 py-4 text-zinc-400 max-w-[220px] truncate">{enq.engine}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      enq.type === 'Workshop Quote' ? 'bg-orange-950 text-orange-400 border-orange-700' :
                      enq.type === 'Part Enquiry'  ? 'bg-blue-950 text-blue-400 border-blue-700' :
                      'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}>{enq.type}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={enq.status} /></td>
                  <td className="px-5 py-4 text-zinc-500">{enq.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      <button className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"><Eye className="w-3 h-3" /></button>
                      <button className="px-2.5 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-400 font-bold transition-colors text-[10px]">Reply</button>
                      {enq.status === 'Replied' && (
                        <button className="px-2.5 py-1.5 rounded-lg bg-green-950 hover:bg-green-900 text-green-400 font-bold transition-colors text-[10px]">Mark Won</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Site Content ──────────────────────────────────────────────────────────────

function ContentTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-white font-heading">Site Content</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Homepage Banners', desc: 'Edit the hero carousel slides and promo strip text.', icon: Globe, status: '3 slides' },
          { title: 'Blog & Guides', desc: 'Technical articles, engine swap guides and buying tips.', icon: FileText, status: '5 posts' },
          { title: 'Projects Gallery', desc: 'Customer builds and workshop project images.', icon: ImageIcon, status: '8 projects' },
          { title: 'Google Reviews', desc: 'Manage which reviews appear on the homepage.', icon: Star, status: 'TODO: connect API' },
          { title: 'FAQ', desc: 'Edit frequently asked questions shown on the homepage.', icon: MessageSquare, status: '12 questions' },
          { title: 'Workshop Services', desc: 'Edit service pages, pricing guidance and process steps.', icon: Wrench, status: '8 services' },
        ].map(item => (
          <button key={item.title} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 text-left space-y-3 transition-colors group">
            <div className="flex items-center justify-between">
              <item.icon className="w-5 h-5 text-red-500" />
              <span className="text-[10px] text-zinc-600 font-mono">{item.status}</span>
            </div>
            <div>
              <p className="font-bold text-zinc-200 text-sm group-hover:text-white transition-colors">{item.title}</p>
              <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
            </div>
            <p className="text-red-400 text-xs font-bold group-hover:text-red-300 transition-colors">Edit →</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <div className="space-y-8 max-w-2xl">
      <h2 className="text-2xl font-black text-white font-heading">Settings</h2>

      <Section title="Business Details">
        <FormField label="Business Name" placeholder="TODO: Enter your business name" />
        <FormField label="Address" placeholder="TODO: Enter your workshop address" />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="VAT Number" placeholder="GB 000 000 000" mono />
          <FormField label="Company Number" placeholder="00000000" mono />
        </div>
        <FormField label="Phone Number" placeholder="+44 (0)1234 567 890" />
        <FormField label="Email" placeholder="sales@yourworkshop.co.uk" />
        <FormField label="Opening Hours" placeholder="Mon–Fri 8:30–17:30, Sat 9–14" />
      </Section>

      <Section title="Deposit Settings">
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Global Deposit Percentage</label>
          <div className="flex items-center gap-3">
            <input type="number" defaultValue={10} className="w-24 bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-red-600" />
            <span className="text-zinc-400 text-sm">%</span>
          </div>
          <p className="text-zinc-600 text-xs mt-2">Can be overridden per product or category.</p>
        </div>
        <FormField label="Minimum Order for Deposit (below this = full payment)" placeholder="e.g. 100" type="number" prefix="£" />
        <FormField label="Balance Payment Deadline (days)" placeholder="e.g. 14" type="number" />
      </Section>

      <Section title="Delivery Rates">
        <div className="space-y-3">
          {[
            { label: 'Standard parts (Royal Mail / DPD)', value: '4.99' },
            { label: 'Free delivery threshold', value: '75.00' },
            { label: 'Engine pallet delivery', value: '95.00' },
            { label: 'Gearbox pallet delivery', value: '65.00' },
          ].map(rate => (
            <div key={rate.label} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
              <span className="text-zinc-300 text-xs">{rate.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-zinc-500 text-xs">£</span>
                <input type="number" defaultValue={rate.value} className="w-20 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-100 text-right focus:outline-none focus:border-red-600" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Integrations (TODO: configure with real credentials)">
        {[
          { name: 'Stripe', status: 'Not connected', note: 'Required for deposits and card payments' },
          { name: 'PayPal', status: 'Not connected', note: 'Optional second payment method' },
          { name: 'Resend / Email', status: 'Not connected', note: 'Required for order and balance emails' },
          { name: 'Cloudinary', status: 'Not connected', note: 'Required for product image storage' },
          { name: 'Google Analytics', status: 'Not connected', note: 'Add GA4 measurement ID' },
        ].map(int => (
          <div key={int.name} className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3">
            <div>
              <p className="font-bold text-zinc-200 text-sm">{int.name}</p>
              <p className="text-zinc-600 text-[11px]">{int.note}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-[10px] font-bold">{int.status}</span>
              <button className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold transition-colors">Configure</button>
            </div>
          </div>
        ))}
      </Section>

      <div className="pt-4">
        <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-zinc-300 border-b border-zinc-800 pb-3">{title}</h3>
      {children}
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: { tab: AdminTab; icon: React.ElementType; label: string }[] = [
    { tab: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { tab: 'products',  icon: Package,         label: 'Products' },
    { tab: 'orders',    icon: ShoppingCart,     label: 'Orders' },
    { tab: 'enquiries', icon: MessageSquare,    label: 'Enquiries' },
    { tab: 'content',   icon: Globe,            label: 'Site Content' },
    { tab: 'settings',  icon: Settings,         label: 'Settings' },
  ];

  const notifications = SAMPLE_ENQUIRIES.filter(e => e.status === 'New').length;

  return (
    <div className="admin-portal min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-56' : 'w-0 overflow-hidden'} shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-200`}>
        {/* Logo */}
        <div className="p-5 border-b border-zinc-800">
          <div className="space-y-2">
            <Image src="/jacksonworks-wordmark.png" alt="Jackson Works" width={1150} height={700} className="h-24 w-full rounded-lg bg-white object-contain" />
            <p className="text-zinc-400 text-xs font-semibold">Owner portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <SidebarLink
              key={item.tab}
              icon={item.icon}
              label={item.label}
              tab={item.tab}
              active={activeTab === item.tab}
              onClick={() => setActiveTab(item.tab)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-800 space-y-1">
          <button className="admin-sidebar-link w-full text-left">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {notifications > 0 && (
              <span className="ml-auto bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
          <Link href="/" className="admin-sidebar-link block">
            <Globe className="w-4 h-4" />
            <span>View Shop</span>
          </Link>
          <Link href="/api/admin/logout" className="admin-sidebar-link w-full text-left text-red-400/70 hover:text-red-400">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-zinc-900/80 backdrop-blur border-b border-zinc-800 flex items-center px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-300 text-[11px] font-bold">Admin tools — product changes save in this browser only; login and shared database need setup</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-black">
            O
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard'  && <Dashboard />}
          {activeTab === 'products'   && <ProductsTab />}
          {activeTab === 'orders'     && <OrdersTab />}
          {activeTab === 'enquiries'  && <EnquiriesTab />}
          {activeTab === 'content'    && <ContentTab />}
          {activeTab === 'settings'   && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
