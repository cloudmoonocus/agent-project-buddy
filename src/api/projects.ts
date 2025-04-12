import type { TablesInsert, TablesUpdate } from '../types/supabase'
import supabase from '../utils/supabaseClient'

// 获取所有项目
export async function getAllProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')

  if (error) {
    throw error
  }

  return data
}

// 获取单个项目
export async function getProjectById(id: number) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}

// 创建项目
export async function createProject(project: TablesInsert<'projects'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 更新项目
export async function updateProject(id: number, updates: TablesUpdate<'projects'>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 删除项目
export async function deleteProject(id: number) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

// 获取项目及其所有相关数据
export async function getProjectWithRelations(id: number) {
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError) {
    throw projectError
  }

  const { data: requirements, error: requirementsError } = await supabase
    .from('requirements')
    .select('*')
    .eq('project_id', id)

  if (requirementsError) {
    throw requirementsError
  }

  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', id)

  if (tasksError) {
    throw tasksError
  }

  const { data: defects, error: defectsError } = await supabase
    .from('defects')
    .select('*')
    .eq('project_id', id)

  if (defectsError) {
    throw defectsError
  }

  const { data: iterations, error: iterationsError } = await supabase
    .from('iterations')
    .select('*')
    .eq('project_id', id)

  if (iterationsError) {
    throw iterationsError
  }

  return {
    ...project,
    requirements,
    tasks,
    defects,
    iterations,
  }
}
