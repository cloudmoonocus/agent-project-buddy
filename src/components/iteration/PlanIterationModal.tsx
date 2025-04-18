import type { Tables } from '../../types/supabase'
import { BugOutlined, CheckSquareOutlined, FileTextOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { message, Modal, Table, Tabs, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { iterationsApi } from '../../api'

const { Text } = Typography

interface PlanIterationModalProps {
  visible: boolean
  onClose: () => void
  iteration: Tables<'iterations'> | null
  projectId: number
  onSuccess: () => void
}

const StyledTabs = styled(Tabs)`
  .ant-tabs-content {
    padding-top: 16px;
  }
`

const ItemTypeIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 8px;
`

/**
 * 迭代规划组件
 * 用于将工作项分配到迭代中
 */
export const PlanIterationModal: React.FC<PlanIterationModalProps> = ({
  visible,
  onClose,
  iteration,
  projectId,
  onSuccess,
}) => {
  const [selectedItems, setSelectedItems] = useState<{
    requirements: number[]
    tasks: number[]
    defects: number[]
  }>({
    requirements: [],
    tasks: [],
    defects: [],
  })

  // 获取未分配迭代的工作项
  const { data: unassignedItems, loading, refresh } = useRequest(
    () => iterationsApi.getUnassignedWorkItems(projectId),
    {
      refreshDeps: [projectId, visible],
      ready: visible && !!projectId,
    },
  )

  // 将工作项分配到迭代
  const { run: assignWorkItems, loading: assignLoading } = useRequest(
    items => iterationsApi.assignWorkItemsToIteration(iteration!.id, items),
    {
      manual: true,
      onSuccess: () => {
        message.success('工作项已成功分配到迭代')
        onSuccess()
        onClose()
        setSelectedItems({ requirements: [], tasks: [], defects: [] })
      },
      onError: (error) => {
        message.error(`分配失败: ${error.message}`)
      },
    },
  )

  useEffect(() => {
    if (visible) {
      setSelectedItems({ requirements: [], tasks: [], defects: [] })
      refresh()
    }
  }, [visible, refresh])

  const handleRequirementSelect = (selectedRowKeys: React.Key[]) => {
    setSelectedItems(prev => ({
      ...prev,
      requirements: selectedRowKeys as number[],
    }))
  }

  const handleTaskSelect = (selectedRowKeys: React.Key[]) => {
    setSelectedItems(prev => ({
      ...prev,
      tasks: selectedRowKeys as number[],
    }))
  }

  const handleDefectSelect = (selectedRowKeys: React.Key[]) => {
    setSelectedItems(prev => ({
      ...prev,
      defects: selectedRowKeys as number[],
    }))
  }

  const handleSubmit = () => {
    if (!iteration)
      return

    const hasSelectedItems
      = selectedItems.requirements.length > 0
        || selectedItems.tasks.length > 0
        || selectedItems.defects.length > 0

    if (!hasSelectedItems) {
      message.warning('请至少选择一个工作项')
      return
    }

    assignWorkItems(selectedItems)
  }

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

  const requirementColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <>
          <ItemTypeIcon>
            <FileTextOutlined style={{ color: '#1677ff' }} />
          </ItemTypeIcon>
          {text}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const color = priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'
        const text = priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'
        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  const taskColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <>
          <ItemTypeIcon>
            <CheckSquareOutlined style={{ color: '#52c41a' }} />
          </ItemTypeIcon>
          {text}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        const color = priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'
        const text = priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'
        return <Tag color={color}>{text}</Tag>
      },
    },
  ]

  const defectColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <>
          <ItemTypeIcon>
            <BugOutlined style={{ color: '#f5222d' }} />
          </ItemTypeIcon>
          {text}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '阻塞级别',
      dataIndex: 'blocking_level',
      key: 'blocking_level',
      width: 100,
      render: (level: string) => {
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
      },
    },
  ]

  const iterationDateRange = iteration
    ? `${new Date(iteration.start_date).toLocaleDateString()} - ${new Date(iteration.end_date).toLocaleDateString()}`
    : ''

  return (
    <Modal
      title={`规划迭代: ${iterationDateRange}`}
      open={visible}
      onCancel={onClose}
      width={800}
      okText="分配到迭代"
      cancelText="取消"
      onOk={handleSubmit}
      okButtonProps={{
        disabled: !iteration || (selectedItems.requirements.length === 0 && selectedItems.tasks.length === 0 && selectedItems.defects.length === 0),
        loading: assignLoading,
      }}
      footer={null}
    >
      <StyledTabs
        defaultActiveKey="requirements"
        items={[
          {
            key: 'requirements',
            label: (
              <>
                <FileTextOutlined />
                需求
                {unassignedItems?.requirements && (
                  <Tag style={{ marginLeft: 8 }}>{unassignedItems.requirements.length}</Tag>
                )}
              </>
            ),
            children: (
              <>
                {unassignedItems?.requirements?.length === 0
                  ? (
                      <Text type="secondary">没有未分配的需求</Text>
                    )
                  : (
                      <Table
                        rowSelection={{
                          type: 'checkbox',
                          selectedRowKeys: selectedItems.requirements,
                          onChange: handleRequirementSelect,
                        }}
                        columns={requirementColumns}
                        dataSource={unassignedItems?.requirements || []}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        loading={loading}
                        size="small"
                      />
                    )}
              </>
            ),
          },
          {
            key: 'tasks',
            label: (
              <>
                <CheckSquareOutlined />
                任务
                {unassignedItems?.tasks && (
                  <Tag style={{ marginLeft: 8 }}>{unassignedItems.tasks.length}</Tag>
                )}
              </>
            ),
            children: (
              <>
                {unassignedItems?.tasks?.length === 0
                  ? (
                      <Text type="secondary">没有未分配的任务</Text>
                    )
                  : (
                      <Table
                        rowSelection={{
                          type: 'checkbox',
                          selectedRowKeys: selectedItems.tasks,
                          onChange: handleTaskSelect,
                        }}
                        columns={taskColumns}
                        dataSource={unassignedItems?.tasks || []}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        loading={loading}
                        size="small"
                      />
                    )}
              </>
            ),
          },
          {
            key: 'defects',
            label: (
              <>
                <BugOutlined />
                缺陷
                {unassignedItems?.defects && (
                  <Tag style={{ marginLeft: 8 }}>{unassignedItems.defects.length}</Tag>
                )}
              </>
            ),
            children: (
              <>
                {unassignedItems?.defects?.length === 0
                  ? (
                      <Text type="secondary">没有未分配的缺陷</Text>
                    )
                  : (
                      <Table
                        rowSelection={{
                          type: 'checkbox',
                          selectedRowKeys: selectedItems.defects,
                          onChange: handleDefectSelect,
                        }}
                        columns={defectColumns}
                        dataSource={unassignedItems?.defects || []}
                        rowKey="id"
                        pagination={{ pageSize: 5 }}
                        loading={loading}
                        size="small"
                      />
                    )}
              </>
            ),
          },
        ]}
      />
    </Modal>
  )
}
