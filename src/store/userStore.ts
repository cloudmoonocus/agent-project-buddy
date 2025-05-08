import type { Json, Tables } from '@/types/supabase'
import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface UserState {
  userInfo: User | null
  userConfig: Tables<'user_configs'> | null
  setUserInfo: (info: User | null) => void
  setUserConfig: (config: Tables<'user_configs'> | null) => void
  updateMcpConfig: (mcpConfig: Json) => void
}

const useUserStore = create<UserState>(set => ({
  userInfo: null,
  userConfig: null,
  setUserInfo: info => set({ userInfo: info }),
  setUserConfig: config => set({ userConfig: config }),
  updateMcpConfig: mcpConfig => set((state) => {
    if (!state.userConfig)
      return state
    return { userConfig: { ...state.userConfig, mcp_config: mcpConfig } }
  }),
}))

export default useUserStore
