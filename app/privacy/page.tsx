import type { Metadata } from 'next';
import PolicyPlaceholder from '@/components/PolicyPlaceholder';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return <PolicyPlaceholder title="Privacy Policy" description="The business's privacy notice and data handling details have not been supplied yet." />;
}
