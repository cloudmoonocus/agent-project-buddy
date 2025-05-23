import type { Database } from '@/types/supabase.ts'
import { getEnv } from '@/utils/env.ts'
import { createClient } from '@supabase/supabase-js'
import { message } from 'antd'

const supabaseUrl = getEnv('SUPABASE_URL')
const supabaseKey = getEnv('SUPABASE_ANON_KEY')
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
