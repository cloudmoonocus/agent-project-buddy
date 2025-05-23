import type { Tables } from '@/types/supabase'
import { getEnv } from '@/utils/env.ts'
import { MCPClient } from '@mastra/mcp'
import { first } from 'lodash-es'

async function getMcpConfig() {
  // TODO 目前统一使用一个用户的配置
  const userId = 'a872def7-df4f-43d0-95b0-5f3f466f7064'
  const response = await fetch(
    `${getEnv('SUPABASE_URL')}/rest/v1/user_configs?select=mcp_config&user_id=eq.${userId}`,
    {
      method: 'GET',
      headers: {
        'apikey': getEnv('SUPABASE_ANON_KEY'),
        'Authorization': `Bearer ${getEnv('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await response.json()
  return data
}

// eslint-disable-next-line antfu/no-top-level-await
const mcpConfig: Tables<'user_configs'>[] = await getMcpConfig()

const mcp = new MCPClient(first(mcpConfig)?.mcp_config || {} as any)

export default mcp
