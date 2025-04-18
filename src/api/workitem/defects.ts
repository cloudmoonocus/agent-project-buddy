import type { Tables, TablesInsert, TablesUpdate } from '@/types/supabase.ts'
import supabase from '@/utils/supabaseClient.ts'

// 获取所有缺陷
export async function getAllDefects() {
  const { data, error } = await supabase
    .from('defects')
    .select('*, projects(*)')

  if (error) {
    throw error
  }

  return data
}

// 获取单个缺陷
export async function getDefectById(id: number) {
  const { data, error } = await supabase
    .from('defects')
    .select('*, projects(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

// 创建缺陷
export async function createDefect(defect: TablesInsert<'defects'>) {
  const { data, error } = await supabase
    .from('defects')
    .insert(defect)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 更新缺陷
export async function updateDefect(id: number, updates: TablesUpdate<'defects'>) {
  const { data, error } = await supabase
    .from('defects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 删除缺陷
export async function deleteDefect(id: number) {
  const { error } = await supabase
    .from('defects')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// 获取项目的所有缺陷
export async function getDefectsByProjectId(projectId: number) {
  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .eq('project_id', projectId)

  if (error) {
    throw error
  }

  return data
}

// 按状态获取缺陷
export async function getDefectsByStatus(status: Tables<'defects'>['status']) {
  const { data, error } = await supabase
    .from('defects')
    .select('*, projects(*)')
    .eq('status', status)

  if (error) {
    throw error
  }

  return data
}

// 获取迭代中的所有缺陷
export async function getDefectsByIterationId(iterationId: number) {
  const { data, error } = await supabase
    .from('defects')
    .select('*')
    .eq('iteration_id', iterationId)

  if (error) {
    throw error
  }

  return data
}
