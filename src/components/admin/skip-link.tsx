/**
 * Skip Link Component (A11Y-02)
 *
 * Provides a keyboard-accessible skip navigation link that allows
 * screen reader users and keyboard-only users to bypass repetitive
 * navigation and jump directly to main content.
 *
 * WCAG 2.1 AA Compliance: Bypass Blocks (2.4.1)
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded
                 focus:shadow-lg focus:text-[#016030] focus:font-semibold
                 focus:border focus:border-[#016030]"
    >
      Vai al contenuto principale
    </a>
  );
}
