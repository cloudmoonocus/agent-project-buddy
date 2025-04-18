import type { ItemType } from 'antd/es/menu/interface'
import { authAPI } from '@/api/auth'
import useUserStore from '@/store/userStore'
import { FlexContainer } from '@/styles/StyledComponents'
import { theme } from '@/styles/theme'
import { HomeOutlined, LogoutOutlined, ProjectOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Layout as AntdLayout, Avatar, Badge, Button, Dropdown, Menu, Tooltip, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'

const { Header, Content } = AntdLayout

const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${theme.colors.backgroundElevated};
  border-bottom: 1px solid ${theme.colors.border};
  box-shadow: ${theme.boxShadow.sm};
  height: 60px;
  line-height: 60px;
  padding: 0 ${theme.spacing[6]};
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.primary};
  margin-right: ${theme.spacing[8]};

  img {
    height: 28px;
    margin-right: ${theme.spacing[2]};
  }
`

const ContentWrapper = styled(Content)`
  background-color: ${theme.colors.background};
  height: calc(100vh - 60px);
  overflow: auto;
`

const StyledMenu = styled(Menu)`
  border: none;

  .ant-menu-item {
    border-radius: ${theme.borderRadius.sm};
    margin: 0 ${theme.spacing[1]};

    &:hover {
      color: ${theme.colors.primary};
    }

    &.ant-menu-item-selected {
      background-color: ${theme.colors.primaryLight};
      color: ${theme.colors.primary};
      font-weight: ${theme.typography.fontWeight.medium};

      &::after {
        display: none;
      }
    }
  }
`

const UserAvatar = styled(Avatar)`
  background-color: ${theme.colors.primary};
  cursor: pointer;
  transition: ${theme.transition.DEFAULT};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.boxShadow.sm};
  }
`

const NavButton = styled(Button)`
  padding: 0 ${theme.spacing[3]};
  height: 36px;

  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
  }
`

export const AppLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [userName, setUserName] = useState<string>('')
  const [userInitial, setUserInitial] = useState<string>('')
  const { setUserInfo } = useUserStore()

  const fetchUserInfo = useCallback(async () => {
    if (setUserInfo) {
      const user = await authAPI.getCurrentUser()
      setUserName(user?.email || '用户')
      setUserInitial(user?.email?.charAt(0).toUpperCase() || 'U')
      setUserInfo(user)
    }
  }, [setUserInfo])

  useEffect(() => {
    fetchUserInfo()
  }, [fetchUserInfo])

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      navigate('/auth')
    }
    catch (error) {
      console.error('退出登录失败', error)
    }
  }

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: <Link to="/">项目</Link>,
    },
  ]

  // 确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname
    if (path === '/' || path === '/home')
      return 'home'
    if (path.includes('/project'))
      return 'projects'
    return ''
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账户设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  return (
    <AntdLayout style={{ minHeight: '100vh' }}>
      <StyledHeader>
        <FlexContainer justify="space-between" style={{ width: '100%' }}>
          <FlexContainer>
            <Logo>
              <img src="/project-management-icon.svg" alt="Logo" />
              <span>项目管理平台</span>
            </Logo>
            <StyledMenu
              mode="horizontal"
              selectedKeys={[getSelectedKey()]}
              items={menuItems}
            />
          </FlexContainer>

          <FlexContainer gap={4}>
            <Tooltip title="查看通知">
              <Badge count={2} size="small">
                <NavButton
                  type="text"
                  shape="circle"
                  icon={(
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor" />
                    </svg>
                  )}
                />
              </Badge>
            </Tooltip>

            <Dropdown menu={{ items: userMenuItems as ItemType[] }} placement="bottomRight" trigger={['click']}>
              <FlexContainer gap={2} style={{ cursor: 'pointer' }}>
                <UserAvatar>{userInitial}</UserAvatar>
                <Typography.Text style={{ marginLeft: theme.spacing[2] }}>{userName}</Typography.Text>
              </FlexContainer>
            </Dropdown>
          </FlexContainer>
        </FlexContainer>
      </StyledHeader>
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </AntdLayout>
  )
}
