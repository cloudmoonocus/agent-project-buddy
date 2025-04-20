import type { Tables } from '@/types/supabase'
import type { WorkItemType } from './WorkitemTable'
import useUserStore from '@/store/userStore'
import { DatePicker, Form, Input, Modal, Select } from 'antd'
import React, { useEffect } from 'react'

const { TextArea } = Input
const { Option } = Select

export type WorkItemForEdit =
  | Tables<'requirements'>
  | Tables<'tasks'>
  | Tables<'defects'>
  | null

interface CreateWorkitemProps {
  visible: boolean
  title: string
  itemType: WorkItemType
  projectId: number
  editingItem: WorkItemForEdit
  relatedItems?: any[] // 关联项，如任务的需求、需求和缺陷的迭代
  onCancel: () => void
  onSubmit: (values: any) => void
  createLoading?: boolean
  updateLoading?: boolean
}

export const CreateWorkitem: React.FC<CreateWorkitemProps> = ({
  visible,
  title,
  itemType,
  projectId,
  editingItem,
  relatedItems,
  onCancel,
  onSubmit,
  createLoading,
  updateLoading,
}) => {
  const [form] = Form.useForm()
  const { userInfo } = useUserStore()
  const loading = createLoading || updateLoading

  useEffect(() => {
    if (editingItem) {
      // 根据不同工作项类型设置表单字段
      const commonFields = {
        title: editingItem.title,
        description: editingItem.description,
        status: editingItem.status,
        start_time: editingItem.start_time ? editingItem.start_time.split('T')[0] : undefined,
        end_time: editingItem.end_time ? editingItem.end_time.split('T')[0] : undefined,
      }

      if (itemType === 'requirement') {
        const requirement = editingItem as Tables<'requirements'>
        form.setFieldsValue({
          ...commonFields,
          priority: requirement.priority,
          iteration_id: requirement.iteration_id,
        })
      }
      else if (itemType === 'task') {
        const task = editingItem as Tables<'tasks'>
        form.setFieldsValue({
          ...commonFields,
          priority: task.priority,
          requirement_id: task.requirement_id,
        })
      }
      else if (itemType === 'defect') {
        const defect = editingItem as Tables<'defects'>
        form.setFieldsValue({
          ...commonFields,
          blocking_level: defect.blocking_level,
          iteration_id: defect.iteration_id,
        })
      }
    }
    else {
      form.resetFields()
    }
  }, [form, editingItem, itemType])

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      // 使用当前用户的id作为负责人
      const userId = userInfo?.id || null

      const commonFields = {
        project_id: projectId,
        creator_id: userId,
        assigned_to: userId,
        created_at: new Date().toISOString(),
      }

      onSubmit(editingItem ? values : { ...values, ...commonFields })
    })
  }

  // 根据工作项类型返回特定的表单字段
  const renderTypeSpecificFields = () => {
    if (itemType === 'requirement') {
      return (
        <>
          <Form.Item
            label="优先级"
            name="priority"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>

          {relatedItems && (
            <Form.Item label="关联迭代" name="iteration_id">
              <Select placeholder="请选择迭代" allowClear>
                {relatedItems.map(iteration => (
                  <Option key={iteration.id} value={iteration.id}>
                    {iteration.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </>
      )
    }
    else if (itemType === 'task') {
      return (
        <>
          <Form.Item
            label="优先级"
            name="priority"
            rules={[{ required: true, message: '请选择优先级' }]}
          >
            <Select placeholder="请选择优先级">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>

          {relatedItems && (
            <Form.Item label="关联需求" name="requirement_id">
              <Select placeholder="请选择需求" allowClear>
                {relatedItems.map(req => (
                  <Option key={req.id} value={req.id}>
                    #
                    {req.id}
                    {' '}
                    {req.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </>
      )
    }
    else if (itemType === 'defect') {
      return (
        <>
          <Form.Item
            label="阻塞级别"
            name="blocking_level"
            rules={[{ required: true, message: '请选择阻塞级别' }]}
          >
            <Select placeholder="请选择阻塞级别">
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
              <Option value="none">无</Option>
            </Select>
          </Form.Item>

          {relatedItems && (
            <Form.Item label="关联迭代" name="iteration_id">
              <Select placeholder="请选择迭代" allowClear>
                {relatedItems.map(iteration => (
                  <Option key={iteration.id} value={iteration.id}>
                    {iteration.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </>
      )
    }
    return null
  }

  // 根据工作项类型获取状态选项
  const getStatusOptions = () => {
    if (itemType === 'defect') {
      return (
        <>
          <Option value="open">待修复</Option>
          <Option value="in_progress">修复中</Option>
          <Option value="closed">已修复</Option>
        </>
      )
    }
    return (
      <>
        <Option value="open">待开始</Option>
        <Option value="in_progress">进行中</Option>
        <Option value="closed">已完成</Option>
      </>
    )
  }

  return (
    <Modal
      title={`${editingItem ? '编辑' : '创建'}${title}`}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'open',
          priority: 'medium',
          blocking_level: 'medium',
        }}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder={`请输入${title}标题`} />
        </Form.Item>

        <Form.Item label="描述" name="description">
          <TextArea rows={4} placeholder={`请输入${title}描述`} />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态">
            {getStatusOptions()}
          </Select>
        </Form.Item>

        {renderTypeSpecificFields()}

        <Form.Item label="开始时间" name="start_time">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="结束时间" name="end_time">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
