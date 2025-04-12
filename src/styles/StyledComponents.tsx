import type { Theme } from './theme'
// 通用UI组件样式，基于Emotion的styled组件
import styled from '@emotion/styled'
import { Button, Card, Divider, Typography } from 'antd'

// 自定义标题
export const PageTitle = styled(Typography.Title)`
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing[6]} !important;
  font-weight: ${({ theme }: { theme: Theme }) => theme.typography.fontWeight.semibold} !important;
`

// 自定义副标题
export const SectionTitle = styled(Typography.Title)`
  font-size: ${({ theme }: { theme: Theme }) => theme.typography.fontSize.lg} !important;
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing[4]} !important;
  font-weight: ${({ theme }: { theme: Theme }) => theme.typography.fontWeight.medium} !important;
`

// 内容容器
export const ContentContainer = styled.div`
  padding: ${({ theme }: { theme: Theme }) => theme.spacing[6]};
  background: ${({ theme }: { theme: Theme }) => theme.colors.backgroundElevated};
  border-radius: ${({ theme }: { theme: Theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }: { theme: Theme }) => theme.boxShadow.sm};
`

// 页面容器
export const PageContainer = styled.div`
  padding: ${({ theme }: { theme: Theme }) => theme.spacing[6]};
  height: 100%;
  overflow: auto;
`

// 增强卡片
export const EnhancedCard = styled(Card)`
  border-radius: ${({ theme }: { theme: Theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }: { theme: Theme }) => theme.colors.border};
  box-shadow: ${({ theme }: { theme: Theme }) => theme.boxShadow.sm};
  transition: ${({ theme }: { theme: Theme }) => theme.transition.DEFAULT};

  &:hover {
    box-shadow: ${({ theme }: { theme: Theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
  }
`

// 主要按钮
export const PrimaryButton = styled(Button)`
  background: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-color: ${({ theme }: { theme: Theme }) => theme.colors.primary};
  border-radius: ${({ theme }: { theme: Theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }: { theme: Theme }) => theme.typography.fontWeight.medium};
  height: auto;
  padding: 6px 16px;

  &:hover {
    background: ${({ theme }: { theme: Theme }) => theme.colors.primaryHover};
    border-color: ${({ theme }: { theme: Theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    background: ${({ theme }: { theme: Theme }) => theme.colors.primaryActive};
    border-color: ${({ theme }: { theme: Theme }) => theme.colors.primaryActive};
    transform: translateY(0);
  }
`

// 分隔线
export const StyledDivider = styled(Divider)`
  margin: ${({ theme }: { theme: Theme }) => `${theme.spacing[4]} 0`};
  border-color: ${({ theme }: { theme: Theme }) => theme.colors.border};
`

// 卡片网格布局
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }: { theme: Theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }: { theme: Theme }) => theme.spacing[6]};
`

// 灵活布局容器
export const FlexContainer = styled.div<{
  direction?: 'row' | 'column'
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch'
  gap?: keyof Theme['spacing']
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  align-items: ${({ align = 'center' }) => align};
  gap: ${({ theme, gap = '4' }: { theme: Theme, gap?: keyof Theme['spacing'] }) => theme.spacing[gap]};
`

// 悬停高亮
export const HoverHighlight = styled.div`
  transition: ${({ theme }: { theme: Theme }) => theme.transition.DEFAULT};
  border-radius: ${({ theme }: { theme: Theme }) => theme.borderRadius.md};

  &:hover {
    background-color: ${({ theme }: { theme: Theme }) => theme.colors.backgroundSecondary};
  }
`

// 标签
export const Tag = styled.span<{
  type?: 'default' | 'success' | 'warning' | 'error' | 'info'
}>`
  display: inline-block;
  padding: 2px 8px;
  font-size: ${({ theme }: { theme: Theme }) => theme.typography.fontSize.xs};
  border-radius: ${({ theme }: { theme: Theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }: { theme: Theme }) => theme.typography.fontWeight.medium};
  background-color: ${({ theme, type = 'default' }: { theme: Theme, type?: string }) => {
    switch (type) {
      case 'success': return `${theme.colors.success}20`
      case 'warning': return `${theme.colors.warning}20`
      case 'error': return `${theme.colors.error}20`
      case 'info': return `${theme.colors.info}20`
      default: return theme.colors.backgroundSecondary
    }
  }};
  color: ${({ theme, type = 'default' }: { theme: Theme, type?: string }) => {
    switch (type) {
      case 'success': return theme.colors.success
      case 'warning': return theme.colors.warning
      case 'error': return theme.colors.error
      case 'info': return theme.colors.info
      default: return theme.colors.textSecondary
    }
  }};
`

// 加载动画容器
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  min-height: 200px;
`
