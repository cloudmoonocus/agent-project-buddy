import type { Tables, TablesInsert } from '../../types/supabase'
import { PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { requirementsApi } from '../../api'

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

export const Requirements: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<Tables<'requirements'> | null>(null)
  const [form] = Form.useForm()

  // 获取需求列表
  const { data: requirements, loading, refresh } = useRequest(
    () => requirementsApi.getRequirementsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 创建需求
  const { run: createRequirement, loading: createLoading } = useRequest(
    (values: TablesInsert<'requirements'>) => requirementsApi.createRequirement(values),
    {
      manual: true,
      onSuccess: () => {
        message.success('需求创建成功')
        setIsModalVisible(false)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新需求
  const { run: updateRequirement, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Tables<'requirements'>>) => requirementsApi.updateRequirement(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('需求更新成功')
        setIsModalVisible(false)
        setEditingRequirement(null)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`更新失败: ${error.message}`)
      },
    },
  )

  const showModal = (requirement?: Tables<'requirements'>) => {
    if (requirement) {
      setEditingRequirement(requirement)
      form.setFieldsValue({
        title: requirement.title,
        description: requirement.description,
        priority: requirement.priority,
        status: requirement.status,
        assigned_to: requirement.assigned_to,
      })
    }
    else {
      setEditingRequirement(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingRequirement(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (editingRequirement) {
        updateRequirement(editingRequirement.id, values)
      }
      else {
        createRequirement({
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
      render: (priority: Tables<'requirements'>['priority']) => {
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
      render: (status: Tables<'requirements'>['status']) => {
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
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Tables<'requirements'>) => (
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
        <Title level={3}>需求列表</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          创建需求
        </Button>
      </PageHeader>

      <StyledTable
        columns={columns}
        dataSource={requirements}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRequirement ? '编辑需求' : '创建需求'}
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
            rules={[{ required: true, message: '请输入需求标题' }]}
          >
            <Input placeholder="请输入需求标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入需求描述" />
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
        </Form>
      </Modal>
    </div>
  )
}
