/**
 * Design tokens extracted from Figma file:
 * https://www.figma.com/design/CYj0ckSWUMYdJFrRFZQ7Sc/Creative-Upaay-hiring-assignment
 *
 * Frame width: 390px (all screens)
 * Screens: Login, Sign Up, Home, Movie Details, Select Movie Theatre,
 * Select Schedule, Select Seats, Booking Summary, Checkout, Payment Success, My Bookings
 */

export const tokens = {
  layout: {
    appWidth: 390,
    headerHeight: 56,
    bottomNavHeight: 64,
    pagePadding: 16,
  },
  colors: {
    primary: '#5D5FEF',
    primaryHover: '#4B4DD4',
    background: '#FFFFFF',
    surface: '#F8F8FA',
    surfaceMuted: '#F3F4F6',
    border: '#E8E8ED',
    borderInput: '#D1D5DB',
    textPrimary: '#121212',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    textOnPrimary: '#FFFFFF',
    seatAvailableBg: '#FFFFFF',
    seatAvailableBorder: '#D1D5DB',
    seatOccupied: '#C4C4C4',
    seatSelected: '#5D5FEF',
    success: '#22C55E',
    successBg: '#ECFDF5',
    error: '#EF4444',
    errorBg: '#FEF2F2',
    screenArc: '#D1D5DB',
    star: '#FBBF24',
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    pageTitle: { size: '18px', weight: 600, lineHeight: '24px' },
    sectionTitle: { size: '16px', weight: 600, lineHeight: '22px' },
    body: { size: '14px', weight: 400, lineHeight: '20px' },
    caption: { size: '12px', weight: 400, lineHeight: '16px' },
    button: { size: '16px', weight: 600, lineHeight: '20px' },
    label: { size: '13px', weight: 500, lineHeight: '18px' },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    full: 9999,
  },
  seat: {
    size: 22,
    gap: 4,
    rowLabelWidth: 20,
  },
} as const;

export type DesignTokens = typeof tokens;
