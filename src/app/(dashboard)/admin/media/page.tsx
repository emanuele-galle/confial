import { Metadata } from "next";
import { MediaLibrary } from "@/components/media/media-library";

export const metadata: Metadata = {
  title: "Libreria Media | Dashboard CONFIAL",
  description: "Gestisci le immagini e i media del sito",
};

export default function MediaPage() {
  return (
    <div className="container mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
        <a href="/dashboard" className="hover:text-gray-900">
          Dashboard
        </a>
        <span>›</span>
        <span className="font-medium text-gray-900">Media</span>
      </nav>

      {/* Media Library */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <MediaLibrary mode="page" />
      </div>
    </div>
  );
}
