const sharedStyles = {
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
  // Block types - consistent across themes
  blocks: {
    blue: '#3B82F6',
    green: '#10B981',
    orange: '#F59E0B',
    red: '#EF4444',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    pink: '#EC4899',
  },
};

export const darkTheme = {
  ...sharedStyles,
  colors: {
    background: '#020617', // slate-950
    surface: '#0f172a',    // slate-900
    surfaceVariant: '#1e293b', // slate-800
    primary: '#3b82f6',    // blue-500
    secondary: '#10b981',  // emerald-500
    accent: '#f59e0b',     // amber-500
    error: '#ef4444',      // red-500
    text: {
      primary: '#f8fafc',  // slate-50
      secondary: '#94a3b8', // slate-400
      inverse: '#020617',  // slate-950
    },
    border: '#1e293b',     // slate-800
    ...sharedStyles.blocks,
  },
};

export const lightTheme = {
  ...sharedStyles,
  colors: {
    background: '#f8fafc', // slate-50
    surface: '#f1f5f9',    // slate-100
    surfaceVariant: '#e2e8f0', // slate-200
    primary: '#2563eb',    // blue-600
    secondary: '#059669',  // emerald-600
    accent: '#d97706',     // amber-600
    error: '#dc2626',      // red-600
    text: {
      primary: '#0f172a',  // slate-900
      secondary: '#64748b', // slate-500
      inverse: '#f8fafc',  // slate-50
    },
    border: '#cbd5e1',     // slate-300
    ...sharedStyles.blocks,
  },
};

export const theme = darkTheme; // Default
export type Theme = typeof darkTheme;
