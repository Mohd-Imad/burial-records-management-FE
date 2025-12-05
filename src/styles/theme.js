export const theme = {
  colors: {
    // Primary - Simple Purple
    primary: '#6366f1',
    primarySolid: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#818cf8',
    primaryDark: '#4338ca',
    
    // Accent Colors
    secondary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#06B6D4',
    
    // Status colors with gradients
    verified: '#10B981',
    verifiedBg: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
    pending: '#F59E0B',
    pendingBg: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
    completed: '#3B82F6',
    completedBg: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
    rejected: '#EF4444',
    rejectedBg: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
    
    // Neutrals - Modern Gray Scale
    gray50: '#FAFAFA',
    gray100: '#F4F4F5',
    gray200: '#E4E4E7',
    gray300: '#D4D4D8',
    gray400: '#A1A1AA',
    gray500: '#71717A',
    gray600: '#52525B',
    gray700: '#3F3F46',
    gray800: '#27272A',
    gray900: '#18181B',
    
    white: '#FFFFFF',
    black: '#000000',
    
    // Backgrounds - Simple
    bgPrimary: '#FFFFFF',
    bgSecondary: '#f9fafb',
    bgSidebar: '#ffffff',
    bgGradient: '#6366f1',
    bgCard: '#FFFFFF',
    bgCardHover: '#f9fafb',
    
    // Text
    textPrimary: '#18181B',
    textSecondary: '#71717A',
    textLight: '#A1A1AA',
    textWhite: '#FFFFFF',
  },
  
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
    md: '0 4px 12px -1px rgba(0, 0, 0, 0.12)',
    lg: '0 10px 20px -3px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 30px -5px rgba(0, 0, 0, 0.18)',
    '2xl': '0 30px 60px -12px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    glow: '0 0 25px rgba(124, 58, 237, 0.4)',
    glowHover: '0 0 35px rgba(124, 58, 237, 0.6)',
    card: '0 4px 20px rgba(0, 0, 0, 0.08)',
    cardHover: '0 8px 30px rgba(0, 0, 0, 0.12)',
  },
  
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    '2xl': '24px',
    full: '9999px',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  fonts: {
    body: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  },
  
  fontSizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};
