/**
 * SEO Analysis utilities for Italian content
 *
 * Provides:
 * - Flesch Reading Ease score (Italian formula)
 * - Keyword density analysis
 * - Top phrase extraction (n-grams)
 * - Meta tag length validation
 */

// Italian stop words for filtering
const ITALIAN_STOP_WORDS = new Set([
  'il', 'lo', 'la', 'i', 'gli', 'le', 'un', 'uno', 'una',
  'di', 'a', 'da', 'in', 'con', 'su', 'per', 'tra', 'fra',
  'e', 'o', 'ma', 'non', 'che', 'se', 'come', 'quando',
  'questo', 'quello', 'essere', 'avere', 'fare', 'dire',
  'anche', 'più', 'solo', 'così', 'già', 'ancora', 'molto',
  'molto', 'poi', 'quindi', 'però', 'perché', 'perche',
  'del', 'dello', 'della', 'dei', 'degli', 'delle',
  'al', 'allo', 'alla', 'ai', 'agli', 'alle',
  'dal', 'dallo', 'dalla', 'dai', 'dagli', 'dalle',
  'nel', 'nello', 'nella', 'nei', 'negli', 'nelle',
  'sul', 'sullo', 'sulla', 'sui', 'sugli', 'sulle',
  'col', 'collo', 'colla', 'coi', 'cogli', 'colle',
]);

function isStopWord(word: string): boolean {
  return ITALIAN_STOP_WORDS.has(word.toLowerCase());
}

/**
 * Count syllables in Italian word
 * Italian syllables are counted by vowel groups
 */
function countSyllablesIT(word: string): number {
  const vowelGroups = word.toLowerCase().match(/[aeiouàèéìòù]+/g);
  return vowelGroups ? vowelGroups.length : 1;
}

/**
 * Get Flesch reading level classification
 */
function getFleschLevel(score: number): "molto_facile" | "facile" | "normale" | "difficile" | "molto_difficile" {
  if (score >= 80) return "molto_facile";
  if (score >= 60) return "facile";
  if (score >= 40) return "normale";
  if (score >= 20) return "difficile";
  return "molto_difficile";
}

/**
 * Get Flesch score description in Italian
 */
function getFleschDescription(score: number): string {
  if (score >= 80) return "Molto facile da leggere - adatto a bambini";
  if (score >= 60) return "Facile da leggere - conversazionale";
  if (score >= 40) return "Normale - livello standard";
  if (score >= 20) return "Difficile - richiede attenzione";
  return "Molto difficile - testo complesso";
}

/**
 * Calculate Flesch Reading Ease score for Italian text
 *
 * Italian Flesch formula:
 * 206.835 - (1.015 × avg_words_per_sentence) - (84.6 × avg_syllables_per_word)
 *
 * Score interpretation:
 * - 80-100: Molto facile (elementary)
 * - 60-80: Facile (conversational)
 * - 40-60: Normale (standard)
 * - 20-40: Difficile (technical)
 * - 0-20: Molto difficile (academic)
 */
export function calculateFleschIT(text: string): {
  score: number;
  level: "molto_facile" | "facile" | "normale" | "difficile" | "molto_difficile";
  description: string;
  stats: {
    words: number;
    sentences: number;
    syllables: number;
    avgWordsPerSentence: number;
    avgSyllablesPerWord: number;
  };
} {
  // Split by sentence terminators
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

  // Split by whitespace, filter to words with letters
  const words = text.split(/\s+/).filter(w => w.match(/\w/));

  // Count total syllables
  const syllables = words.reduce((sum, word) => sum + countSyllablesIT(word), 0);

  const wordCount = words.length || 1;
  const sentenceCount = sentences.length || 1;
  const syllableCount = syllables || wordCount;

  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = syllableCount / wordCount;

  // Italian Flesch formula
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

  // Clamp to 0-100 range
  const clampedScore = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(clampedScore),
    level: getFleschLevel(clampedScore),
    description: getFleschDescription(clampedScore),
    stats: {
      words: wordCount,
      sentences: sentenceCount,
      syllables: syllableCount,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 10) / 10,
    },
  };
}

