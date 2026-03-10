import { getStaticPageMetadata } from '@/lib/seo';
import SettoriContent from './settori-content';

export const metadata = getStaticPageMetadata('/settori');

export default function SettoriPage() {
  return <SettoriContent />;
}
