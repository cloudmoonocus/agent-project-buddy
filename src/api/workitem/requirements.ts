import type { TablesInsert, TablesUpdate } from '@/types/supabase.ts'
import supabase from '@/utils/supabaseClient.ts'

// 获取所有需求
export async function getAllRequirements() {
  const { data, error } = await supabase
    .from('requirements')
    .select('*, projects(*)')

  if (error) {
    throw error
  }

  return data
}

// 获取单个需求
export async function getRequirementById(id: number) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*, projects(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

// 创建需求
export async function createRequirement(requirement: TablesInsert<'requirements'>) {
  const { data, error } = await supabase
    .from('requirements')
    .insert(requirement)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 更新需求
export async function updateRequirement(id: number, updates: TablesUpdate<'requirements'>) {
  const { data, error } = await supabase
    .from('requirements')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 删除需求
export async function deleteRequirement(id: number) {
  const { error } = await supabase
    .from('requirements')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// 获取项目的所有需求
export async function getRequirementsByProjectId(projectId: number) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('project_id', projectId)

  if (error) {
    throw error
  }

  return data
}

// 获取需求相关的任务
export async function getTasksByRequirementId(requirementId: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('requirement_id', requirementId)

  if (error) {
    throw error
  }

  return data
}

// 获取迭代的所有需求
export async function getRequirementsByIterationId(iterationId: number) {
  const { data, error } = await supabase
    .from('requirements')
    .select('*')
    .eq('iteration_id', iterationId)

  if (error) {
    throw error
  }

  return data
}
