import type { Tables, TablesInsert } from '@/types/supabase'
import { defectsApi, iterationsApi } from '@/api'
import { CreateWorkitem } from '@/components/workitem/CreateWorkitem'
import { WorkitemTable } from '@/components/workitem/WorkitemTable'
import useUserStore from '@/store/userStore'
import { useRequest } from 'ahooks'
import { message } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

export const Defects: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDefect, setEditingDefect] = useState<Tables<'defects'> | null>(null)
  const { userInfo } = useUserStore()

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
        setEditingDefect(null)
        refresh()
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  // 更新缺陷
  const { run: updateDefect, loading: updateLoading } = useRequest(
    (id: number, values: Partial<Omit<Tables<'defects'>, 'id'>>) => defectsApi.updateDefect(id, values),
    {
      manual: true,
      onSuccess: () => {
        message.success('缺陷更新成功')
        setIsModalVisible(false)
        setEditingDefect(null)
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
    }
    else {
      setEditingDefect(null)
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    setEditingDefect(null)
  }

  const handleSubmit = (values: any) => {
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
  }

  // 获取缺陷详情
  const getDefectById = async (id: number) => {
    try {
      return await defectsApi.getDefectById(id)
    }
    catch (error) {
      message.error(`获取缺陷详情失败: ${(error as Error).message}`)
      throw error
    }
  }

  // 直接在表格中更新缺陷
  const handleItemUpdate = (id: number, values: any) => {
    updateDefect(id, values)
  }

  return (
    <>
      <WorkitemTable
        title="缺陷"
        projectId={projectId || ''}
        itemType="defect"
        items={defects}
        loading={loading}
        relatedItems={iterations}
        onCreateItem={() => showModal()}
        onItemUpdate={handleItemUpdate}
        getItemById={getDefectById}
      />

      <CreateWorkitem
        visible={isModalVisible}
        title="缺陷"
        itemType="defect"
        projectId={Number(projectId)}
        editingItem={editingDefect}
        relatedItems={iterations}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        createLoading={createLoading}
        updateLoading={updateLoading}
      />
    </>
  )
}
