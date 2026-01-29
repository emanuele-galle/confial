"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SERPPreview } from "./serp-preview";
import {
  calculateFleschIT,
  getKeywordDensity,
  extractPhrases,
  analyzeMetaTags,
  stripHtml,
} from "@/lib/seo-analysis";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface SEOPanelProps {
  title: string;
  content: string; // HTML content from TipTap
  excerpt?: string;
  slug?: string;
}

/**
 * SEO Analysis Panel Component
 *
 * Provides real-time SEO analysis for content with:
 * - Flesch Reading Ease score (Italian)
 * - Keyword density visualization
 * - Top recurring phrases
 * - Meta tag analysis
 * - Google SERP preview (desktop + mobile)
 *
 * Features:
 * - Collapsible panel (default collapsed)
 * - Tab-based interface
 * - Debounced analysis (500ms) for performance
 * - Color-coded scores (green/yellow/red)
 */
export function SEOPanel({ title, content, excerpt = "", slug = "" }: SEOPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("readability");

  // Debounce content to avoid excessive computation
  const debouncedContent = useDebounce(content, 500);
  const debouncedTitle = useDebounce(title, 500);
  const debouncedExcerpt = useDebounce(excerpt, 500);

  // Perform SEO analysis
  const analysis = useMemo(() => {
    const plainText = stripHtml(debouncedContent);

    // Skip analysis if content is too short
    if (plainText.length < 50) {
      return null;
    }

    return {
      flesch: calculateFleschIT(plainText),
      keywords: getKeywordDensity(plainText),
      phrases: extractPhrases(plainText),
      meta: analyzeMetaTags(debouncedTitle, debouncedExcerpt),
    };
  }, [debouncedContent, debouncedTitle, debouncedExcerpt]);

  // Generate preview URL
  const previewUrl = slug
    ? `confial.it/news/${slug}`
    : `confial.it/news/${debouncedTitle.toLowerCase().slice(0, 30).replace(/\s+/g, '-')}`;

  return (
    <Card variant="bordered" className="overflow-hidden">
      {/* Collapsible Header */}
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">🔍 Analisi SEO</span>
            {analysis && (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  analysis.flesch.score >= 60
                    ? "bg-green-100 text-green-800"
                    : analysis.flesch.score >= 40
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                Score: {analysis.flesch.score}
              </span>
            )}
          </CardTitle>
          <button
            type="button"
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
            aria-label={isOpen ? "Chiudi analisi SEO" : "Apri analisi SEO"}
          >
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </CardHeader>

      {/* Panel Content */}
      {isOpen && (
        <CardContent>
          {!analysis ? (
            <div className="py-8 text-center text-gray-500">
              <p>Inserisci almeno 50 caratteri di contenuto per vedere l'analisi SEO</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="readability">Leggibilità</TabsTrigger>
                <TabsTrigger value="keywords">Parole chiave</TabsTrigger>
                <TabsTrigger value="phrases">Frasi</TabsTrigger>
                <TabsTrigger value="serp">Anteprima</TabsTrigger>
              </TabsList>

              {/* Tab 1: Readability (Flesch Score) */}
              <TabsContent value="readability" className="space-y-4">
                {/* Flesch Score */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Indice di leggibilità Flesch</h4>
                    <div
                      className={cn(
                        "rounded-full px-3 py-1 text-2xl font-bold",
                        analysis.flesch.score >= 60
                          ? "bg-green-100 text-green-800"
                          : analysis.flesch.score >= 40
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {analysis.flesch.score}
                    </div>
                  </div>

                  {/* Score Bar */}
                  <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        analysis.flesch.score >= 60
                          ? "bg-green-500"
                          : analysis.flesch.score >= 40
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${analysis.flesch.score}%` }}
                    />
                  </div>

                  {/* Description */}
                  <p className="mb-3 text-sm text-gray-600">{analysis.flesch.description}</p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md bg-gray-50 p-3">
                      <div className="font-medium text-gray-900">{analysis.flesch.stats.words}</div>
                      <div className="text-gray-600">Parole</div>
                    </div>
                    <div className="rounded-md bg-gray-50 p-3">
                      <div className="font-medium text-gray-900">{analysis.flesch.stats.sentences}</div>
                      <div className="text-gray-600">Frasi</div>
                    </div>
                    <div className="rounded-md bg-gray-50 p-3">
                      <div className="font-medium text-gray-900">{analysis.flesch.stats.avgWordsPerSentence}</div>
                      <div className="text-gray-600">Parole per frase</div>
                    </div>
                    <div className="rounded-md bg-gray-50 p-3">
                      <div className="font-medium text-gray-900">{analysis.flesch.stats.avgSyllablesPerWord}</div>
                      <div className="text-gray-600">Sillabe per parola</div>
                    </div>
                  </div>
                </div>

                {/* Meta Tags Analysis */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 font-medium text-gray-900">Meta Tag SEO</h4>
                  <div className="space-y-3">
                    {/* Title */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Titolo</span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            analysis.meta.title.status === "good"
                              ? "text-green-600"
                              : analysis.meta.title.status === "short"
                              ? "text-yellow-600"
                              : "text-red-600"
                          )}
                        >
                          {analysis.meta.title.length}/60 caratteri
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            analysis.meta.title.status === "good"
                              ? "bg-green-500"
                              : analysis.meta.title.status === "short"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          )}
                          style={{ width: `${Math.min((analysis.meta.title.length / 60) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{analysis.meta.title.recommendation}</p>
                    </div>

                    {/* Description */}
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Descrizione</span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            analysis.meta.description.status === "good"
                              ? "text-green-600"
                              : analysis.meta.description.status === "short"
                              ? "text-yellow-600"
                              : "text-red-600"
                          )}
                        >
                          {analysis.meta.description.length}/160 caratteri
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all",
                            analysis.meta.description.status === "good"
                              ? "bg-green-500"
                              : analysis.meta.description.status === "short"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          )}
                          style={{ width: `${Math.min((analysis.meta.description.length / 160) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-600">{analysis.meta.description.recommendation}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 2: Keyword Density */}
              <TabsContent value="keywords" className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Densità parole chiave</h4>
                    <span className="text-sm text-gray-600">Totale: {analysis.keywords.totalWords} parole</span>
                  </div>

                  {analysis.keywords.keywords.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                      Nessuna parola chiave significativa trovata
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {analysis.keywords.keywords.slice(0, 10).map((keyword, index) => (
                        <div key={keyword.word} className="flex items-center gap-3">
                          {/* Rank */}
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                            {index + 1}
                          </div>

                          {/* Word */}
                          <div className="w-32 truncate text-sm font-medium text-gray-900">{keyword.word}</div>

                          {/* Bar */}
                          <div className="flex-1">
                            <div className="h-6 w-full rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full bg-[#018856] transition-all"
                                style={{ width: `${Math.min(keyword.density * 10, 100)}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex w-24 items-center justify-end gap-2 text-xs text-gray-600">
                            <span className="font-medium">{keyword.count}×</span>
                            <span>({keyword.density.toFixed(1)}%)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tab 3: Top Phrases */}
              <TabsContent value="phrases" className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <h4 className="mb-3 font-medium text-gray-900">Frasi ricorrenti</h4>

                  {analysis.phrases.phrases.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-500">
                      Nessuna frase ricorrente trovata (servono almeno 2 occorrenze)
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {analysis.phrases.phrases.map((phrase, index) => (
                        <div
                          key={phrase.phrase}
                          className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#018856] text-xs font-bold text-white">
                              {index + 1}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{phrase.phrase}</span>
                          </div>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                            {phrase.count} occorrenze
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-800">
                    <p className="mb-1 font-medium">💡 Suggerimento:</p>
                    <p>
                      Le frasi ricorrenti mostrano i temi principali dell'articolo. Assicurati che riflettano le
                      parole chiave target.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Tab 4: SERP Preview */}
              <TabsContent value="serp" className="space-y-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Anteprima Google</h4>
                  </div>

                  {/* Desktop Preview */}
                  <div className="mb-6">
                    <h5 className="mb-3 text-sm font-medium text-gray-700">Desktop</h5>
                    <SERPPreview
                      title={debouncedTitle}
                      description={debouncedExcerpt}
                      url={previewUrl}
                      type="desktop"
                    />
                  </div>

                  {/* Mobile Preview */}
                  <div>
                    <h5 className="mb-3 text-sm font-medium text-gray-700">Mobile</h5>
                    <SERPPreview
                      title={debouncedTitle}
                      description={debouncedExcerpt}
                      url={previewUrl}
                      type="mobile"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      )}
    </Card>
  );
}
