// 主题配置文件，基于现代UI设计趋势，兼容Ant Design配置
export const theme = {
  colors: {
    // 主色调
    primary: '#5E6AD2', // 紫蓝色，类似Linear
    primaryHover: '#4F58C2',
    primaryActive: '#3A44B1',
    primaryLight: '#EEF0FF',

    // 中性色
    background: '#FAFAFA',
    backgroundElevated: '#FFFFFF',
    backgroundSecondary: '#F3F4F6',

    // 文本色
    textPrimary: '#111827', // 近黑色
    textSecondary: '#4B5563', // 中灰色
    textTertiary: '#9CA3AF', // 浅灰色

    // 边框色
    border: '#E5E7EB',
    borderStrong: '#D1D5DB',

    // 状态色
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // 字体系统
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      'xs': '12px',
      'sm': '13px',
      'base': '14px',
      'lg': '16px',
      'xl': '18px',
      '2xl': '20px',
      '3xl': '24px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // 间距系统
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // 圆角
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '6px',
    lg: '8px',
    full: '9999px',
  },

  // 阴影
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // 动画过渡
  transition: {
    DEFAULT: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// 用于Emotion的类型定义
export type Theme = typeof theme
