import type { Tables, TablesInsert } from '@/types/supabase'
import { defectsApi, iterationsApi, requirementsApi, tasksApi } from '@/api'
import { PlanIterationModal } from '@/components/iteration/PlanIterationModal'
import useUserStore from '@/store/userStore'
import { LockOutlined, PlusOutlined, ScheduleOutlined, UnlockOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Progress, Row, Space, Table, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const { Title } = Typography

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #fafafa;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f5f5f5;
  }
`

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  .ant-card-head {
    background-color: #fafafa;
  }
`

const ProgressLabel = styled.div`
  margin-top: 16px;
  font-weight: 500;
  margin-bottom: 8px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 12px;
    color: #8c8c8c;
    margin-bottom: 4px;
  }

  .value {
    font-size: 14px;
    font-weight: 500;
  }
`

// 表示已锁定的标签样式
const LockedTag = styled(Tag)`
  display: inline-flex;
  align-items: center;

  .anticon {
    margin-right: 4px;
  }
`

export const Iterations: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPlanModalVisible, setIsPlanModalVisible] = useState(false)
  const [editingIteration, setEditingIteration] = useState<Tables<'iterations'> | null>(null)
  const [selectedIteration, setSelectedIteration] = useState<Tables<'iterations'> | null>(null)
  const [form] = Form.useForm()
  const { userInfo } = useUserStore()

  // 获取迭代列表
  const { data: iterations, loading, refresh } = useRequest(
    () => iterationsApi.getIterationsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 创建迭代
  const { run: createIteration, loading: createLoading } = useRequest(
    (values: TablesInsert<'iterations'>) => iterationsApi.createIteration(values),
    {
      manual: true,
      onSuccess: () => {
        message.success('迭代创建成功')
        setIsModalVisible(false)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新迭代
  const { run: updateIteration, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Tables<'iterations'>>) => iterationsApi.updateIteration(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('迭代更新成功')
        setIsModalVisible(false)
        setEditingIteration(null)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`更新失败: ${error.message}`)
      },
    },
  )

  // 锁定迭代
  const { run: lockIteration } = useRequest(
    (id: number) => iterationsApi.lockIteration(id),
    {
      manual: true,
      onSuccess: () => {
        message.success('迭代锁定成功')
        refresh()
      },
      onError: (error) => {
        message.error(`锁定失败: ${error.message}`)
      },
    },
  )

  // 解锁迭代
  const { run: unlockIteration } = useRequest(
    (id: number) => iterationsApi.unlockIteration(id),
    {
      manual: true,
      onSuccess: () => {
        message.success('迭代解锁成功')
        refresh()
      },
      onError: (error) => {
        message.error(`解锁失败: ${error.message}`)
      },
    },
  )

  // 获取当前迭代的工作项统计
  const { data: iterationStats } = useRequest(
    async () => {
      if (!iterations || iterations.length === 0)
        return null

      // 找到当前迭代（当前日期在开始和结束日期之间的迭代）
      const today = new Date().toISOString().split('T')[0]
      const currentIteration = iterations.find(
        iter => iter.start_date <= today && iter.end_date >= today,
      )

      if (!currentIteration)
        return null

      // 获取当前迭代的需求、任务和缺陷
      const [requirements, tasks, defects] = await Promise.all([
        requirementsApi.getRequirementsByIterationId(currentIteration.id),
        tasksApi.getTasksByIterationId(currentIteration.id),
        defectsApi.getDefectsByIterationId(currentIteration.id),
      ])

      // 计算完成率
      const requirementsTotal = requirements?.length || 0
      const requirementsDone = requirements?.filter(r => r.status === 'closed').length || 0

      const tasksTotal = tasks?.length || 0
      const tasksDone = tasks?.filter(t => t.status === 'closed').length || 0

      const defectsTotal = defects?.length || 0
      const defectsDone = defects?.filter(d => d.status === 'closed').length || 0

      const totalItems = requirementsTotal + tasksTotal + defectsTotal
      const totalDone = requirementsDone + tasksDone + defectsDone

      const progress = totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0

      return {
        currentIteration,
        requirements,
        tasks,
        defects,
        stats: {
          requirementsTotal,
          requirementsDone,
          tasksTotal,
          tasksDone,
          defectsTotal,
          defectsDone,
          totalItems,
          totalDone,
          progress,
        },
      }
    },
    {
      refreshDeps: [iterations],
    },
  )

  const showModal = (iteration?: Tables<'iterations'>) => {
    if (iteration) {
      setEditingIteration(iteration)
      form.setFieldsValue({
        start_date: iteration.start_date,
        end_date: iteration.end_date,
      })
    }
    else {
      setEditingIteration(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingIteration(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingIteration) {
        // 检查迭代是否锁定
        if (editingIteration.is_locked) {
          message.error('迭代已锁定，无法编辑')
          return
        }
        updateIteration(editingIteration.id, values)
      }
      else {
        createIteration({
          ...values,
          project_id: Number(projectId),
          creator_id: userInfo?.id || null,
          created_at: new Date().toISOString(),
          is_locked: false, // 默认未锁定
        })
      }
    })
  }

  const handlePlanIteration = (iteration: Tables<'iterations'>) => {
    // 检查迭代是否锁定
    if (iteration.is_locked) {
      message.error('迭代已锁定，无法规划')
      return
    }
    setSelectedIteration(iteration)
    setIsPlanModalVisible(true)
  }

  const handleLockIteration = (iteration: Tables<'iterations'>) => {
    if (iteration.is_locked) {
      unlockIteration(iteration.id)
    }
    else {
      lockIteration(iteration.id)
    }
  }

  // 获取迭代状态
  const getIterationStatus = (iteration: Tables<'iterations'>) => {
    const today = new Date().toISOString().split('T')[0]

    if (iteration.end_date < today) {
      return { text: '已完成', color: 'green' }
    }
    else if (iteration.start_date <= today && iteration.end_date >= today) {
      return { text: '进行中', color: 'blue' }
    }
    else {
      return { text: '规划中', color: 'gold' }
    }
  }

  // 计算迭代进度
  const getIterationProgress = (iteration: Tables<'iterations'>) => {
    const today = new Date().toISOString().split('T')[0]

    if (iteration.end_date < today) {
      return 100
    }
    else if (iteration.start_date > today) {
      return 0
    }
    else {
      // 计算已经过去的天数占总天数的百分比
      const startDate = new Date(iteration.start_date).getTime()
      const endDate = new Date(iteration.end_date).getTime()
      const currentDate = new Date(today).getTime()

      const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24)
      const passedDays = (currentDate - startDate) / (1000 * 60 * 60 * 24)

      return Math.min(Math.round((passedDays / totalDays) * 100), 100)
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '开始日期',
      dataIndex: 'start_date',
      key: 'start_date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '结束日期',
      dataIndex: 'end_date',
      key: 'end_date',
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '状态',
      key: 'status',
      width: 140,
      render: (_: any, record: Tables<'iterations'>) => {
        const status = getIterationStatus(record)
        return (
          <Space>
            <Tag color={status.color}>{status.text}</Tag>
            {record.is_locked && (
              <LockedTag color="red">
                <LockOutlined />
                已锁定
              </LockedTag>
            )}
          </Space>
        )
      },
    },
    {
      title: '进度',
      key: 'progress',
      width: 200,
      render: (_: any, record: Tables<'iterations'>) => {
        const progress = getIterationProgress(record)
        return <Progress percent={progress} size="small" />
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: Tables<'iterations'>) => (
        <Space>
          <Button
            type="link"
            onClick={() => showModal(record)}
            disabled={record.is_locked ?? false}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<ScheduleOutlined />}
            onClick={() => handlePlanIteration(record)}
            disabled={record.is_locked ?? false}
          >
            规划
          </Button>
          <Popconfirm
            title={record.is_locked ? '确定解锁此迭代？' : '确定锁定此迭代？'}
            description={record.is_locked
              ? '解锁后，将可以编辑迭代和工作项'
              : '锁定后，将无法编辑迭代和添加工作项'}
            onConfirm={() => handleLockIteration(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              icon={record.is_locked ? <UnlockOutlined /> : <LockOutlined />}
              danger={!record.is_locked}
            >
              {record.is_locked ? '解锁' : '锁定'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader>
        <Title level={3}>迭代列表</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          创建迭代
        </Button>
      </PageHeader>

      {iterationStats?.currentIteration && (
        <StyledCard title="当前迭代">
          <Row gutter={24}>
            <Col span={6}>
              <InfoItem>
                <span className="label">开始日期</span>
                <span className="value">
                  {new Date(iterationStats.currentIteration.start_date).toLocaleDateString()}
                </span>
              </InfoItem>
            </Col>
            <Col span={6}>
              <InfoItem>
                <span className="label">结束日期</span>
                <span className="value">
                  {new Date(iterationStats.currentIteration.end_date).toLocaleDateString()}
                </span>
              </InfoItem>
            </Col>
            <Col span={6}>
              <InfoItem>
                <span className="label">状态</span>
                <span className="value">
                  <Space>
                    <Tag color="blue">进行中</Tag>
                    {iterationStats.currentIteration.is_locked && (
                      <LockedTag color="red">
                        <LockOutlined />
                        已锁定
                      </LockedTag>
                    )}
                  </Space>
                </span>
              </InfoItem>
            </Col>
            <Col span={6}>
              <InfoItem>
                <span className="label">工作项总数</span>
                <span className="value">
                  {iterationStats.stats.totalItems}
                </span>
              </InfoItem>
            </Col>
          </Row>

          <Row gutter={24} style={{ marginTop: 16 }}>
            <Col span={8}>
              <InfoItem>
                <span className="label">需求</span>
                <span className="value">
                  {iterationStats.stats.requirementsDone}
                  {' '}
                  /
                  {iterationStats.stats.requirementsTotal}
                </span>
              </InfoItem>
            </Col>
            <Col span={8}>
              <InfoItem>
                <span className="label">任务</span>
                <span className="value">
                  {iterationStats.stats.tasksDone}
                  {' '}
                  /
                  {iterationStats.stats.tasksTotal}
                </span>
              </InfoItem>
            </Col>
            <Col span={8}>
              <InfoItem>
                <span className="label">缺陷</span>
                <span className="value">
                  {iterationStats.stats.defectsDone}
                  {' '}
                  /
                  {iterationStats.stats.defectsTotal}
                </span>
              </InfoItem>
            </Col>
          </Row>

          <ProgressLabel>完成进度:</ProgressLabel>
          <Progress percent={iterationStats.stats.progress} />
        </StyledCard>
      )}

      <StyledTable
        columns={columns}
        dataSource={iterations}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingIteration ? '编辑迭代' : '创建迭代'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createLoading || updateLoading}
        width={500}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="start_date"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="结束日期"
            rules={[
              { required: true, message: '请选择结束日期' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('start_date') || getFieldValue('start_date') <= value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('结束日期必须晚于开始日期'))
                },
              }),
            ]}
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 迭代规划模态框 */}
      <PlanIterationModal
        visible={isPlanModalVisible}
        onClose={() => setIsPlanModalVisible(false)}
        iteration={selectedIteration}
        projectId={Number(projectId)}
        onSuccess={refresh}
      />
    </div>
  )
}
