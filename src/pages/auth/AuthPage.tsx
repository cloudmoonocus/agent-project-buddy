import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message, Tabs, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../api/auth'
import '../../styles/reset.css'

const { Title } = Typography

interface AuthFormValues {
  email: string
  password: string
}

export function AuthPage() {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleSubmit = async (values: AuthFormValues) => {
    setLoading(true)
    try {
      if (activeTab === 'login') {
        await authAPI.login(values)
        message.success('登录成功')
        navigate('/')
      }
      else {
        await authAPI.register(values)
        message.success('注册成功，请登录')
        setActiveTab('login')
        form.resetFields()
      }
    }
    catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      }
      else {
        message.error('操作失败，请重试')
      }
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5',
    }}
    >
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}>
            {activeTab === 'login' ? '欢迎登录' : '创建账号'}
          </Title>
          <p style={{ color: '#888', marginTop: 8 }}>
            {activeTab === 'login' ? '登录您的账号以继续' : '注册一个新账号'}
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          items={[
            { key: 'login', label: '登录' },
            { key: 'register', label: '注册' },
          ]}
        />

        <Form
          form={form}
          name="auth-form"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少为6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {activeTab === 'login' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="link" onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}>
            {activeTab === 'login' ? '没有账号？去注册' : '已有账号？去登录'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
