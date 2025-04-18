import type { Tables } from '../../types/supabase'
import { BugOutlined, CheckSquareOutlined, FileTextOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Avatar, Descriptions, Divider, Drawer, Space, Tag, Typography } from 'antd'
import React from 'react'
import { theme } from '../../styles/theme'

const { Title, Paragraph } = Typography

interface WorkItemDetailProps {
  visible: boolean
  onClose: () => void
  workItem: WorkItem | null
  itemType: 'requirement' | 'task' | 'defect'
}

export type WorkItem =
  | Tables<'requirements'>
  | Tables<'tasks'>
  | Tables<'defects'>

const StyledDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 16px 24px;
    border-bottom: 1px solid ${theme.colors.border};
  }

  .ant-drawer-body {
    padding: 24px;
  }
`

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`

const ItemTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  color: white;
  font-size: 18px;
`

const ItemTypeTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  height: 22px;
  margin-left: 8px;
  vertical-align: middle;
`

const ContentSection = styled.div`
  margin-bottom: 24px;
`

/**
 * 工作项详情抽屉组件
 * 用于展示工作项的详细信息，包括标题、描述、状态等
 */
export const WorkItemDetailDrawer: React.FC<WorkItemDetailProps> = ({
  visible,
  onClose,
  workItem,
  itemType,
}) => {
  if (!workItem)
    return null

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return '待开始'
      case 'in_progress': return '进行中'
      case 'closed': return '已完成'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'gold'
      case 'in_progress': return 'blue'
      case 'closed': return 'green'
      default: return 'default'
    }
  }

  const getItemTypeInfo = () => {
    switch (itemType) {
      case 'requirement':
        return {
          title: '需求',
          icon: <FileTextOutlined />,
          color: '#1677ff',
        }
      case 'task':
        return {
          title: '任务',
          icon: <CheckSquareOutlined />,
          color: '#52c41a',
        }
      case 'defect':
        return {
          title: '缺陷',
          icon: <BugOutlined />,
          color: '#f5222d',
        }
      default:
        return {
          title: '工作项',
          icon: <FileTextOutlined />,
          color: '#1677ff',
        }
    }
  }

  const renderPriority = (priority: string) => {
    const color = priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'
    const text = priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'
    return <Tag color={color}>{text}</Tag>
  }

  const renderBlockingLevel = (level: string) => {
    const color
      = level === 'high'
        ? 'red'
        : level === 'medium'
          ? 'orange'
          : level === 'low' ? 'gold' : 'green'
    const text
      = level === 'high'
        ? '高'
        : level === 'medium'
          ? '中'
          : level === 'low' ? '低' : '无'
    return <Tag color={color}>{text}</Tag>
  }

  const getItemTypeSpecificFields = () => {
    if (itemType === 'requirement') {
      const requirement = workItem as Tables<'requirements'>
      return (
        <Descriptions.Item label="优先级">
          {renderPriority(requirement.priority)}
        </Descriptions.Item>
      )
    }
    else if (itemType === 'task') {
      const task = workItem as Tables<'tasks'>
      return (
        <>
          <Descriptions.Item label="优先级">
            {renderPriority(task.priority)}
          </Descriptions.Item>
          <Descriptions.Item label="关联需求">
            {task.requirement_id || '-'}
          </Descriptions.Item>
        </>
      )
    }
    else if (itemType === 'defect') {
      const defect = workItem as Tables<'defects'>
      return (
        <Descriptions.Item label="阻塞级别">
          {renderBlockingLevel(defect.blocking_level)}
        </Descriptions.Item>
      )
    }
    return null
  }

  const typeInfo = getItemTypeInfo()

  return (
    <StyledDrawer
      title={(
        <HeaderContainer>
          <ItemTypeIcon style={{ backgroundColor: typeInfo.color }}>
            {typeInfo.icon}
          </ItemTypeIcon>
          <div>
            <ItemTypeTag color={typeInfo.color}>{typeInfo.title}</ItemTypeTag>
            <Tag
              color={getStatusColor(workItem.status)}
              style={{ marginLeft: 8 }}
            >
              {getStatusText(workItem.status)}
            </Tag>
          </div>
        </HeaderContainer>
      )}
      width={520}
      open={visible}
      onClose={onClose}
      placement="right"
      footer={null}
    >
      <ContentSection>
        <Title level={4}>{workItem.title}</Title>
        <Paragraph
          type="secondary"
          style={{ marginTop: 8, whiteSpace: 'pre-line' }}
        >
          {workItem.description || '无描述信息'}
        </Paragraph>
      </ContentSection>

      <Divider />

      <ContentSection>
        <Title level={5}>基本信息</Title>
        <Descriptions column={2} size="small" bordered>
          <Descriptions.Item label="ID">{workItem.id}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={getStatusColor(workItem.status)}>
              {getStatusText(workItem.status)}
            </Tag>
          </Descriptions.Item>

          {getItemTypeSpecificFields()}

          <Descriptions.Item label="负责人">
            {workItem.assigned_to
              ? (
                  <Space>
                    <Avatar
                      size="small"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      {workItem.assigned_to.charAt(0).toUpperCase()}
                    </Avatar>
                    <span>{workItem.assigned_to}</span>
                  </Space>
                )
              : (
                  '未分配'
                )}
          </Descriptions.Item>

          <Descriptions.Item label="创建时间">
            {workItem.created_at
              ? new Date(workItem.created_at).toLocaleString()
              : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="开始时间">
            {workItem.start_time
              ? new Date(workItem.start_time).toLocaleDateString()
              : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="结束时间">
            {workItem.end_time
              ? new Date(workItem.end_time).toLocaleDateString()
              : '-'}
          </Descriptions.Item>
        </Descriptions>
      </ContentSection>
    </StyledDrawer>
  )
}
