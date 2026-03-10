import { getStaticPageMetadata } from '@/lib/seo';
import HomeContent from './home-content';

export const metadata = getStaticPageMetadata('/');

export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">FAILMS CONFIAL - Sindacato Industria Metalmeccanica e Siderurgica</h1>
      <HomeContent />
    </>
  );
}
