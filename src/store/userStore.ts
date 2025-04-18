import type { User } from '@supabase/supabase-js'
import { create } from 'zustand'

interface UserState {
  userInfo: User | null
  setUserInfo: (info: User | null) => void
}

const useUserStore = create<UserState>(set => ({
  userInfo: null,
  setUserInfo: info => set({ userInfo: info }),
}))

export default useUserStore
