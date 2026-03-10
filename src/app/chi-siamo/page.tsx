import { getStaticPageMetadata } from '@/lib/seo';
import ChiSiamoContent from './chi-siamo-content';

export const metadata = getStaticPageMetadata('/chi-siamo');

export default function ChiSiamoPage() {
  return <ChiSiamoContent />;
}
