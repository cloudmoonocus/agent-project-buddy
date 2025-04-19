import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const navigate = useNavigate()
  const { signIn, isAuthenticated, refreshSession } = useAuthStore()

  // 检查用户是否已登录，若已登录则跳转到首页
  useEffect(() => {
    const checkSession = async () => {
      await refreshSession()
      if (isAuthenticated) {
        navigate('/')
      }
    }

    checkSession()
  }, [isAuthenticated, navigate, refreshSession])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!email || !password) {
      setErrorMsg('请填写邮箱和密码')
      return
    }

    try {
      setLoading(true)
      await signIn(email, password)
      navigate('/')
    }
    catch (error: any) {
      console.error('Login error:', error)
      setErrorMsg(error.message || '登录失败，请重试')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gray-100">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>登录您的账号</CardTitle>
              <CardDescription>
                请输入您的邮箱和密码登录
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  {errorMsg && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50 dark:text-red-400">
                      {errorMsg}
                    </div>
                  )}
                  <div className="grid gap-3">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">密码</Label>
                      <button
                        type="button"
                        onClick={() => navigate('/auth/reset-password')}
                        className="ml-auto inline-block underline-offset-4 hover:underline"
                      >
                        忘记密码?
                      </button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? '登录中...' : '登录'}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  还没有账号?
                  {' '}
                  <button
                    type="button"
                    onClick={() => navigate('/auth/register')}
                    className="underline underline-offset-4"
                  >
                    注册
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
