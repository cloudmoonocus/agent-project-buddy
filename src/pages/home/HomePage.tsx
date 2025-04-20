import type { TablesInsert } from '@/types/supabase'
import { projectsApi } from '@/api'
import useUserStore from '@/store/userStore'
import {
  CardGrid,
  EnhancedCard,
  FlexContainer,
  PageContainer,
  PageTitle,
  PrimaryButton,
  SectionTitle,
} from '@/styles/StyledComponents'
import { theme } from '@/styles/theme'
import {
  BugOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FileTextOutlined,
  PlusOutlined,
  ProjectOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import styled from '@emotion/styled'
import { useRequest } from 'ahooks'
import {
  Badge,
  Card,
  Form,
  Input,
  message,
  Modal,
  Skeleton,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography
const { TextArea } = Input

// 项目卡片
const ProjectCard = styled(EnhancedCard)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .ant-card-head {
    background-color: ${({ theme }) => theme.colors.backgroundElevated};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  }

  .ant-card-body {
    flex: 1;
    padding: ${({ theme }) => theme.spacing[4]};
    display: flex;
    flex-direction: column;
  }
`

// 项目卡片标题
const ProjectTitle = styled.div`
  display: flex;
  flex-direction: column;

  .project-name {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .project-description {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.4;
  }
`

// 快速导航选项卡
const QuickNavTabs = styled(Tabs)`
  margin-top: ${({ theme }) => theme.spacing[3]};

  .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-tabs-tab {
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[3]}`};
    transition: ${({ theme }) => theme.transition.DEFAULT};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.primaryLight};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }
  }

  .ant-tabs-tab-btn {
    display: flex;
    align-items: center;

    .anticon {
      margin-right: ${({ theme }) => theme.spacing[1]};
    }
  }
`

// 空状态容器
const EmptyProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  background-color: ${({ theme }) => theme.colors.backgroundElevated};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};

  h3 {
    margin-top: ${({ theme }) => theme.spacing[4]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }

  p {
    color: ${({ theme }) => theme.colors.textTertiary};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }

  .action-icon {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing[4]};
    background-color: ${({ theme }) => theme.colors.primaryLight};
    border-radius: 50%;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`

// 项目统计卡片
const StatCard = styled(Card)`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundElevated};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  height: 100%;

  .stat-title {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  .stat-value {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  .stat-icon {
    font-size: 40px;
    opacity: 0.1;
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
`

// 动画效果组件
const FadeInDiv = styled.div`
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const { userInfo } = useUserStore()

  // 获取项目列表
  const { data: projects = [], loading, refresh } = useRequest(projectsApi.getAllProjects)

  // 创建项目
  const { run: createProject, loading: createLoading } = useRequest(
    (values: TablesInsert<'projects'>) => projectsApi.createProject(values),
    {
      manual: true,
      onSuccess: (data) => {
        message.success('项目创建成功')
        setIsModalVisible(false)
        form.resetFields()
        refresh()

        // 创建成功后跳转到项目页面
        navigate(`/project/${data.id}`)
      },
      onError: (error) => {
        message.error(`创建失败: ${error.message}`)
      },
    },
  )

  const handleTabClick = (
    key: string,
    projectId: number,
    e: React.MouseEvent,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/project/${projectId}${key}`)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      createProject({
        ...values,
        creator_id: userInfo?.id || null,
        created_at: new Date().toISOString(),
      })
    })
  }

  // 统计数据（示例）
  const statsData = [
    { title: '我参与的项目', value: projects.length, icon: <ProjectOutlined /> },
    { title: '进行中的迭代', value: 2, icon: <SyncOutlined /> },
    { title: '待处理任务', value: 12, icon: <CheckSquareOutlined /> },
    { title: '未解决的缺陷', value: 5, icon: <BugOutlined /> },
  ]

  const formatDate = (dateString?: string | null) => {
    if (!dateString)
      return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <PageContainer>
      <FadeInDiv>
        <FlexContainer justify="space-between" align="center" style={{ marginBottom: theme.spacing[6] }}>
          <PageTitle level={2} style={{ margin: 0 }}>
            工作空间
          </PageTitle>
          <PrimaryButton
            size="large"
            icon={<PlusOutlined />}
            onClick={showModal}
          >
            创建新项目
          </PrimaryButton>
        </FlexContainer>

        {/* 统计信息卡片 */}
        <CardGrid style={{ marginBottom: theme.spacing[8] }}>
          {statsData.map((stat, index) => (
            <StatCard key={index} styles={{ body: { padding: theme.spacing[4] } }}>
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-icon">{stat.icon}</div>
            </StatCard>
          ))}
        </CardGrid>

        <SectionTitle level={3}>我的项目</SectionTitle>

        {loading
          ? (
              <CardGrid>
                {[1, 2, 3].map(i => (
                  <Card key={i} style={{ width: '100%' }}>
                    <Skeleton active />
                  </Card>
                ))}
              </CardGrid>
            )
          : projects.length === 0
            ? (
                <EmptyProjectsContainer>
                  <PlusOutlined className="action-icon" />
                  <h3>暂无项目</h3>
                  <p>创建一个新项目开始您的工作</p>
                  <PrimaryButton icon={<PlusOutlined />} onClick={showModal}>
                    创建新项目
                  </PrimaryButton>
                </EmptyProjectsContainer>
              )
            : (
                <CardGrid>
                  {projects.map(project => (
                    <ProjectCard
                      key={project.id}
                      hoverable
                      onClick={() => navigate(`/project/${project.id}`)}
                      title={(
                        <ProjectTitle>
                          <FlexContainer justify="space-between" align="center">
                            <span className="project-name">{project.name}</span>
                            <Tag color={theme.colors.primary}>项目</Tag>
                          </FlexContainer>
                        </ProjectTitle>
                      )}
                    >
                      <Text className="project-description">
                        {project.description || '无项目描述'}
                      </Text>

                      <FlexContainer gap={2} style={{ margin: `${theme.spacing[3]} 0` }}>
                        <Badge status="processing" />
                        <Text type="secondary" style={{ fontSize: theme.typography.fontSize.xs }}>
                          <ClockCircleOutlined style={{ marginRight: theme.spacing[1] }} />
                          创建于
                          {' '}
                          {formatDate(project.created_at)}
                        </Text>
                      </FlexContainer>

                      <QuickNavTabs
                        size="small"
                        defaultActiveKey="____"
                        activeKey="____"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        items={[
                          {
                            key: '/',
                            label: (
                              <span onClick={e => handleTabClick('', project.id, e)}>
                                <DashboardOutlined />
                                仪表盘
                              </span>
                            ),
                          },
                          {
                            key: '/requirements',
                            label: (
                              <span
                                onClick={e =>
                                  handleTabClick('/requirements', project.id, e)}
                              >
                                <FileTextOutlined />
                                需求
                              </span>
                            ),
                          },
                          {
                            key: '/tasks',
                            label: (
                              <span
                                onClick={e => handleTabClick('/tasks', project.id, e)}
                              >
                                <CheckSquareOutlined />
                                任务
                              </span>
                            ),
                          },
                          {
                            key: '/defects',
                            label: (
                              <span
                                onClick={e =>
                                  handleTabClick('/defects', project.id, e)}
                              >
                                <BugOutlined />
                                缺陷
                              </span>
                            ),
                          },
                          {
                            key: '/iterations',
                            label: (
                              <span
                                onClick={e =>
                                  handleTabClick('/iterations', project.id, e)}
                              >
                                <SyncOutlined />
                                迭代
                              </span>
                            ),
                          },
                        ]}
                      />
                    </ProjectCard>
                  ))}
                </CardGrid>
              )}
      </FadeInDiv>

      <Modal
        title="创建新项目"
        open={isModalVisible}
        onCancel={handleCancel}
        okText="创建"
        cancelText="取消"
        onOk={handleSubmit}
        confirmLoading={createLoading}
        width={500}
        styles={{
          body: { padding: '24px 24px 8px' },
        }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input
              placeholder="请输入项目名称"
              autoFocus
              suffix={(
                <Tooltip title="优先输入较短的、有标识性的名称">
                  <Text type="secondary" style={{ cursor: 'help' }}>?</Text>
                </Tooltip>
              )}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="项目描述"
          >
            <TextArea
              rows={4}
              placeholder="请输入项目描述（可选）"
              showCount
              maxLength={200}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
