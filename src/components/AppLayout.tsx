import type { ItemType } from 'antd/es/menu/interface'
import { authAPI } from '@/api/auth'
import useUserStore from '@/store/userStore'
import { FlexContainer } from '@/styles/StyledComponents'
import { theme } from '@/styles/theme'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Layout as AntdLayout, Avatar, Dropdown, Typography } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

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
  cursor: pointer;
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

const UserAvatar = styled(Avatar)`
  background-color: ${theme.colors.primary};
  cursor: pointer;
  transition: ${theme.transition.DEFAULT};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${theme.boxShadow.sm};
  }
`

export const AppLayout: React.FC = () => {
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
            <Logo onClick={() => navigate('/')}>
              <img src="/project-management-icon.svg" alt="Logo" />
              <span>智能项目管理平台</span>
            </Logo>
          </FlexContainer>
          <FlexContainer gap={4}>
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
