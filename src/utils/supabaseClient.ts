import type { Database } from '@/types/supabase.ts'
import { createClient } from '@supabase/supabase-js'
import { message } from 'antd'

const supabaseUrl = typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL as string : import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY as string : import.meta.env.VITE_SUPABASE_ANON_KEY as string
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// eslint-disable-next-line ts/no-unsafe-function-type
export function request(func: Function) {
  try {
    return func()
  }
  catch (error: any) {
    console.error('Error in Supabase request:', error.message)
    message.error(error.message || '请求失败')
  }
}

export default supabase
