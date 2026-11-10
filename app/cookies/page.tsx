import type { Metadata } from 'next';
import PolicyPlaceholder from '@/components/PolicyPlaceholder';

export const metadata: Metadata = { title: 'Cookie Information' };

export default function CookiesPage() {
  return <PolicyPlaceholder title="Cookie Information" description="Cookie use and consent preferences have not been configured for this preview." />;
}
