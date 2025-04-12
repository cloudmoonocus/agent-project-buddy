import type { Tables, TablesInsert } from '../../types/supabase'
import { PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { requirementsApi, tasksApi } from '../../api'

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
`

export const Tasks: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Tables<'tasks'> | null>(null)
  const [form] = Form.useForm()

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
        assigned_to: task.assigned_to,
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
      if (editingTask) {
        updateTask(editingTask.id, values)
      }
      else {
        createTask({
          ...values,
          project_id: Number(projectId),
          creator_id: null, // 这里应该使用当前登录用户的ID
          created_at: new Date().toISOString(),
        })
      }
    })
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
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 120,
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '结束时间',
      dataIndex: 'end_time',
      key: 'end_time',
      width: 120,
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Tables<'tasks'>) => (
        <Space>
          <Button type="link" onClick={() => showModal(record)}>
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
      />

      <Modal
        title={editingTask ? '编辑任务' : '创建任务'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={createLoading || updateLoading}
        width={600}
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
            name="assigned_to"
            label="负责人"
          >
            <Input placeholder="请输入负责人" />
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
    </div>
  )
}
