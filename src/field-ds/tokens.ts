/**
 * Field DS design tokens.
 *
 * Extracted from the Field DS playground (field-ds.vercel.app) since the
 * @field-ds/tokens package is React Native and not on the public registry.
 * Values mirror the published token set; use these for web (react-dom) work.
 *
 * `palette` = raw colour scales. `colour` = semantic roles (what components use).
 */

export const palette = {
  neutral: { white: '#ffffff', black: '#000000' },
  grey: {
    50: '#fcfcfd', 100: '#f9f9fb', 200: '#f2f3f7', 300: '#eaecf0', 400: '#d0d4dd',
    500: '#989fb3', 600: '#666d85', 700: '#475067', 800: '#343d54', 900: '#1d2539', 1000: '#101628',
  },
  supermall: {
    50: '#f6f6fe', 100: '#edeefd', 200: '#dbdcfa', 300: '#c0c2f6', 400: '#9fa2ef',
    500: '#757adb', 600: '#4f52d4', 700: '#3536da', 800: '#2122b8', 900: '#19198a', 1000: '#12136d',
  },
  brandBlue: {
    50: '#f5faff', 100: '#ebf4ff', 200: '#d6e9ff', 300: '#bddbff', 400: '#85bdff',
    500: '#3392ff', 600: '#0f7eff', 700: '#0f61ff', 800: '#0a49b8', 900: '#082f8c', 1000: '#001f6b',
  },
  emerald: {
    50: '#edfdfb', 100: '#e3fcfa', 200: '#cef3f0', 300: '#b8ebe7', 400: '#7fccc8',
    500: '#3fa199', 600: '#2f8e88', 700: '#1f7a74', 800: '#115a56', 900: '#083f3b', 1000: '#022c29',
  },
  green: {
    50: '#f6fefb', 100: '#e3fcf2', 200: '#cbf6e5', 300: '#adf0d5', 400: '#71d6ad',
    500: '#26b57c', 600: '#12a168', 700: '#0f8857', 800: '#0b623f', 900: '#07422a', 1000: '#082b1d',
  },
  noon: {
    50: '#fefeeb', 100: '#fefdc8', 200: '#fff7c2', 300: '#fff77a', 400: '#feee00',
    500: '#ffd91a', 600: '#f5c400', 700: '#cc8500', 800: '#a36200', 900: '#804600', 1000: '#522c00',
  },
  orange: {
    50: '#fffaf5', 100: '#fff1e0', 200: '#fee7cd', 300: '#fedbb4', 400: '#ffcb8f',
    500: '#ffa852', 600: '#fd8835', 700: '#e5641a', 800: '#ae3a13', 900: '#73260d', 1000: '#491604',
  },
  red: {
    50: '#fff5f5', 100: '#fff0f0', 200: '#fed2d2', 300: '#fdb5b5', 400: '#f6a2a2',
    500: '#f48f8f', 600: '#f04242', 700: '#d92626', 800: '#b81414', 900: '#7b1414', 1000: '#510b0b',
  },
  purple: {
    50: '#fdf6ff', 100: '#fbf0fe', 200: '#f5defd', 300: '#efcafc', 400: '#e290fe',
    500: '#c655ec', 600: '#bd3ae9', 700: '#ad24db', 800: '#741b92', 900: '#491759', 1000: '#320f3d',
  },
  pink: {
    50: '#fff4f8', 100: '#fce9ef', 200: '#fcdfe8', 300: '#faccdc', 400: '#fe9fbd',
    500: '#fb73a0', 600: '#f7306f', 700: '#e01854', 800: '#b3093d', 900: '#6e0323', 1000: '#520018',
  },
  alphaLight: {
    4: '#ffffff0a', 8: '#ffffff14', 16: '#ffffff29', 24: '#ffffff3d', 50: '#ffffff80', 64: '#ffffffa3', 80: '#ffffffcc',
  },
  alphaDark: {
    4: '#0000000a', 8: '#00000014', 16: '#00000029', 24: '#0000003d', 50: '#00000080', 64: '#000000a3', 80: '#000000cc',
  },
} as const;

