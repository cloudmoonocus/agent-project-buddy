import type { Json, TablesInsert, TablesUpdate } from '../types/supabase'
import supabase from '../utils/supabaseClient'

// 获取用户配置
export async function getUserConfig(userId: string) {
  const { data, error } = await supabase
    .from('user_configs')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    // 如果错误是因为没有找到记录，返回null
    if (error.code === 'PGRST116') {
      return null
    }
    throw error
  }

  return data
}

// 创建用户配置
export async function createUserConfig(config: TablesInsert<'user_configs'>) {
  const { data, error } = await supabase
    .from('user_configs')
    .insert(config)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 更新用户配置
export async function updateUserConfig(userId: string, updates: TablesUpdate<'user_configs'>) {
  const { data, error } = await supabase
    .from('user_configs')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// 删除用户配置
export async function deleteUserConfig(userId: string) {
  const { error } = await supabase
    .from('user_configs')
    .delete()
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return true
}

// 更新MCP配置
export async function updateMcpConfig(userId: string, mcpConfig: Json) {
  const { data, error } = await supabase
    .from('user_configs')
    .update({ mcp_config: mcpConfig })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
