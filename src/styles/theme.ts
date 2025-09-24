import { DefaultTheme } from 'styled-components';

// 颜色配置
const colors = {
  // 主色调
  primary: '#1890ff',
  primaryHover: '#40a9ff',
  primaryActive: '#096dd9',
  primaryLight: '#e6f7ff',
  
  // 辅助色
  secondary: '#722ed1',
  secondaryHover: '#9254de',
  secondaryActive: '#531dab',
  
  // 成功色
  success: '#52c41a',
  successHover: '#73d13d',
  successActive: '#389e0d',
  successLight: '#f6ffed',
  
  // 警告色
  warning: '#faad14',
  warningHover: '#ffc53d',
  warningActive: '#d48806',
  warningLight: '#fffbe6',
  
  // 错误色
  error: '#ff4d4f',
  errorHover: '#ff7875',
  errorActive: '#d9363e',
  errorLight: '#fff2f0',
  
  // 信息色
  info: '#1890ff',
  infoHover: '#40a9ff',
  infoActive: '#096dd9',
  infoLight: '#e6f7ff',
  
  // 中性色
  white: '#ffffff',
  black: '#000000',
  gray1: '#fafafa',
  gray2: '#f5f5f5',
  gray3: '#f0f0f0',
  gray4: '#d9d9d9',
  gray5: '#bfbfbf',
  gray6: '#8c8c8c',
  gray7: '#595959',
  gray8: '#434343',
  gray9: '#262626',
  gray10: '#1f1f1f',
  
  // 文本色
  textPrimary: '#262626',
  textSecondary: '#595959',
  textTertiary: '#8c8c8c',
  textDisabled: '#bfbfbf',
  
  // 背景色
  bgPrimary: '#ffffff',
  bgSecondary: '#fafafa',
  bgTertiary: '#f5f5f5',
  bgDisabled: '#f5f5f5',
  
  // 边框色
  border: '#d9d9d9',
  borderLight: '#f0f0f0',
  borderDark: '#bfbfbf',
  
  // 阴影色
  shadow1: 'rgba(0, 0, 0, 0.02)',
  shadow2: 'rgba(0, 0, 0, 0.03)',
  shadow3: 'rgba(0, 0, 0, 0.05)',
  shadow4: 'rgba(0, 0, 0, 0.07)',
  shadow5: 'rgba(0, 0, 0, 0.09)',
  
  // 攀岩主题色
  climbing: {
    rock: '#8B4513',
    mountain: '#2F4F4F',
    sky: '#87CEEB',
    grass: '#228B22',
    sunset: '#FF6347',
  },
};

// 字体配置
const fonts = {
  family: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },
  size: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '30px',
    '5xl': '36px',
    '6xl': '48px',
  },
  weight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 2,
  },
};

// 间距配置
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '64px',
};

// 断点配置
const breakpoints = {
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

// 阴影配置
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
};

// 圆角配置
const borderRadius = {
  none: '0',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
};

// 过渡动画配置
const transitions = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out',
  
  // 具体属性的过渡
  color: 'color 150ms ease-in-out',
  background: 'background-color 150ms ease-in-out',
  border: 'border-color 150ms ease-in-out',
  shadow: 'box-shadow 150ms ease-in-out',
  transform: 'transform 150ms ease-in-out',
  opacity: 'opacity 150ms ease-in-out',
  all: 'all 150ms ease-in-out',
};

// Z-index 配置
const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// 主题对象
export const theme: DefaultTheme = {
  colors,
  fonts,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  transitions,
  zIndex,
};

// 媒体查询辅助函数
export const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
  
  // 最小宽度查询
  minXs: `@media (min-width: ${breakpoints.xs})`,
  minSm: `@media (min-width: ${breakpoints.sm})`,
  minMd: `@media (min-width: ${breakpoints.md})`,
  minLg: `@media (min-width: ${breakpoints.lg})`,
  minXl: `@media (min-width: ${breakpoints.xl})`,
  minXxl: `@media (min-width: ${breakpoints.xxl})`,
};

// 类型声明扩展
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors;
    fonts: typeof fonts;
    spacing: typeof spacing;
    breakpoints: typeof breakpoints;
    shadows: typeof shadows;
    borderRadius: typeof borderRadius;
    transitions: typeof transitions;
    zIndex: typeof zIndex;
  }
}

export default theme;