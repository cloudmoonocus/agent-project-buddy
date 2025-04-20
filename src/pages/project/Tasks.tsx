import type { Tables, TablesInsert } from '@/types/supabase'
import { requirementsApi, tasksApi } from '@/api'
import { CreateWorkitem } from '@/components/workitem/CreateWorkitem'
import { WorkitemTable } from '@/components/workitem/WorkitemTable'
import useUserStore from '@/store/userStore'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export const Tasks: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingTask, setEditingTask] = useState<Tables<'tasks'> | null>(null)
  const { userInfo } = useUserStore()

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
        setEditingTask(null)
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新任务
  const { run: updateTask, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Omit<Tables<'tasks'>, 'id'>>) => tasksApi.updateTask(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('任务更新成功')
        setIsModalVisible(false)
        setEditingTask(null)
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
    }
    else {
      setEditingTask(null)
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingTask(null)
  }

  const handleSubmit = (values: any) => {
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
  }

  // 获取任务详情
  const getTaskById = async (id: number) => {
    try {
      return await tasksApi.getTaskById(id)
    }
    catch (error) {
      message.error(`获取任务详情失败: ${(error as Error).message}`)
      throw error
    }
  }

  // 直接在表格中更新任务
  const handleItemUpdate = (id: number, values: any) => {
    updateTask(id, values)
  }

  return (
    <>
      <WorkitemTable
        title="任务"
        projectId={projectId || ''}
        itemType="task"
        items={tasks}
        loading={loading}
        relatedItems={requirements}
        onCreateItem={() => showModal()}
        onItemUpdate={handleItemUpdate}
        getItemById={getTaskById}
      />

      <CreateWorkitem
        visible={isModalVisible}
        title="任务"
        itemType="task"
        projectId={Number(projectId)}
        editingItem={editingTask}
        relatedItems={requirements}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        createLoading={createLoading}
        updateLoading={updateLoading}
      />
    </>
  )
}
