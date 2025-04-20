import type { Tables, TablesInsert } from '@/types/supabase'
import { iterationsApi, requirementsApi } from '@/api'
import { CreateWorkitem } from '@/components/workitem/CreateWorkitem'
import { WorkitemTable } from '@/components/workitem/WorkitemTable'
import useUserStore from '@/store/userStore'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export const Requirements: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState<Tables<'requirements'> | null>(null)
  const { userInfo } = useUserStore()

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
        setEditingRequirement(null)
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新需求
  const { run: updateRequirement, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Omit<Tables<'requirements'>, 'id'>>) => requirementsApi.updateRequirement(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('需求更新成功')
        setIsModalVisible(false)
        setEditingRequirement(null)
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
    }
    else {
      setEditingRequirement(null)
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingRequirement(null)
  }

  const handleSubmit = (values: any) => {
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
  }

  // 获取需求详情
  const getRequirementById = async (id: number) => {
    try {
      return await requirementsApi.getRequirementById(id)
    }
    catch (error) {
      message.error(`获取需求详情失败: ${(error as Error).message}`)
      throw error
    }
  }

  // 直接在表格中更新需求
  const handleItemUpdate = (id: number, values: any) => {
    updateRequirement(id, values)
  }

  return (
    <>
      <WorkitemTable
        title="需求"
        projectId={projectId || ''}
        itemType="requirement"
        items={requirements}
        loading={loading}
        relatedItems={iterations}
        onCreateItem={() => showModal()}
        onItemUpdate={handleItemUpdate}
        getItemById={getRequirementById}
      />

      <CreateWorkitem
        visible={isModalVisible}
        title="需求"
        itemType="requirement"
        projectId={Number(projectId)}
        editingItem={editingRequirement}
        relatedItems={iterations}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        createLoading={createLoading}
        updateLoading={updateLoading}
      />
    </>
  )
}
