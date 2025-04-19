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

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const navigate = useNavigate()
  const { signUp, isAuthenticated, refreshSession } = useAuthStore()

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
    setSuccessMsg('')

    // 表单验证
    if (!email || !password || !confirmPassword) {
      setErrorMsg('请填写所有必填字段')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      setErrorMsg('密码长度必须至少为6个字符')
      return
    }

    try {
      setLoading(true)
      await signUp(email, password)
      setSuccessMsg('注册成功! 请检查您的邮箱完成验证。')

      // 清空表单
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // 三秒后跳转到登录页
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    }
    catch (error: any) {
      console.error('Registration error:', error)
      setErrorMsg(error.message || '注册失败，请重试')
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
              <CardTitle>注册新账号</CardTitle>
              <CardDescription>
                创建一个新账号以开始使用应用
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
                  {successMsg && (
                    <div className="rounded-md bg-green-50 p-3 text-sm text-green-500 dark:bg-green-950/50 dark:text-green-400">
                      {successMsg}
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
                    <Label htmlFor="password">密码</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      密码长度至少为6个字符
                    </p>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">确认密码</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? '注册中...' : '注册'}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  已有账号?
                  {' '}
                  <button
                    type="button"
                    onClick={() => navigate('/auth/login')}
                    className="underline underline-offset-4"
                  >
                    登录
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