/**
 * Analyze keyword density in text
 *
 * @param text - Text to analyze
 * @param minLength - Minimum word length to consider (default: 3)
 * @returns Top keywords with count and density percentage
 */
export function getKeywordDensity(text: string, minLength = 3): {
  keywords: { word: string; count: number; density: number }[];
  totalWords: number;
} {
  // Remove HTML tags and normalize
  const cleanText = text.replace(/<[^>]+>/g, ' ').toLowerCase();

  // Split into words, filter by length and stop words
  const words = cleanText
    .split(/\s+/)
    .filter(w => w.length >= minLength && !isStopWord(w) && w.match(/^[a-zàèéìòù]+$/));

  // Count word occurrences
  const wordCount: Record<string, number> = {};
  words.forEach(w => {
    wordCount[w] = (wordCount[w] || 0) + 1;
  });

  const totalWords = words.length || 1;

  // Convert to array, calculate density, sort by count
  const keywords = Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      density: Math.round((count / totalWords) * 10000) / 100, // 2 decimal places
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Top 20 keywords

  return { keywords, totalWords };
}

/**
 * Extract top recurring phrases (n-grams)
 *
 * @param text - Text to analyze
 * @param n - N-gram size (2 for bigrams, 3 for trigrams)
 * @returns Top phrases with occurrence count
 */
export function extractPhrases(text: string, n = 2): {
  phrases: { phrase: string; count: number }[];
} {
  // Remove HTML tags and normalize
  const cleanText = text.replace(/<[^>]+>/g, ' ').toLowerCase();

  // Split into words, filter to meaningful words
  const words = cleanText
    .split(/\s+/)
    .filter(w => w.match(/\w{3,}/));

  // Extract n-grams
  const phrases: Record<string, number> = {};

  for (let i = 0; i < words.length - n + 1; i++) {
    const nGramWords = words.slice(i, i + n);

    // Skip if contains any stop word
    if (nGramWords.some(w => isStopWord(w))) continue;

    const phrase = nGramWords.join(' ');
    phrases[phrase] = (phrases[phrase] || 0) + 1;
  }

  // Filter phrases with at least 2 occurrences
  return {
    phrases: Object.entries(phrases)
      .filter(([_, count]) => count >= 2)
      .map(([phrase, count]) => ({ phrase, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10), // Top 10 phrases
  };
}

/**
 * Analyze meta tag lengths (title and description)
 * Provides recommendations based on SEO best practices
 */
export function analyzeMetaTags(title: string, description: string): {
  title: {
    length: number;
    status: "good" | "short" | "long";
    recommendation: string;
  };
  description: {
    length: number;
    status: "good" | "short" | "long";
    recommendation: string;
  };
} {
  return {
    title: {
      length: title.length,
      status: title.length < 30 ? "short" : title.length > 60 ? "long" : "good",
      recommendation:
        title.length < 30
          ? "Titolo troppo corto (minimo 30 caratteri consigliati)"
          : title.length > 60
          ? "Titolo troppo lungo (massimo 60 caratteri consigliati)"
          : "Lunghezza titolo ottimale per i risultati di ricerca",
    },
    description: {
      length: description.length,
      status: description.length < 120 ? "short" : description.length > 160 ? "long" : "good",
      recommendation:
        description.length < 120
          ? "Descrizione troppo corta (minimo 120 caratteri consigliati)"
          : description.length > 160
          ? "Descrizione troppo lunga (massimo 160 caratteri consigliati)"
          : "Lunghezza descrizione ottimale per i risultati di ricerca",
    },
  };
}

/**
 * Strip HTML tags from text
 * Helper for getting plain text from HTML content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
