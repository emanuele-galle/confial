import { getStaticPageMetadata } from '@/lib/seo';
import ContattiContent from './contatti-content';

export const metadata = getStaticPageMetadata('/contatti');

export default function ContattiPage() {
  return <ContattiContent />;
}
