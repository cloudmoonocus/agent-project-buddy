import type { Tables } from '@/types/supabase'
import { MCPClient } from '@mastra/mcp'
import { first } from 'lodash-es'

async function getMcpConfig() {
  const userId = 'a872def7-df4f-43d0-95b0-5f3f466f7064'
  const response = await fetch(
    `${process.env.VITE_SUPABASE_URL}/rest/v1/user_configs?select=mcp_config&user_id=eq.${userId}`,
    {
      method: 'GET',
      headers: {
        'apikey': process.env.VITE_SUPABASE_ANON_KEY as string,
        'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await response.json()
  return data
}

const mcpConfig: Tables<'user_configs'>[] = await getMcpConfig()

const mcp = new MCPClient(first(mcpConfig)?.mcp_config || {} as any)

export default mcp
