export const theme = {
  colors: {
    background: '#0F172A', // Deep Slate
    surface: '#1E293B',    // Slate 800
    primary: '#3B82F6',    // blue-500
    secondary: '#10B981',  // emerald-500
    accent: '#F59E0B',     // amber-500
    error: '#EF4444',      // red-500
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
      inverse: '#0F172A',
    },
    // Block types
    blocks: {
      blue: '#3B82F6',
      green: '#10B981',
      orange: '#F59E0B',
      red: '#EF4444',
      purple: '#8B5CF6',
      cyan: '#06B6D4',
      pink: '#EC4899',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 9999,
  },
};

export type Theme = typeof theme;
