import type { Tables } from '@/types/supabase'
import { projectsApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

type ProjectWithRelations = Tables<'projects'> & {
  requirements: Tables<'requirements'>[]
  tasks: Tables<'tasks'>[]
  defects: Tables<'defects'>[]
  iterations: Tables<'iterations'>[]
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectWithRelations | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const loadProjectDetails = async (projectId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.getProjectWithRelations(projectId)
      setProject(data)
      setEditName(data.name)
      setEditDescription(data.description || '')
    }
    catch (err) {
      setError('加载项目详情失败')
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadProjectDetails(Number.parseInt(id))
    }
  }, [id])

  const handleUpdateProject = async () => {
    if (!project || !editName.trim())
      return

    try {
      setLoading(true)
      const updatedProject = await projectsApi.updateProject(project.id, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      })
      setProject({
        ...project,
        ...updatedProject,
      })
      setIsEditMode(false)
    }
    catch (err) {
      setError('更新项目失败')
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  const createNewIteration = async () => {
    if (!project)
      return

    try {
      // 导航到创建迭代页面，并传递项目ID
      navigate(`/projects/${project.id}/iterations/new`)
    }
    catch (err) {
      setError('导航到创建迭代页面失败')
      console.error(err)
    }
  }

  if (loading && !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={() => navigate('/projects')} className="bg-indigo-600 hover:bg-indigo-700">
            返回项目列表
          </Button>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-gray-600 dark:text-gray-400 text-center py-12">
            项目不存在或已被删除
          </div>
          <Button onClick={() => navigate('/projects')} className="bg-indigo-600 hover:bg-indigo-700">
            返回项目列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => navigate('/projects')} variant="outline" className="border-gray-300 dark:border-gray-700">
            ← 返回项目列表
          </Button>
          {!isEditMode
            ? (
                <Button onClick={() => setIsEditMode(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  编辑项目
                </Button>
              )
            : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateProject}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={loading}
                  >
                    保存
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditMode(false)
                      setEditName(project.name)
                      setEditDescription(project.description || '')
                    }}
                    variant="outline"
                    className="border-gray-300 dark:border-gray-700"
                  >
                    取消
                  </Button>
                </div>
              )}
        </div>

        <Card className="mb-6 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
          <div className="p-6">
            {isEditMode
              ? (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        项目名称
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        项目描述
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows={3}
                      />
                    </div>
                  </div>
                )
              : (
                  <div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{project.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {project.description || '暂无描述'}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-500">
                      创建于:
                      {' '}
                      {new Date(project.created_at || '').toLocaleString()}
                    </div>
                  </div>
                )}
          </div>
        </Card>

        {/* 迭代列表 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">迭代</h2>
            <Button
              onClick={createNewIteration}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              新建迭代
            </Button>
          </div>
          {project.iterations.length === 0
            ? (
                <div className="text-gray-600 dark:text-gray-400 text-center py-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
                  暂无迭代，点击"新建迭代"创建您的第一个迭代
                </div>
              )
            : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.iterations.map(iteration => (
                    <Card
                      key={iteration.id}
                      className="overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/projects/${project.id}/iterations/${iteration.id}`)}
                    >
                      <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">
                            迭代 #
                            {iteration.id}
                          </h3>
                          {iteration.is_locked && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              已锁定
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <div>
                            开始日期:
                            {new Date(iteration.start_date).toLocaleDateString()}
                          </div>
                          <div>
                            结束日期:
                            {new Date(iteration.end_date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          创建于:
                          {' '}
                          {new Date(iteration.created_at || '').toLocaleString()}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
        </div>

        {/* 工作项概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">需求</h3>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{project.requirements.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900 dark:hover:bg-indigo-900/30"
              onClick={() => navigate(`/projects/${project.id}/requirements`)}
            >
              查看所有需求
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">任务</h3>
            <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">{project.tasks.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full text-violet-600 border-violet-200 hover:bg-violet-50 dark:border-violet-900 dark:hover:bg-violet-900/30"
              onClick={() => navigate(`/projects/${project.id}/tasks`)}
            >
              查看所有任务
            </Button>
          </Card>

          <Card className="p-4">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">缺陷</h3>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{project.defects.length}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-900/30"
              onClick={() => navigate(`/projects/${project.id}/defects`)}
            >
              查看所有缺陷
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
