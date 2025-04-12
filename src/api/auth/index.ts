import supabase from '../../utils/supabaseClient.ts'

interface CommonParams {
  email: string
  password: string
}

/**
 * 认证相关API
 */
export const authAPI = {
  // 登录
  login: async (params: CommonParams) => {
    const { email, password } = params
    const { data: user, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error)
      throw new Error(error.message)
    return user
  },

  // 注册
  register: async ({ email, password }: CommonParams) => {
    const { data: user, error } = await supabase.auth.signUp({ email, password })
    if (error)
      throw new Error(error.message)
    return user
  },

  // 获取当前用户（是否已登录）
  getCurrentUser: async () => {
    const { data: session } = await supabase.auth.getSession()
    if (!session.session)
      return null
    const { data, error } = await supabase.auth.getUser()
    if (error)
      throw new Error(error.message)
    return data?.user
  },

  // 退出登录
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error)
      throw new Error(error.message)
  },
}
