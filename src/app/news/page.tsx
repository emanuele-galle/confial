import { getStaticPageMetadata } from '@/lib/seo';
import NewsContent from './news-content';

export const metadata = getStaticPageMetadata('/news');

export default function NewsPage() {
  return <NewsContent />;
}
