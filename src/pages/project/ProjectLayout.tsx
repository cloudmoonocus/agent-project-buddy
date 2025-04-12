import styled from '@emotion/styled'
import { Layout as AntdLayout, Menu } from 'antd'
import React from 'react'
import { Link, Outlet, useLocation, useParams } from 'react-router-dom'

const { Sider, Content } = AntdLayout

const ContentWrapper = styled(Content)`
  margin: 10px;
  padding: 25px 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 1px 2px 0px rgba(45, 45, 46, 0.2),
    0px 0px 2px 0px rgba(45, 45, 46, 0.05);
  overflow: auto;
`

export const ProjectLayout: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const location = useLocation()

  const menuItems = [
    {
      key: 'dashboard',
      label: <Link to={`/project/${projectId}`}>仪表盘</Link>,
    },
    {
      key: 'requirements',
      label: <Link to={`/project/${projectId}/requirements`}>需求</Link>,
    },
    {
      key: 'tasks',
      label: <Link to={`/project/${projectId}/tasks`}>任务</Link>,
    },
    {
      key: 'defects',
      label: <Link to={`/project/${projectId}/defects`}>缺陷</Link>,
    },
    {
      key: 'iterations',
      label: <Link to={`/project/${projectId}/iterations`}>迭代</Link>,
    },
  ]

  // 确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname
    if (path.includes('/requirements'))
      return 'requirements'
    if (path.includes('/tasks'))
      return 'tasks'
    if (path.includes('/defects'))
      return 'defects'
    if (path.includes('/iterations'))
      return 'iterations'
    return 'dashboard'
  }

  return (
    <AntdLayout style={{ height: '100%' }}>
      <AntdLayout hasSider style={{ backgroundColor: '#F7F8FA' }}>
        <Sider theme="light" width={100} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </AntdLayout>
    </AntdLayout>
  )
}
