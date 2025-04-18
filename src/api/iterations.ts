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
    .insert({
      ...iteration,
      is_locked: false, // 默认未锁定
    })
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

// 锁定迭代
export async function lockIteration(id: number) {
  const { data, error } = await supabase
    .from('iterations')
    .update({ is_locked: true })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 解锁迭代
export async function unlockIteration(id: number) {
  const { data, error } = await supabase
    .from('iterations')
    .update({ is_locked: false })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 获取未分配迭代的工作项
export async function getUnassignedWorkItems(projectId: number) {
  // 获取未分配迭代的需求
  const { data: requirements, error: reqError } = await supabase
    .from('requirements')
    .select('*')
    .eq('project_id', projectId)
    .is('iteration_id', null)

  if (reqError) {
    throw reqError
  }

  // 获取未分配迭代的任务
  const { data: tasks, error: taskError } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .is('iteration_id', null)

  if (taskError) {
    throw taskError
  }

  // 获取未分配迭代的缺陷
  const { data: defects, error: defectError } = await supabase
    .from('defects')
    .select('*')
    .eq('project_id', projectId)
    .is('iteration_id', null)

  if (defectError) {
    throw defectError
  }

  return {
    requirements: requirements || [],
    tasks: tasks || [],
    defects: defects || [],
  }
}

// 将工作项分配到迭代
export async function assignWorkItemsToIteration(
  iterationId: number,
  items: {
    requirements?: number[]
    tasks?: number[]
    defects?: number[]
  },
) {
  const { requirements = [], tasks = [], defects = [] } = items

  // 检查迭代是否已锁定
  const { data: iteration, error: iterError } = await supabase
    .from('iterations')
    .select('is_locked')
    .eq('id', iterationId)
    .single()

  if (iterError) {
    throw iterError
  }

  if (iteration.is_locked) {
    throw new Error('迭代已锁定，无法添加工作项')
  }

  const results = {
    requirements: null as any,
    tasks: null as any,
    defects: null as any,
  }

  // 批量更新需求
  if (requirements.length > 0) {
    const { data, error } = await supabase
      .from('requirements')
      .update({ iteration_id: iterationId })
      .in('id', requirements)
      .select()

    if (error) {
      throw error
    }
    results.requirements = data
  }

  // 批量更新任务
  if (tasks.length > 0) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ iteration_id: iterationId })
      .in('id', tasks)
      .select()

    if (error) {
      throw error
    }
    results.tasks = data
  }

  // 批量更新缺陷
  if (defects.length > 0) {
    const { data, error } = await supabase
      .from('defects')
      .update({ iteration_id: iterationId })
      .in('id', defects)
      .select()

    if (error) {
      throw error
    }
    results.defects = data
  }

  return results
}

// 从迭代中移除工作项
export async function removeWorkItemsFromIteration(
  iterationId: number,
  items: {
    requirements?: number[]
    tasks?: number[]
    defects?: number[]
  },
) {
  const { requirements = [], tasks = [], defects = [] } = items

  // 检查迭代是否已锁定
  const { data: iteration, error: iterError } = await supabase
    .from('iterations')
    .select('is_locked')
    .eq('id', iterationId)
    .single()

  if (iterError) {
    throw iterError
  }

  if (iteration.is_locked) {
    throw new Error('迭代已锁定，无法移除工作项')
  }

  const results = {
    requirements: null as any,
    tasks: null as any,
    defects: null as any,
  }

  // 批量更新需求
  if (requirements.length > 0) {
    const { data, error } = await supabase
      .from('requirements')
      .update({ iteration_id: null })
      .in('id', requirements)
      .eq('iteration_id', iterationId)
      .select()

    if (error) {
      throw error
    }
    results.requirements = data
  }

  // 批量更新任务
  if (tasks.length > 0) {
    const { data, error } = await supabase
      .from('tasks')
      .update({ iteration_id: null })
      .in('id', tasks)
      .eq('iteration_id', iterationId)
      .select()

    if (error) {
      throw error
    }
    results.tasks = data
  }

  // 批量更新缺陷
  if (defects.length > 0) {
    const { data, error } = await supabase
      .from('defects')
      .update({ iteration_id: null })
      .in('id', defects)
      .eq('iteration_id', iterationId)
      .select()

    if (error) {
      throw error
    }
    results.defects = data
  }

  return results
}
