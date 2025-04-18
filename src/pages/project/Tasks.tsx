import type { Tables, TablesInsert } from '@/types/supabase'
import { requirementsApi, tasksApi } from '@/api'
import { WorkItemDetailDrawer } from '@/components/workitem/WorkItemDetailDrawer'
import useUserStore from '@/store/userStore'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

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

  .ant-table-tbody > tr {
    cursor: pointer;
  }
`

export const Tasks: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Tables<'tasks'> | null>(null)
  const [selectedTask, setSelectedTask] = useState<Tables<'tasks'> | null>(null)
  const [form] = Form.useForm()
  const { userInfo } = useUserStore()

  // 检查 URL 参数中是否有任务 ID
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const taskId = searchParams.get('id')

    if (taskId) {
      tasksApi.getTaskById(Number(taskId))
        .then((data) => {
          setSelectedTask(data)
          setIsDetailVisible(true)
        })
        .catch((error) => {
          message.error(`获取任务详情失败: ${error.message}`)
        })
    }
  }, [location.search])

  // 获取任务列表
  const { data: tasks, loading, refresh } = useRequest(
    () => tasksApi.getTasksByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 获取需求列表（用于任务关联）
  const { data: requirements } = useRequest(
    () => requirementsApi.getRequirementsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 创建任务
  const { run: createTask, loading: createLoading } = useRequest(
    (values: TablesInsert<'tasks'>) => tasksApi.createTask(values),
    {
      manual: true,
      onSuccess: () => {
        message.success('任务创建成功')
        setIsModalVisible(false)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新任务
  const { run: updateTask, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Tables<'tasks'>>) => tasksApi.updateTask(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('任务更新成功')
        setIsModalVisible(false)
        setEditingTask(null)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`更新失败: ${error.message}`)
      },
    },
  )

  const showModal = (task?: Tables<'tasks'>) => {
    if (task) {
      setEditingTask(task)
      form.setFieldsValue({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        requirement_id: task.requirement_id,
        start_time: task.start_time ? task.start_time.split('T')[0] : undefined,
        end_time: task.end_time ? task.end_time.split('T')[0] : undefined,
      })
    }
    else {
      setEditingTask(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingTask(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // 使用当前用户的id作为负责人
      const userId = userInfo?.id || null

      if (editingTask) {
        updateTask(editingTask.id, {
          ...values,
          assigned_to: userId,
        })
      }
      else {
        createTask({
          ...values,
          project_id: Number(projectId),
          creator_id: userId,
          assigned_to: userId,
          created_at: new Date().toISOString(),
        })
      }
    })
  }

  const handleRowClick = (record: Tables<'tasks'>) => {
    setSelectedTask(record)
    setIsDetailVisible(true)

    // 更新 URL，但不触发页面刷新
    const newUrl = `${location.pathname}?id=${record.id}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleDetailClose = () => {
    setIsDetailVisible(false)
    setSelectedTask(null)

    // 移除 URL 中的参数
    const newUrl = location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleViewDetail = (e: React.MouseEvent, record: Tables<'tasks'>) => {
    e.stopPropagation()
    navigate(`/project/${projectId}/tasks?id=${record.id}`)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: Tables<'tasks'>['priority']) => {
        const color
          = priority === 'high'
            ? 'red'
            : priority === 'medium' ? 'orange' : 'green'
        const text
          = priority === 'high'
            ? '高'
            : priority === 'medium' ? '中' : '低'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Tables<'tasks'>['status']) => {
        const color
          = status === 'closed'
            ? 'green'
            : status === 'in_progress' ? 'blue' : 'gold'
        const text
          = status === 'closed'
            ? '已完成'
            : status === 'in_progress' ? '进行中' : '待开始'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '负责人',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      width: 120,
      render: (assignedTo: string | null) => assignedTo || '-',
    },
    {
      title: '关联需求',
      dataIndex: 'requirement_id',
      key: 'requirement_id',
      width: 120,
      render: (requirementId: number | null) => {
        if (!requirementId)
          return '-'
        const requirement = requirements?.find(r => r.id === requirementId)
        return requirement ? requirement.title : requirementId
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Tables<'tasks'>) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={e => handleViewDetail(e, record)}
          >
            查看
          </Button>
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation()
              showModal(record)
            }}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader>
        <Title level={3}>任务列表</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          创建任务
        </Button>
      </PageHeader>

      <StyledTable
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={record => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Modal
        title={editingTask ? '编辑任务' : '创建任务'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createLoading || updateLoading}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="请输入任务标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入任务描述" />
          </Form.Item>

          <Form.Item
            name="priority"
            label="优先级"
            rules={[{ required: true, message: '请选择优先级' }]}
            initialValue="medium"
          >
            <Select placeholder="请选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="open"
          >
            <Select placeholder="请选择状态">
              <Option value="open">待开始</Option>
              <Option value="in_progress">进行中</Option>
              <Option value="closed">已完成</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="requirement_id"
            label="关联需求"
          >
            <Select placeholder="请选择关联需求" allowClear>
              {requirements?.map(req => (
                <Option key={req.id} value={req.id}>{req.title}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="start_time"
            label="开始时间"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            name="end_time"
            label="结束时间"
          >
            <Input type="date" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 任务详情抽屉 */}
      <WorkItemDetailDrawer
        visible={isDetailVisible}
        onClose={handleDetailClose}
        workItem={selectedTask}
        itemType="task"
      />
    </div>
  )
}
