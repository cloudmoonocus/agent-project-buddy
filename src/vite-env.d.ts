/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly COPILOT_KIT_KEY: string
  readonly OPENAI_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
