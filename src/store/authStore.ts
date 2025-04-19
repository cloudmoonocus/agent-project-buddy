import type { Session, User } from '@supabase/supabase-js'
import supabase from '@/utils/supabaseClient'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean

  // 方法
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  refreshSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      session: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      signUp: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          })

          if (error)
            throw error

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: !!data.session,
            isLoading: false,
          })
        }
        catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (error)
            throw error

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isLoading: false,
          })
        }
        catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.signOut()

          if (error)
            throw error

          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
        catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ isLoading: true, error: null })
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          })

          if (error)
            throw error

          set({ isLoading: false })
        }
        catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      refreshSession: async () => {
        try {
          set({ isLoading: true, error: null })
          const { data, error } = await supabase.auth.getSession()

          if (error)
            throw error

          set({
            user: data.session?.user || null,
            session: data.session,
            isAuthenticated: !!data.session,
            isLoading: false,
          })
        }
        catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: state => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
