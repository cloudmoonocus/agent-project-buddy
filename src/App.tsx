import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card } from '@/components/ui/card'
import LoginPage from '@/pages/auth/login'
import RegisterPage from '@/pages/auth/register'
import ResetPasswordPage from '@/pages/auth/reset-password'
import ProjectDetail from '@/pages/projects/ProjectDetail'
import ProjectList from '@/pages/projects/ProjectList'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import 'normalize.css'
import './styles/index.css'

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
        <Route path="/" element={<ProtectedRoute><Navigate to="/projects" replace /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />

        {/* 404 路由重定向到项目列表 */}
        <Route path="*" element={<ProtectedRoute><Navigate to="/projects" replace /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

const root = createRoot(
  document.getElementById('root') as HTMLElement,
)

root.render(<App />)
