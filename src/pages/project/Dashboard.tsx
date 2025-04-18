import type { Tables } from '@/types/supabase'
import { defectsApi, iterationsApi, projectsApi, requirementsApi, tasksApi } from '@/api'
import { BugOutlined, CheckSquareOutlined, FileTextOutlined, SyncOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Card, Col, Progress, Row, Statistic, Table, Tag, Typography } from 'antd'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'

const { Title } = Typography

const StyledCard = styled(Card)`
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    background-color: #fafafa;
  }

  .ant-statistic-title {
    color: #8c8c8c;
  }

  .ant-statistic-content {
    color: #262626;
  }
`

const StatusCard = styled(StyledCard)`
  .ant-card-body {
    padding: 12px 24px;
  }
`

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .label {
    display: flex;
    align-items: center;

    .anticon {
      margin-right: 8px;
    }
  }

  .count {
    font-weight: 500;
  }
`

const SectionTitle = styled(Title)`
  margin-top: 32px !important;
  margin-bottom: 16px !important;
`

export const Dashboard: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()

  // 获取项目详情
  const { data: projectData, loading: projectLoading } = useRequest(
    () => projectsApi.getProjectWithRelations(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 获取当前迭代
  const { data: currentIteration, loading: iterationLoading } = useRequest(
    async () => {
      const iterations = await iterationsApi.getIterationsByProjectId(Number(projectId))
      const today = new Date().toISOString().split('T')[0]
      return iterations.find(iter => iter.start_date <= today && iter.end_date >= today) || null
    },
    {
      refreshDeps: [projectId],
    },
  )

  // 获取需求状态统计
  const { data: requirements, loading: requirementsLoading } = useRequest(
    () => requirementsApi.getRequirementsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 获取任务状态统计
  const { data: tasks, loading: tasksLoading } = useRequest(
    () => tasksApi.getTasksByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 获取缺陷状态统计
  const { data: defects, loading: defectsLoading } = useRequest(
    () => defectsApi.getDefectsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 计算需求状态统计
  const requirementStats = useMemo(() => {
    if (!requirements)
      return { open: 0, inProgress: 0, closed: 0, total: 0 }

    const open = requirements.filter(r => r.status === 'open').length
    const inProgress = requirements.filter(r => r.status === 'in_progress').length
    const closed = requirements.filter(r => r.status === 'closed').length

    return {
      open,
      inProgress,
      closed,
      total: requirements.length,
    }
  }, [requirements])

  // 计算任务状态统计
  const taskStats = useMemo(() => {
    if (!tasks)
      return { open: 0, inProgress: 0, closed: 0, total: 0 }

    const open = tasks.filter(t => t.status === 'open').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const closed = tasks.filter(t => t.status === 'closed').length

    return {
      open,
      inProgress,
      closed,
      total: tasks.length,
    }
  }, [tasks])

  // 计算缺陷状态统计
  const defectStats = useMemo(() => {
    if (!defects)
      return { open: 0, inProgress: 0, closed: 0, total: 0 }

    const open = defects.filter(d => d.status === 'open').length
    const inProgress = defects.filter(d => d.status === 'in_progress').length
    const closed = defects.filter(d => d.status === 'closed').length

    return {
      open,
      inProgress,
      closed,
      total: defects.length,
    }
  }, [defects])

  // 计算总体完成率
  const completionRate = useMemo(() => {
    const totalItems = requirementStats.total + taskStats.total + defectStats.total
    const closedItems = requirementStats.closed + taskStats.closed + defectStats.closed

    return totalItems > 0 ? Math.round((closedItems / totalItems) * 100) : 0
  }, [requirementStats, taskStats, defectStats])

  // 最近的工作项
  const recentItems = useMemo(() => {
    if (!requirements || !tasks || !defects)
      return []

    const allItems = [
      ...requirements.map(r => ({
        ...r,
        type: 'requirement',
        typeText: '需求',
        icon: <FileTextOutlined style={{ color: '#1677ff' }} />,
      })),
      ...tasks.map(t => ({
        ...t,
        type: 'task',
        typeText: '任务',
        icon: <CheckSquareOutlined style={{ color: '#52c41a' }} />,
      })),
      ...defects.map(d => ({
        ...d,
        type: 'defect',
        typeText: '缺陷',
        icon: <BugOutlined style={{ color: '#f5222d' }} />,
      })),
    ]

    // 按创建时间排序，最新的在前
    return allItems
      .filter(item => item.created_at)
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, 5)
  }, [requirements, tasks, defects])

  const loading = projectLoading || iterationLoading || requirementsLoading || tasksLoading || defectsLoading

  const getStatusText = (status: Tables<'requirements'>['status']) => {
    switch (status) {
      case 'open': return '待开始'
      case 'in_progress': return '进行中'
      case 'closed': return '已完成'
      default: return status
    }
  }

  const getStatusColor = (status: Tables<'requirements'>['status']) => {
    switch (status) {
      case 'open': return 'gold'
      case 'in_progress': return 'blue'
      case 'closed': return 'green'
      default: return 'default'
    }
  }

  const recentItemsColumns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (_: string, record: any) => (
        <span>
          {record.icon}
          {' '}
          {record.typeText}
        </span>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: Tables<'requirements'>['status']) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ]

  return (
    <div>
      <Title level={3}>
        {projectData?.name || '项目'}
        {' '}
        仪表盘
      </Title>
      {projectData?.description && (
        <p style={{ color: '#8c8c8c', marginTop: -8, marginBottom: 24 }}>
          {projectData.description}
        </p>
      )}

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StyledCard>
            <Statistic
              loading={loading}
              title="需求"
              value={requirementStats.total}
              prefix={<FileTextOutlined />}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              loading={loading}
              title="任务"
              value={taskStats.total}
              prefix={<CheckSquareOutlined />}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              loading={loading}
              title="缺陷"
              value={defectStats.total}
              prefix={<BugOutlined />}
            />
          </StyledCard>
        </Col>
        <Col span={6}>
          <StyledCard>
            <Statistic
              loading={loading}
              title="当前迭代"
              value={currentIteration
                ? `${new Date(currentIteration.start_date).toLocaleDateString()} - ${new Date(currentIteration.end_date).toLocaleDateString()}`
                : '无'}
              prefix={<SyncOutlined />}
            />
          </StyledCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={8}>
          <StatusCard title="需求状态">
            <StatusRow>
              <span className="label">待开始</span>
              <span className="count">{requirementStats.open}</span>
            </StatusRow>
            <StatusRow>
              <span className="label">进行中</span>
              <span className="count">{requirementStats.inProgress}</span>
            </StatusRow>
            <StatusRow>
              <span className="label">已完成</span>
              <span className="count">{requirementStats.closed}</span>
            </StatusRow>
            <Progress
              percent={requirementStats.total > 0
                ? Math.round((requirementStats.closed / requirementStats.total) * 100)
                : 0}
              size="small"
              status="active"
            />
          </StatusCard>
        </Col>
        <Col span={8}>
          <StatusCard title="任务状态">
            <StatusRow>
              <span className="label">待开始</span>
              <span className="count">{taskStats.open}</span>
            </StatusRow>
            <StatusRow>
              <span className="label">进行中</span>
              <span className="count">{taskStats.inProgress}</span>
            </StatusRow>
            <StatusRow>
              <span className="label">已完成</span>
              <span className="count">{taskStats.closed}</span>
            </StatusRow>
            <Progress
              percent={taskStats.total > 0
                ? Math.round((taskStats.closed / taskStats.total) * 100)
                : 0}
              size="small"
              status="active"
            />
          </StatusCard>
        </Col>
        <Col span={8}>
          <StatusCard title="缺陷状态">
            <StatusRow>
              <span className="label">待修复</span>
              <span className="count">{defectStats.open}</span>
            </StatusRow>
            <StatusRow>
              <span className="label">修复中</span>
              <span className="count">{defectStats.inProgress}</span>
            </StatusRow>
            <StatusRow>
              <span className="label">已修复</span>
              <span className="count">{defectStats.closed}</span>
            </StatusRow>
            <Progress
              percent={defectStats.total > 0
                ? Math.round((defectStats.closed / defectStats.total) * 100)
                : 0}
              size="small"
              status="active"
            />
          </StatusCard>
        </Col>
      </Row>

      <SectionTitle level={4}>项目完成度</SectionTitle>
      <StyledCard>
        <Statistic
          title="总体完成率"
          value={completionRate}
          suffix="%"
          precision={0}
        />
        <Progress
          percent={completionRate}
          status="active"
          strokeWidth={10}
          style={{ marginTop: 16 }}
        />
      </StyledCard>

      <SectionTitle level={4}>最近更新</SectionTitle>
      <StyledCard>
        <Table
          columns={recentItemsColumns}
          dataSource={recentItems}
          rowKey={record => `${record.type}-${record.id}`}
          pagination={false}
          loading={loading}
        />
      </StyledCard>
    </div>
  )
}
