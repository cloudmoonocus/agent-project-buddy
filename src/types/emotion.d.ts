import type { theme } from '@/styles/theme'
import '@emotion/react'

declare module '@emotion/react' {
  export type Theme = typeof theme
}
