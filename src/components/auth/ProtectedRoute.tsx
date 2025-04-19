import type { FC, ReactNode } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const { isAuthenticated, refreshSession } = useAuthStore()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshSession()
      }
      finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [refreshSession])

  if (isLoading) {
    // 可以显示一个加载指示器
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-neutral-900 dark:border-neutral-50"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // 重定向到登录页面，并保存当前位置，以便登录后返回
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
