import type { Metadata } from 'next';
import PolicyPlaceholder from '@/components/PolicyPlaceholder';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return <PolicyPlaceholder title="Terms & Conditions" description="The terms for using the store and purchasing products have not been supplied yet." />;
}
