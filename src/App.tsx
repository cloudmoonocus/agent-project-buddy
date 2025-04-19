import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card } from '@/components/ui/card'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ResetPasswordPage from '@/pages/auth/reset-password'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'normalize.css'
import './styles/index.css'

// 占位页面，用于演示路由保护
function HomePage() {
  const { user, signOut } = useAuthStore()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-violet-50 to-rose-100 px-4 py-12 dark:from-gray-900 dark:via-indigo-950 dark:to-violet-950">
      <Card className="w-full max-w-md overflow-hidden border-none shadow-xl dark:bg-gray-800/60 dark:backdrop-blur-sm">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
        <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex justify-center -mt-12 mb-4">
            <div className="rounded-full bg-white p-4 shadow-md dark:bg-gray-800">
              <svg className="h-12 w-12 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04L12 21.012 21.618 7.984z" />
              </svg>
            </div>
          </div>
          <h1 className="mb-6 text-2xl font-bold">首页</h1>
          <p className="mb-4">
            欢迎回来，
            {user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            退出登录
          </button>
        </div>
      </Card>
    </div>
  )
}

// App组件
function App() {
  const { refreshSession } = useAuthStore()

  // 应用启动时尝试刷新用户会话
  useEffect(() => {
    refreshSession()
  }, [refreshSession])

  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        {/* 受保护的路由 */}
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

        {/* 404 路由重定向到首页 */}
        <Route path="*" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

const root = createRoot(
  document.getElementById('root') as HTMLElement,
)

root.render(<App />)
