import type { UserData } from '@/types'
import supabase from '@/utils/supabaseClient.ts'

interface CommonParams {
  email: string
  password: string
}

export async function login(params: CommonParams): Promise<UserData> {
  const { email, password } = params
  const { data: user, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error)
    throw new Error(error.message)
  return user.user
}

export async function register(params: CommonParams): Promise<UserData | null> {
  const { email, password } = params
  const { data: user, error } = await supabase.auth.signUp({ email, password })
  if (error)
    throw new Error(error.message)
  return user.user
}

export async function getCurrentUser(): Promise<UserData | undefined | null> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session)
    return null
  const { data, error } = await supabase.auth.getUser()
  if (error)
    throw new Error(error.message)
  return data?.user
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error)
    throw new Error(error.message)
}
