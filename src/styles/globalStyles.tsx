import { css, Global } from '@emotion/react'
import { theme } from './theme'

export const globalStyles = (
  <Global
    styles={css`
      body {
        background-color: ${theme.colors.background};
        color: ${theme.colors.textPrimary};
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.fontSize.base};
        line-height: ${theme.typography.lineHeight.normal};
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      #root {
        height: 100%;
        width: 100%;
      }

      /* 平滑滚动 */
      html {
        scroll-behavior: smooth;
      }

      /* 链接样式 */
      a {
        color: ${theme.colors.primary};
        text-decoration: none;
        transition: ${theme.transition.DEFAULT};

        &:hover {
          color: ${theme.colors.primaryHover};
          text-decoration: none;
        }
      }

      /* 增强文本选择样式 */
      ::selection {
        background-color: ${theme.colors.primaryLight};
        color: ${theme.colors.primary};
      }

      /* 滚动条美化 */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background-color: rgba(155, 155, 155, 0.5);
        border-radius: 4px;

        &:hover {
          background-color: rgba(155, 155, 155, 0.7);
        }
      }

      /* 平滑过渡效果 */
      button,
      .ant-btn,
      .ant-table-row,
      .ant-menu-item,
      .ant-select-item,
      .ant-checkbox,
      .ant-radio {
        transition: ${theme.transition.DEFAULT};
      }

      /* 表格行悬浮效果 */
      .ant-table-tbody > tr:hover > td {
        background-color: ${theme.colors.primaryLight} !important;
      }

      /* Card 样式优化 */
      .ant-card {
        box-shadow: ${theme.boxShadow.sm};
        border-radius: ${theme.borderRadius.md};
        border: 1px solid ${theme.colors.border};
        overflow: hidden;
        transition: ${theme.transition.DEFAULT};

        &:hover {
          box-shadow: ${theme.boxShadow.md};
        }
      }

      /* 表单元素优化 */
      .ant-input,
      .ant-select-selector,
      .ant-picker,
      .ant-input-number {
        border-radius: ${theme.borderRadius.sm} !important;
        border-color: ${theme.colors.border} !important;

        &:hover, &:focus {
          border-color: ${theme.colors.primary} !important;
          box-shadow: 0 0 0 2px ${theme.colors.primaryLight} !important;
        }
      }

      /* 按钮样式强化 */
      .ant-btn {
        border-radius: ${theme.borderRadius.sm};
        font-weight: ${theme.typography.fontWeight.medium};
        height: auto;
        padding: 6px 16px;

        &.ant-btn-primary {
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};

          &:hover, &:active {
            background-color: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
        }
      }
    `}
  />
)
