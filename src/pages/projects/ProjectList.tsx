import type { Tables } from '@/types/supabase'
import { projectsApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProjectList() {
  const [projects, setProjects] = useState<Tables<'projects'>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDescription, setNewProjectDescription] = useState('')
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.getAllProjects()
      setProjects(data)
    }
    catch (err) {
      setError('加载项目列表失败')
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim())
      return

    try {
      setLoading(true)
      const newProject = await projectsApi.createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim() || null,
        creator_id: user?.id,
      })
      setProjects([...projects, newProject])
      setNewProjectName('')
      setNewProjectDescription('')
      setShowCreateForm(false)
    }
    catch (err) {
      setError('创建项目失败')
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: number) => {
    try {
      setLoading(true)
      await projectsApi.deleteProject(id)
      setProjects(projects.filter(p => p.id !== id))
    }
    catch (err) {
      setError('删除项目失败')
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }

  const viewProjectDetails = (id: number) => {
    navigate(`/projects/${id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">项目列表</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {showCreateForm ? '取消' : '新建项目'}
            </Button>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              退出登录
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showCreateForm && (
          <Card className="mb-6 p-4 shadow-sm">
            <form onSubmit={handleCreateProject}>
              <h2 className="text-lg font-medium mb-4">创建新项目</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  项目描述
                </label>
                <textarea
                  value={newProjectDescription}
                  onChange={e => setNewProjectDescription(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? '创建中...' : '创建项目'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading && !showCreateForm
          ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">加载中...</p>
              </div>
            )
          : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.length === 0
                  ? (
                      <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400">暂无项目，点击"新建项目"创建您的第一个项目</p>
                      </div>
                    )
                  : (
                      projects.map(project => (
                        <Card key={project.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
                          <div className="p-4">
                            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{project.name}</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {project.description || '暂无描述'}
                            </p>
                            <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                              创建于:
                              {' '}
                              {new Date(project.created_at || '').toLocaleString()}
                            </div>
                            <div className="flex justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewProjectDetails(project.id)}
                                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900 dark:hover:bg-indigo-900/30"
                              >
                                查看详情
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/30"
                              >
                                删除
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
              </div>
            )}
      </div>
    </div>
  )
}
