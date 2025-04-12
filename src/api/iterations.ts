import type { TablesInsert, TablesUpdate } from '../types/supabase'
import supabase from '../utils/supabaseClient'

// 获取所有迭代
export async function getAllIterations() {
  const { data, error } = await supabase
    .from('iterations')
    .select('*, projects(*)')

  if (error) {
    throw error
  }

  return data
}

// 获取单个迭代
export async function getIterationById(id: number) {
  const { data, error } = await supabase
    .from('iterations')
    .select('*, projects(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

// 创建迭代
export async function createIteration(iteration: TablesInsert<'iterations'>) {
  const { data, error } = await supabase
    .from('iterations')
    .insert(iteration)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 更新迭代
export async function updateIteration(id: number, updates: TablesUpdate<'iterations'>) {
  const { data, error } = await supabase
    .from('iterations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 删除迭代
export async function deleteIteration(id: number) {
  const { error } = await supabase
    .from('iterations')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// 获取项目的所有迭代
export async function getIterationsByProjectId(projectId: number) {
  const { data, error } = await supabase
    .from('iterations')
    .select('*')
    .eq('project_id', projectId)

  if (error) {
    throw error
  }

  return data
}

// 获取当前活跃的迭代（当前日期在开始和结束日期之间）
export async function getCurrentIterations() {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('iterations')
    .select('*, projects(*)')
    .lte('start_date', today)
    .gte('end_date', today)

  if (error) {
    throw error
  }

  return data
}
