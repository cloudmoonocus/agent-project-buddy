import type { ThemeConfig } from 'antd'
import { theme as antdTheme } from 'antd'
import { theme as customTheme } from './theme'

// Ant Design 主题配置
export const antdThemeConfig: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: customTheme.colors.primary,
    colorSuccess: customTheme.colors.success,
    colorWarning: customTheme.colors.warning,
    colorError: customTheme.colors.error,
    colorInfo: customTheme.colors.info,
    colorTextBase: customTheme.colors.textPrimary,

    borderRadius: Number.parseInt(customTheme.borderRadius.sm),
    fontFamily: customTheme.typography.fontFamily,
    fontSize: Number.parseInt(customTheme.typography.fontSize.base),

    colorBgContainer: customTheme.colors.backgroundElevated,
    colorBgElevated: customTheme.colors.backgroundElevated,
    colorBgLayout: customTheme.colors.background,

    boxShadow: customTheme.boxShadow.DEFAULT,
    boxShadowSecondary: customTheme.boxShadow.md,
  },
  components: {
    Button: {
      paddingContentHorizontal: 16,
      paddingContentVertical: 6,
      fontWeight: 500,
    },
    Card: {
      colorBorderSecondary: customTheme.colors.border,
      borderRadiusLG: Number.parseInt(customTheme.borderRadius.md),
    },
    Menu: {
      itemHeight: 40,
      itemHoverColor: customTheme.colors.primary,
      itemSelectedColor: customTheme.colors.primary,
      itemSelectedBg: customTheme.colors.primaryLight,
    },
    Table: {
      colorBgContainer: customTheme.colors.backgroundElevated,
      headerBg: customTheme.colors.backgroundSecondary,
      headerColor: customTheme.colors.textSecondary,
      rowHoverBg: customTheme.colors.primaryLight,
      borderColor: customTheme.colors.border,
    },
    Typography: {
      titleMarginBottom: 16,
      titleMarginTop: 0,
    },
    Select: {
      controlItemBgActive: customTheme.colors.primaryLight,
    },
    Modal: {
      titleFontSize: Number.parseInt(customTheme.typography.fontSize.xl),
      borderRadiusLG: Number.parseInt(customTheme.borderRadius.lg),
      paddingContentHorizontalLG: 24,
    },
  },
}
