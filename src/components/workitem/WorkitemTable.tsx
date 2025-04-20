import type { Tables } from '@/types/supabase'
import type { ColumnsType } from 'antd/es/table'
import { TextOverTooltip } from '@/components/common/TextOverTooltip'
import { WorkItemDetailDrawer } from '@/components/workitem/WorkItemDetailDrawer'
import { CheckOutlined, CloseOutlined, EditOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Badge, Button, DatePicker, Form, Input, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

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

  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 4px 11px;
  }
`

export type WorkItemType = 'requirement' | 'task' | 'defect'

export type WorkItem = Tables<'requirements'> | Tables<'tasks'> | Tables<'defects'>

// 扩展列类型，添加editable属性
interface EditableColumn extends Omit<ColumnsType<WorkItem>[number], 'editable'> {
  editable?: boolean
  dataIndex?: string
}

interface WorkitemTableProps {
  title: string
  projectId: string
  itemType: WorkItemType
  items: WorkItem[] | undefined
  loading: boolean
  relatedItems?: any[] // 关联项，如任务的需求、需求和缺陷的迭代
  onCreateItem: () => void
  onItemUpdate: (id: number, values: any) => void
  getItemById: (id: number) => Promise<WorkItem>
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  record: WorkItem
  index: number
  children: React.ReactNode
  inputType: 'text' | 'textarea' | 'select' | 'date'
  options?: Array<{ label: string, value: string | number }>
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  ...restProps
}) => {
  let inputNode

  switch (inputType) {
    case 'textarea':
      inputNode = <TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
      break
    case 'select':
      inputNode = (
        <Select style={{ width: '100%' }}>
          {options?.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )
      break
    case 'date':
      inputNode = <DatePicker style={{ width: '100%' }} />
      break
    default:
      inputNode = <Input />
  }

  return (
    <td {...restProps}>
      {editing
        ? (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[
                {
                  required: ['title', 'status'].includes(dataIndex),
                  message: `请输入${title}!`,
                },
              ]}
            >
              {inputNode}
            </Form.Item>
          )
        : (
            <div className="editable-cell-value-wrap">
              {children}
            </div>
          )}
    </td>
  )
}

export const WorkitemTable: React.FC<WorkitemTableProps> = ({
  title,
  projectId,
  itemType,
  items,
  loading,
  relatedItems,
  onCreateItem,
  onItemUpdate,
  getItemById,
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WorkItem | null>(null)
  const [editingKey, setEditingKey] = useState<number | null>(null)
  const [form] = Form.useForm()
  const [columns, setColumns] = useState<any[]>([])

  const isEditing = (record: WorkItem) => record.id === editingKey

  // 检查 URL 参数中是否有工作项 ID
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const itemId = searchParams.get('id')

    if (itemId) {
      getItemById(Number(itemId))
        .then((data) => {
          setSelectedItem(data)
          setIsDetailVisible(true)
        })
        .catch((error) => {
          console.error(`获取${title}详情失败:`, error)
        })
    }
  }, [location.search, title, getItemById])

  const handleDetailClose = () => {
    setIsDetailVisible(false)
    setSelectedItem(null)

    // 移除 URL 中的参数
    const newUrl = location.pathname
    window.history.pushState({ path: newUrl }, '', newUrl)
  }

  const handleViewDetail = (e: React.MouseEvent, record: WorkItem) => {
    e.stopPropagation()
    navigate(`/project/${projectId}/${itemType}s?id=${record.id}`)
  }

  const edit = (record: WorkItem) => {
    form.setFieldsValue({
      title: record.title,
      status: record.status,
      description: record.description,
      ...(itemType === 'requirement' && { priority: (record as any).priority }),
      ...(itemType === 'task' && {
        priority: (record as any).priority,
        requirement_id: (record as any).requirement_id,
      }),
      ...(itemType === 'defect' && {
        blocking_level: (record as any).blocking_level,
        iteration_id: (record as any).iteration_id,
      }),
    })
    setEditingKey(record.id)
  }

  const cancel = () => {
    setEditingKey(null)
  }

  const save = async (record: WorkItem) => {
    try {
      const row = await form.validateFields()
      onItemUpdate(record.id, row)
      setEditingKey(null)
    }
    catch {
      // 验证失败时的错误处理
    }
  }

  // 构建表格列
  useEffect(() => {
    // 可编辑操作列
    const actionColumn: EditableColumn = {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: WorkItem) => {
        const editable = isEditing(record)
        return editable
          ? (
              <Space>
                <Popconfirm title="确定保存?" onConfirm={() => save(record)}>
                  <Button type="text" icon={<SaveOutlined />} />
                </Popconfirm>
                <Button onClick={cancel} type="text" icon={<CloseOutlined />} />
              </Space>
            )
          : (
              <Space>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    edit(record)
                  }}
                  disabled={editingKey !== null}
                />
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={e => handleViewDetail(e, record)}
                />
              </Space>
            )
      },
    }

    // 通用列
    const baseColumns: EditableColumn[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 60,
        render: (id: number) => <TextOverTooltip text={id} />,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        width: 150,
        editable: true,
        render: (text: string) => <TextOverTooltip text={text} />,
      },
      {
        title: '负责人',
        dataIndex: 'assigned_to',
        key: 'assigned_to',
        width: 100,
        render: (assignedTo: string | null) => <TextOverTooltip text={assignedTo || '-'} />,
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 150,
        render: (date: string) => <TextOverTooltip text={date ? new Date(date).toLocaleString() : '-'} />,
      },
    ]

    // 根据工作项类型添加特定列
    let typeSpecificColumns: EditableColumn[] = []

    if (itemType === 'requirement') {
      typeSpecificColumns = [
        {
          title: '优先级',
          dataIndex: 'priority',
          key: 'priority',
          width: 80,
          editable: true,
          render: (priority: string) => {
            const color = priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'
            const text = priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'
            return <Tag color={color}>{text}</Tag>
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          editable: true,
          render: (status: string) => {
            const color = status === 'closed' ? 'green' : status === 'in_progress' ? 'blue' : 'gold'
            const text = status === 'closed' ? '已完成' : status === 'in_progress' ? '进行中' : '待开始'
            return <Tag color={color}>{text}</Tag>
          },
        },
      ]
    }
    else if (itemType === 'task') {
      typeSpecificColumns = [
        {
          title: '优先级',
          dataIndex: 'priority',
          key: 'priority',
          width: 80,
          editable: true,
          render: (priority: string) => {
            const color = priority === 'high' ? 'red' : priority === 'medium' ? 'orange' : 'green'
            const text = priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'
            return <Tag color={color}>{text}</Tag>
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          editable: true,
          render: (status: string) => {
            const color = status === 'closed' ? 'green' : status === 'in_progress' ? 'blue' : 'gold'
            const text = status === 'closed' ? '已完成' : status === 'in_progress' ? '进行中' : '待开始'
            return <Tag color={color}>{text}</Tag>
          },
        },
        {
          title: '关联需求',
          dataIndex: 'requirement_id',
          key: 'requirement_id',
          width: 120,
          editable: true,
          render: (requirementId: number | null) => {
            if (!requirementId || !relatedItems)
              return <TextOverTooltip text="-" />
            const requirement = relatedItems.find(r => r.id === requirementId)
            return requirement
              ? (
                  <TextOverTooltip text={`#${requirement.id} ${requirement.title}`} />
                )
              : <TextOverTooltip text="-" />
          },
        },
      ]
    }
    else if (itemType === 'defect') {
      typeSpecificColumns = [
        {
          title: '阻塞级别',
          dataIndex: 'blocking_level',
          key: 'blocking_level',
          width: 100,
          editable: true,
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
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
          editable: true,
          render: (status: string) => {
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
          editable: true,
          render: (iterationId: number | null) => {
            if (!iterationId || !relatedItems)
              return <TextOverTooltip text="-" />
            const iteration = relatedItems.find(i => i.id === iterationId)
            return iteration
              ? (
                  <TextOverTooltip text={iteration.name} />
                )
              : <TextOverTooltip text="-" />
          },
        },
      ]
    }

    // 构建最终的列配置
    const mergedColumns = [
      ...baseColumns.slice(0, 2),
      ...typeSpecificColumns,
      ...baseColumns.slice(2),
      actionColumn,
    ].map((col) => {
      if (!col.editable) {
        return col
      }

      // 设置表单选项
      let options
      let inputType: 'text' | 'textarea' | 'select' | 'date' = 'text'

      if (col.dataIndex === 'status') {
        inputType = 'select'
        if (itemType === 'defect') {
          options = [
            { label: '待修复', value: 'open' },
            { label: '修复中', value: 'in_progress' },
            { label: '已修复', value: 'closed' },
          ]
        }
        else {
          options = [
            { label: '待开始', value: 'open' },
            { label: '进行中', value: 'in_progress' },
            { label: '已完成', value: 'closed' },
          ]
        }
      }
      else if (col.dataIndex === 'priority') {
        inputType = 'select'
        options = [
          { label: '高', value: 'high' },
          { label: '中', value: 'medium' },
          { label: '低', value: 'low' },
        ]
      }
      else if (col.dataIndex === 'blocking_level') {
        inputType = 'select'
        options = [
          { label: '高', value: 'high' },
          { label: '中', value: 'medium' },
          { label: '低', value: 'low' },
          { label: '无', value: 'none' },
        ]
      }
      else if (col.dataIndex === 'requirement_id' && relatedItems) {
        inputType = 'select'
        options = relatedItems.map(req => ({
          label: `#${req.id} ${req.title}`,
          value: req.id,
        }))
      }
      else if (col.dataIndex === 'iteration_id' && relatedItems) {
        inputType = 'select'
        options = relatedItems.map(iter => ({
          label: iter.name,
          value: iter.id,
        }))
      }
      else if (col.dataIndex === 'description') {
        inputType = 'textarea'
      }

      return {
        ...col,
        onCell: (record: WorkItem) => ({
          record,
          dataIndex: col.dataIndex as string,
          title: col.title,
          editing: isEditing(record),
          inputType,
          options,
        }),
      }
    })

    setColumns(mergedColumns)
  }, [itemType, editingKey, relatedItems, projectId])

  const components = {
    body: {
      cell: EditableCell,
    },
  }

  // 行点击处理函数修改，双击行启用编辑
  const handleRowClick = (record: WorkItem) => {
    if (editingKey === null) {
      navigate(`/project/${projectId}/${itemType}s?id=${record.id}`)
    }
  }

  const handleRowDoubleClick = (record: WorkItem) => {
    if (editingKey === null) {
      edit(record)
    }
  }

  return (
    <div>
      <PageHeader>
        <Title level={3}>{title}</Title>
        <Button type="primary" icon={<span>+</span>} onClick={onCreateItem}>
          创建
          {title}
        </Button>
      </PageHeader>

      <Form form={form} component={false}>
        <StyledTable
          components={components}
          columns={columns}
          dataSource={items}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          rowClassName="editable-row"
          onRow={record => ({
            onClick: () => handleRowClick(record as WorkItem),
            onDoubleClick: () => handleRowDoubleClick(record as WorkItem),
          })}
        />
      </Form>

      <WorkItemDetailDrawer
        visible={isDetailVisible}
        onClose={handleDetailClose}
        workItem={selectedItem}
        itemType={itemType}
      />
    </div>
  )
}
