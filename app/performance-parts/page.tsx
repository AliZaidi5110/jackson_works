import type { Metadata } from 'next';
import { getEngineByCode } from '@/lib/jdm-catalog';
import PartsDirectory from './PartsDirectory';

export const metadata: Metadata = {
  title: 'Performance Parts',
  description: 'Enquire about turbo manifolds, wastegates, intercoolers, fabrication components and more for your build.',
};

export default async function PerformancePartsPage({ searchParams }: { searchParams: Promise<{ engine?: string | string[] }> }) {
  const { engine } = await searchParams;
  const code = typeof engine === 'string' ? engine.toUpperCase() : '';
  const initialEngine = code === 'RB25DET NEO' ? code : getEngineByCode(code)?.code ?? '';
  return <PartsDirectory key={initialEngine} initialEngine={initialEngine} />;
}
