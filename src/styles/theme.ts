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
  // Master balanced palette for both themes
  blocks: {
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    pink: '#ec4899',
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
    background: '#ffffff', 
    surface: '#ffffff',    // pure white (Cards/Pop-ups)
    surfaceVariant: '#f1f5f9', // slate-100 (Empty grid cells)
    primary: '#2563eb',    // blue-600
    secondary: '#059669',  // emerald-600
    accent: '#d97706',     // amber-600
    error: '#dc2626',      // red-600
    text: {
      primary: '#000000',
      secondary: '#475569', // slate-600
      inverse: '#ffffff',
    },
    border: 'rgba(15, 23, 42, 0.08)', // Soft slate-900 border
    ...sharedStyles.blocks, 
  },
};

export const theme = darkTheme; // Default
export type Theme = typeof darkTheme;
