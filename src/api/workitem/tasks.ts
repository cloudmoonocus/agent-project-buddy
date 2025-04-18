import type { Tables, TablesInsert, TablesUpdate } from '../../types/supabase.ts'
import supabase from '../../utils/supabaseClient.ts'

// 获取所有任务
export async function getAllTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, projects(*), requirements(*)')

  if (error) {
    throw error
  }

  return data
}

// 获取单个任务
export async function getTaskById(id: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, projects(*), requirements(*)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

// 创建任务
export async function createTask(task: TablesInsert<'tasks'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 更新任务
export async function updateTask(id: number, updates: TablesUpdate<'tasks'>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 删除任务
export async function deleteTask(id: number) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// 获取项目的所有任务
export async function getTasksByProjectId(projectId: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, requirements(*)')
    .eq('project_id', projectId)

  if (error) {
    throw error
  }

  return data
}

// 按状态获取任务
export async function getTasksByStatus(status: Tables<'tasks'>['status']) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*, projects(*), requirements(*)')
    .eq('status', status)

  if (error) {
    throw error
  }

  return data
}

// 获取迭代中的所有任务
export async function getTasksByIterationId(iterationId: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('iteration_id', iterationId)

  if (error) {
    throw error
  }

  return data
}
