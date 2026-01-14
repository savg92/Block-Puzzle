export const colors = {
  arcade: {
    blue: '#3b82f6',
    red: '#ef4444',
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#a855f7',
    orange: '#f97316',
    cyan: '#06b6d4',
    pink: '#ec4899',
  },
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
  },
};

export const theme = {
  colors,
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
    xl: 16,
  },
};

export type Theme = typeof theme;
