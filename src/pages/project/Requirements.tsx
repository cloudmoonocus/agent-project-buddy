import type { Tables, TablesInsert } from '../../types/supabase'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { iterationsApi, requirementsApi } from '../../api'
import { WorkItemDetailDrawer } from '../../components/workitem/WorkItemDetailDrawer'
import useUserStore from '../../store/userStore'

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

export const Requirements: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<Tables<'requirements'> | null>(null)
  const [selectedRequirement, setSelectedRequirement] = useState<Tables<'requirements'> | null>(null)
  const [form] = Form.useForm()
  const { userInfo } = useUserStore()

  // 检查 URL 参数中是否有需求 ID
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const requirementId = searchParams.get('id')

    if (requirementId) {
      requirementsApi.getRequirementById(Number(requirementId))
        .then((data) => {
          setSelectedRequirement(data)
          setIsDetailVisible(true)
        })
        .catch((error) => {
          message.error(`获取需求详情失败: ${error.message}`)
        })
    }
  }, [location.search])

  // 获取需求列表
  const { data: requirements, loading, refresh } = useRequest(
    () => requirementsApi.getRequirementsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 获取迭代列表（用于需求关联）
  const { data: iterations } = useRequest(
    () => iterationsApi.getIterationsByProjectId(Number(projectId)),
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
        iteration_id: requirement.iteration_id,
        start_time: requirement.start_time ? requirement.start_time.split('T')[0] : undefined,
        end_time: requirement.end_time ? requirement.end_time.split('T')[0] : undefined,
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
      // 使用当前用户的id作为负责人
      const userId = userInfo?.id || null

      if (editingRequirement) {
        updateRequirement(editingRequirement.id, {
          ...values,
          assigned_to: userId,
        })
      }
      else {
        createRequirement({
          ...values,
          project_id: Number(projectId),
          creator_id: userId,
          assigned_to: userId,
          created_at: new Date().toISOString(),
        })
      }
    })
  }

  const handleRowClick = (record: Tables<'requirements'>) => {
    setSelectedRequirement(record)
    setIsDetailVisible(true)

    // 更新 URL，但不触发页面刷新
    const newUrl = `${location.pathname}?id=${record.id}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleDetailClose = () => {
    setIsDetailVisible(false)
    setSelectedRequirement(null)

    // 移除 URL 中的参数
    const newUrl = location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleViewDetail = (e: React.MouseEvent, record: Tables<'requirements'>) => {
    e.stopPropagation()
    navigate(`/project/${projectId}/requirements?id=${record.id}`)
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
      width: 180,
      render: (_: any, record: Tables<'requirements'>) => (
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
        onRow={record => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Modal
        title={editingRequirement ? '编辑需求' : '创建需求'}
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
            name="iteration_id"
            label="关联迭代"
          >
            <Select placeholder="请选择关联迭代" allowClear>
              {iterations?.map(iter => (
                <Option key={iter.id} value={iter.id}>
                  {new Date(iter.start_date).toLocaleDateString()}
                  {' '}
                  -
                  {new Date(iter.end_date).toLocaleDateString()}
                </Option>
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

      {/* 需求详情抽屉 */}
      <WorkItemDetailDrawer
        visible={isDetailVisible}
        onClose={handleDetailClose}
        workItem={selectedRequirement}
        itemType="requirement"
      />
    </div>
  )
}