export const colour = {
  'text-n-icon': {
    primary: '#1d2539', secondary: '#475067', tertiary: '#666d85', muted: '#989fb3',
    'on-surface-bold': '#ffffff', 'on-surface-subtle': '#ffffffcc',
    action: '#0f61ff', supermall: '#2122b8', error: '#d92626', warning: '#e5641a',
    'yellow-light': '#feee00', 'yellow-dark': '#a36200', success: '#0f8857', success_bold: '#0b623f',
  },
  surface: {
    primary: '#ffffff', secondary: '#f9f9fb', tertiary: '#f2f3f7', muted: '#eaecf0',
    'tertiary-inverted': '#343d54', 'secondary-inverted': '#1d2539', 'primary-inverted': '#101628',
    absolute_black: '#000000',
    'action-subtle': '#ebf4ff', 'action-bold': '#0f7eff', 'action-extrabold': '#0f61ff',
    'supermall-subtle': '#edeefd', 'supermall-bold': '#2122b8',
    'error-subtle': '#fff0f0', 'error-bold': '#d92626',
    'warning-subtle': '#fff1e0', 'warning-bold': '#e5641a',
    'yellow-subtle': '#fefdc8', 'yellow-mild': '#fff7c2', 'brand-primary': '#feee00', 'yellow-bold': '#f5c400',
    'success-subtle': '#e3fcf2', 'success-bold': '#0f8857', 'success-extrabold': '#083f3b',
    'overlay-subtle': '#0000003d', 'overlay-bold': '#000000cc',
  },
  border: {
    white: '#ffffff', primary: '#eaecf0', subtle: '#f2f3f7', medium: '#d0d4dd', bold: '#666d85', extrabold: '#101628',
    action: '#bddbff', 'action-bold': '#0f61ff', supermall: '#c0c2f6',
    error: '#fdb5b5', error_bold: '#d92626', warning: '#fedbb4', yellow: '#fff7c2', success: '#adf0d5', success_bold: '#0f8857',
  },
} as const;

export const space = {
  0: 0, 1: 1, 2: 2, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20,
  24: 24, 28: 28, 32: 32, 36: 36, 40: 40, 44: 44, 48: 48, 52: 52, 56: 56, 60: 60, 64: 64, 72: 72,
  '-2': -2, '-4': -4, '-6': -6, '-8': -8, '-12': -12,
} as const;

export const radius = {
  0: 0, 2: 2, 4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 14: 14, 16: 16, 18: 18, 20: 20,
  24: 24, 28: 28, 32: 32, 36: 36, 40: 40, rounded: 9999,
} as const;

/** Font-weight families. On web, load the matching Noontree font faces. */
export const fontFamily = {
  regular: { fontFamily: 'Noontree-Regular', fontWeight: '400' },
  medium: { fontFamily: 'Noontree-Medium', fontWeight: '500' },
  bold: { fontFamily: 'Noontree-Bold', fontWeight: '700' },
  heavy: { fontFamily: 'Noontree-ExtraBold', fontWeight: '800' },
} as const;

/** Named heading styles. (fontWeight is "400" in source because weight rides on the font family file.) */
export const typography = {
  H16_Bold: { fontFamily: 'Noontree-Bold', fontSize: 16, fontWeight: '400', lineHeight: 20, letterSpacing: -0.15 },
  H18_Bold: { fontFamily: 'Noontree-Bold', fontSize: 18, fontWeight: '400', lineHeight: 24, letterSpacing: -0.15 },
  H20_Bold: { fontFamily: 'Noontree-Bold', fontSize: 20, fontWeight: '400', lineHeight: 28, letterSpacing: -0.25 },
  H24_Bold: { fontFamily: 'Noontree-Bold', fontSize: 24, fontWeight: '400', lineHeight: 32, letterSpacing: -0.25 },
  H28_Bold: { fontFamily: 'Noontree-Bold', fontSize: 28, fontWeight: '400', lineHeight: 36, letterSpacing: -0.25 },
  H32_Bold: { fontFamily: 'Noontree-Bold', fontSize: 32, fontWeight: '400', lineHeight: 40, letterSpacing: -0.25 },
  H32_Extrabold: { fontFamily: 'Noontree-ExtraBold', fontSize: 32, fontWeight: '400', lineHeight: 40, letterSpacing: -0.25 },
  H40_Bold: { fontFamily: 'Noontree-Bold', fontSize: 40, fontWeight: '400', lineHeight: 48, letterSpacing: -0.25 },
  H40_Extrabold: { fontFamily: 'Noontree-ExtraBold', fontSize: 40, fontWeight: '400', lineHeight: 48, letterSpacing: -0.25 },
} as const;

export const motion = {
  duration: { instant: 40, xs: 100, sm: 160, recede: 180, base: 200, emphasized: 220, lg: 260, xl: 320 },
  easing: {
    standard: [0.32, 0.72, 0, 1],
    loft: [0.22, 1, 0.36, 1],
    accelerate: [0.4, 0, 1, 1],
    decelerate: [0, 0, 0.2, 1],
    easeInOut: [0.6, 0, 0.4, 1],
  },
} as const;

export const tokens = { palette, colour, space, radius, fontFamily, typography, motion } as const;

export default tokens;
