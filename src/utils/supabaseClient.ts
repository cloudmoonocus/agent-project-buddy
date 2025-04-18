import type { Database } from '@/types/supabase.ts'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// eslint-disable-next-line ts/no-unsafe-function-type
export function request(func: Function) {
  try {
    return func()
  }
  catch (error: any) {
    console.error('Error in Supabase request:', error.message)
  }
}

export default supabase
