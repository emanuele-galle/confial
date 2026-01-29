/**
 * CONFIAL Admin Dashboard Design System
 *
 * Colori, spaziature e stili consistenti per tutta l'area admin
 */

export const adminTheme = {
  // Palette colori principale - basata sul brand CONFIAL (verde)
  colors: {
    // Brand colors
    primary: {
      50: '#f0fdf7',
      100: '#dcfce9',
      200: '#bbf7d2',
      300: '#86efac',
      400: '#4ade80',
      500: '#018856', // CONFIAL green - PRIMARY
      600: '#016b43',
      700: '#015a38',
      800: '#01472d',
      900: '#013621',
    },

    // Semantic colors
    success: {
      light: '#dcfce7',
      DEFAULT: '#16a34a',
      dark: '#15803d',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#d97706',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#dc2626',
      dark: '#b91c1c',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
    },

    // Neutral grays
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: 'var(--font-lato), system-ui, sans-serif',
      heading: 'var(--font-montserrat), system-ui, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
    },
  },

  // Spacing system
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
  },

  // Border radius
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },

  // Stat card variants (usando sfumature di verde invece di colori rainbow)
  statCardVariants: {
    primary: {
      bg: 'from-emerald-500/90 to-teal-600/90',
      iconBg: 'bg-white/20',
      iconText: 'text-white',
      border: 'border-emerald-400/20',
      glow: 'shadow-emerald-500/20',
    },
    secondary: {
      bg: 'from-emerald-600/90 to-emerald-700/90',
      iconBg: 'bg-white/20',
      iconText: 'text-white',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-600/20',
    },
    tertiary: {
      bg: 'from-teal-500/90 to-cyan-600/90',
      iconBg: 'bg-white/20',
      iconText: 'text-white',
      border: 'border-teal-400/20',
      glow: 'shadow-teal-500/20',
    },
    accent: {
      bg: 'from-green-500/90 to-emerald-600/90',
      iconBg: 'bg-white/20',
      iconText: 'text-white',
      border: 'border-green-400/20',
      glow: 'shadow-green-500/20',
    },
  },

  // Badge variants
  badgeVariants: {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
  },
} as const;

export type StatCardVariant = keyof typeof adminTheme.statCardVariants;
export type BadgeVariant = keyof typeof adminTheme.badgeVariants;
