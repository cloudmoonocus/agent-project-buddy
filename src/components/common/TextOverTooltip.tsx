import styled from '@emotion/styled'
import { Tooltip } from 'antd'
import React from 'react'

interface TextOverTooltipProps {
  text: React.ReactNode
  maxWidth?: number | string
  className?: string
  style?: React.CSSProperties
}

const TextContainer = styled.div<{ maxWidth?: number | string }>`
  max-width: ${props => (typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth || '100%')};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

/**
 * 文本溢出时显示tooltip的组件
 * 当文本超出容器宽度时，自动显示省略号和tooltip提示
 */
export const TextOverTooltip: React.FC<TextOverTooltipProps> = ({
  text,
  maxWidth = '100%',
  className,
  style,
}) => {
  // 如果text不是字符串类型，直接返回
  if (typeof text !== 'string' && typeof text !== 'number') {
    return <>{text}</>
  }

  const textContent = String(text)

  // 如果文本为空，直接返回空字符
  if (!textContent.trim()) {
    return <span>-</span>
  }

  return (
    <Tooltip title={textContent} mouseEnterDelay={0.5}>
      <TextContainer maxWidth={maxWidth} className={className} style={style}>
        {text}
      </TextContainer>
    </Tooltip>
  )
}
