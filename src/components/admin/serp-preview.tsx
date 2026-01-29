"use client";

import { cn } from "@/lib/utils";

interface SERPPreviewProps {
  title: string;
  description: string;
  url: string;
  type: "desktop" | "mobile";
}

/**
 * Google Search Result Preview Component
 *
 * Shows how content will appear in Google search results for desktop and mobile.
 * Helps content creators optimize title and description length.
 *
 * Desktop preview: 600px width, classic Google styling
 * Mobile preview: Responsive width, mobile-optimized layout
 */
export function SERPPreview({ title, description, url, type }: SERPPreviewProps) {
  // Truncate title and description to Google limits
  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const truncatedDescription = description.length > 160 ? description.slice(0, 157) + '...' : description;

  // Format URL as breadcrumb (e.g., "confial.it › news › articolo")
  const formattedUrl = formatBreadcrumbUrl(url);

  return (
    <div className="space-y-4">
      {/* Preview Card */}
      <div
        className={cn(
          "rounded-lg border border-gray-200 bg-white p-4",
          type === "desktop" ? "max-w-[600px]" : "w-full"
        )}
      >
        {/* URL (breadcrumb) */}
        <div className="mb-1 flex items-center gap-2">
          {type === "mobile" && (
            <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <div className="serp-url text-sm" style={{ color: '#006621', fontFamily: 'arial, sans-serif' }}>
            {formattedUrl}
          </div>
        </div>

        {/* Title */}
        <div className="mb-2">
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="serp-title block"
            style={{
              color: '#1a0dab',
              fontSize: type === "desktop" ? '20px' : '18px',
              fontFamily: 'arial, sans-serif',
              lineHeight: '1.3',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {truncatedTitle || 'Titolo non disponibile'}
          </a>
        </div>

        {/* Description */}
        <div
          className="serp-description"
          style={{
            color: '#545454',
            fontSize: '14px',
            fontFamily: 'arial, sans-serif',
            lineHeight: '1.58',
          }}
        >
          {truncatedDescription || 'Descrizione non disponibile'}
        </div>
      </div>

      {/* Character Count Indicators */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Titolo:</span>
          <span
            className={cn(
              "font-medium",
              title.length < 30 ? "text-yellow-600" : title.length > 60 ? "text-red-600" : "text-green-600"
            )}
          >
            {title.length}/60 caratteri
            {title.length < 30 && " (troppo corto)"}
            {title.length > 60 && " (troppo lungo)"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Descrizione:</span>
          <span
            className={cn(
              "font-medium",
              description.length < 120
                ? "text-yellow-600"
                : description.length > 160
                ? "text-red-600"
                : "text-green-600"
            )}
          >
            {description.length}/160 caratteri
            {description.length < 120 && " (troppo corta)"}
            {description.length > 160 && " (troppo lunga)"}
          </span>
        </div>
      </div>

      {/* SEO Tips */}
      <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
        <p className="mb-1 font-medium">💡 Suggerimenti:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Titolo ideale: 30-60 caratteri</li>
          <li>Descrizione ideale: 120-160 caratteri</li>
          <li>Includi parole chiave principali nel titolo</li>
          <li>La descrizione deve invogliare al click</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Format URL as breadcrumb-style display
 * Example: "https://confial.it/news/titolo-articolo" → "confial.it › news › articolo"
 */
function formatBreadcrumbUrl(url: string): string {
  try {
    // Remove protocol
    let formatted = url.replace(/^https?:\/\//, '');

    // Replace slashes with breadcrumb separator
    formatted = formatted.replace(/\//g, ' › ');

    // Limit to reasonable length
    if (formatted.length > 50) {
      const parts = formatted.split(' › ');
      if (parts.length > 3) {
        formatted = `${parts[0]} › ... › ${parts[parts.length - 1]}`;
      }
    }

    return formatted;
  } catch {
    return url;
  }
}
