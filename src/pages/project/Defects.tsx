import type { Tables, TablesInsert } from '../../types/supabase'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import { Badge, Button, Form, Input, message, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { defectsApi, iterationsApi } from '../../api'
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

export const Defects: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [editingDefect, setEditingDefect] = useState<Tables<'defects'> | null>(null)
  const [selectedDefect, setSelectedDefect] = useState<Tables<'defects'> | null>(null)
  const [form] = Form.useForm()
  const { userInfo } = useUserStore()

  // 检查 URL 参数中是否有缺陷 ID
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const defectId = searchParams.get('id')

    if (defectId) {
      defectsApi.getDefectById(Number(defectId))
        .then((data) => {
          setSelectedDefect(data)
          setIsDetailVisible(true)
        })
        .catch((error) => {
          message.error(`获取缺陷详情失败: ${error.message}`)
        })
    }
  }, [location.search])

  // 获取缺陷列表
  const { data: defects, loading, refresh } = useRequest(
    () => defectsApi.getDefectsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 获取迭代列表（用于缺陷关联）
  const { data: iterations } = useRequest(
    () => iterationsApi.getIterationsByProjectId(Number(projectId)),
    {
      refreshDeps: [projectId],
    },
  )

  // 创建缺陷
  const { run: createDefect, loading: createLoading } = useRequest(
    (values: TablesInsert<'defects'>) => defectsApi.createDefect(values),
    {
      manual: true,
      onSuccess: () => {
        message.success('缺陷创建成功')
        setIsModalVisible(false)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新缺陷
  const { run: updateDefect, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Tables<'defects'>>) => defectsApi.updateDefect(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('缺陷更新成功')
        setIsModalVisible(false)
        setEditingDefect(null)
        form.resetFields()
        refresh()
      },
      onError: (error) => {
        message.error(`更新失败: ${error.message}`)
      },
    },
  )

  const showModal = (defect?: Tables<'defects'>) => {
    if (defect) {
      setEditingDefect(defect)
      form.setFieldsValue({
        title: defect.title,
        description: defect.description,
        blocking_level: defect.blocking_level,
        status: defect.status,
        iteration_id: defect.iteration_id,
        start_time: defect.start_time ? defect.start_time.split('T')[0] : undefined,
        end_time: defect.end_time ? defect.end_time.split('T')[0] : undefined,
      })
    }
    else {
      setEditingDefect(null)
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingDefect(null)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // 使用当前用户的id作为负责人
      const userId = userInfo?.id || null

      if (editingDefect) {
        updateDefect(editingDefect.id, {
          ...values,
          assigned_to: userId,
        })
      }
      else {
        createDefect({
          ...values,
          project_id: Number(projectId),
          creator_id: userId,
          assigned_to: userId,
          created_at: new Date().toISOString(),
        })
      }
    })
  }

  const handleRowClick = (record: Tables<'defects'>) => {
    setSelectedDefect(record)
    setIsDetailVisible(true)

    // 更新 URL，但不触发页面刷新
    const newUrl = `${location.pathname}?id=${record.id}`
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleDetailClose = () => {
    setIsDetailVisible(false)
    setSelectedDefect(null)

    // 移除 URL 中的参数
    const newUrl = location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleViewDetail = (e: React.MouseEvent, record: Tables<'defects'>) => {
    e.stopPropagation()
    navigate(`/project/${projectId}/defects?id=${record.id}`)
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
      title: '阻塞级别',
      dataIndex: 'blocking_level',
      key: 'blocking_level',
      width: 120,
      render: (level: Tables<'defects'>['blocking_level']) => {
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
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Tables<'defects'>['status']) => {
        let statusType: 'error' | 'processing' | 'success' | 'default' = 'default'
        let text = ''

        if (status === 'open') {
          statusType = 'error'
          text = '待修复'
        }
        else if (status === 'in_progress') {
          statusType = 'processing'
          text = '修复中'
        }
        else if (status === 'closed') {
          statusType = 'success'
          text = '已修复'
        }

        return <Badge status={statusType} text={text} />
      },
    },
    {
      title: '关联迭代',
      dataIndex: 'iteration_id',
      key: 'iteration_id',
      width: 120,
      render: (iterationId: number | null) => {
        if (!iterationId)
          return '-'
        const iteration = iterations?.find(i => i.id === iterationId)
        return iteration
          ? `${new Date(iteration.start_date).toLocaleDateString()} - ${new Date(iteration.end_date).toLocaleDateString()}`
          : iterationId
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_: any, record: Tables<'defects'>) => (
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
        <Title level={3}>缺陷列表</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          报告缺陷
        </Button>
      </PageHeader>

      <StyledTable
        columns={columns}
        dataSource={defects}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        onRow={record => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Modal
        title={editingDefect ? '编辑缺陷' : '报告缺陷'}
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
            rules={[{ required: true, message: '请输入缺陷标题' }]}
          >
            <Input placeholder="请输入缺陷标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea rows={4} placeholder="请输入缺陷描述" />
          </Form.Item>

          <Form.Item
            name="blocking_level"
            label="阻塞级别"
            rules={[{ required: true, message: '请选择阻塞级别' }]}
            initialValue="none"
          >
            <Select placeholder="请选择阻塞级别">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
              <Option value="none">无</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
            initialValue="open"
          >
            <Select placeholder="请选择状态">
              <Option value="open">待修复</Option>
              <Option value="in_progress">修复中</Option>
              <Option value="closed">已修复</Option>
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

      {/* 缺陷详情抽屉 */}
      <WorkItemDetailDrawer
        visible={isDetailVisible}
        onClose={handleDetailClose}
        workItem={selectedDefect}
        itemType="defect"
      />
    </div>
  )
}
