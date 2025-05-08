import type { Monaco } from '@monaco-editor/react'
import { userConfigApi } from '@/api'
import useUserStore from '@/store/userStore'
import Editor from '@monaco-editor/react'
import { Button, Card, message, Modal, Space, Spin, Typography } from 'antd'
import React, { useEffect, useState } from 'react'

const { Title, Text } = Typography

interface UserConfigEditorProps {
  open: boolean
  onClose: () => void
}

const UserConfigEditor: React.FC<UserConfigEditorProps> = ({ open, onClose }) => {
  const { userInfo, userConfig, setUserConfig } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [jsonValue, setJsonValue] = useState('')
  const [jsonError, setJsonError] = useState<string | null>(null)

  useEffect(() => {
    if (open && userInfo && userConfig) {
      const formattedJson = JSON.stringify(userConfig.mcp_config || {}, null, 2)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setJsonValue(formattedJson)
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setJsonError(null)
    }
  }, [open, userInfo, userConfig])

  const handleEditorChange = (value: string | undefined) => {
    if (!value) {
      setJsonValue('')
      return
    }
    setJsonValue(value)
    try {
      JSON.parse(value)
      setJsonError(null)
    }
    catch {
      setJsonError('JSON格式错误')
    }
  }

  const handleSave = async () => {
    if (jsonError || !userInfo) {
      return
    }

    try {
      setLoading(true)
      const parsedJson = JSON.parse(jsonValue)

      let result
      if (userConfig) {
        // 更新配置
        result = await userConfigApi.updateMcpConfig(userInfo.id, parsedJson)
      }
      else {
        // 创建新配置
        result = await userConfigApi.createUserConfig({
          user_id: userInfo.id,
          mcp_config: parsedJson,
        })
      }

      setUserConfig(result)
      message.success('配置已保存')
      onClose()
    }
    catch (err: any) {
      message.error(`保存失败: ${err.message || '未知错误'}`)
    }
    finally {
      setLoading(false)
    }
  }

  const handleEditorMount = (_: any, monaco: Monaco) => {
    // 可以在这里配置编辑器的各种选项
    monaco.editor.setTheme('vs-dark')
  }

  return (
    <Modal
      title="自定义配置"
      open={open}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          disabled={!!jsonError || loading}
        >
          保存
        </Button>,
      ]}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={5}>MCP 配置</Title>
          <Text type="secondary">
            您可以在这里自定义 Model Context Protocol 配置，配置将会影响 AI 助手的行为
          </Text>

          <Card style={{ marginTop: 16 }}>
            <div style={{ height: 400 }}>
              <Editor
                height="100%"
                language="json"
                value={jsonValue}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
                onMount={handleEditorMount}
                theme="vs-dark"
              />
            </div>
          </Card>

          {jsonError && (
            <Text type="danger">{jsonError}</Text>
          )}
        </Space>
      </Spin>
    </Modal>
  )
}

export default UserConfigEditor
