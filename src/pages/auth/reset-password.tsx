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
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const navigate = useNavigate()
  const { resetPassword } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!email) {
      setErrorMsg('请填写邮箱')
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      setSuccessMsg('重置密码邮件已发送，请检查您的邮箱。')
      setEmail('')
    }
    catch (error: any) {
      console.error('Reset password error:', error)
      setErrorMsg(error.message || '重置密码失败，请重试')
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
              <CardTitle>重置密码</CardTitle>
              <CardDescription>
                输入您的邮箱以接收重置密码链接
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
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? '发送中...' : '发送重置链接'}
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  记得密码了?
                  {' '}
                  <button
                    type="button"
                    onClick={() => navigate('/auth/login')}
                    className="underline underline-offset-4"
                  >
                    返回登录
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
