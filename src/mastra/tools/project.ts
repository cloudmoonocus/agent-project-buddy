import {
  createProject as apiCreateProject,
  getAllProjects,
  getProjectById,
  getProjectWithRelations,
} from '@/api/projects'
import { createTool } from '@mastra/core'
import { z } from 'zod'

// 项目工具
const createProject = createTool({
  id: 'createProject',
  description: '创建一个新项目',
  inputSchema: z.object({
    name: z.string().describe('项目名称'),
    description: z.string().describe('项目描述').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const project = await apiCreateProject({
        name: context.name,
        description: context.description,
      })
      return { success: true, project }
    }
    catch (error: any) {
      console.error('创建项目失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const getProject = createTool({
  id: 'getProject',
  description: '获取项目详情',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
  }),
  execute: async ({ context }) => {
    try {
      const project = await getProjectById(Number(context.projectId))
      return { success: true, project }
    }
    catch (error: any) {
      console.error('获取项目失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const listProjects = createTool({
  id: 'listProjects',
  description: '列出所有项目',
  inputSchema: z.object({
    random: z.string().describe('随便写就行，因为不能空输入'),
  }),
  execute: async () => {
    try {
      const projects = await getAllProjects()
      return { success: true, projects }
    }
    catch (error: any) {
      console.error('列出项目失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const getProjectWithDetails = createTool({
  id: 'getProjectWithDetails',
  description: '获取项目及其所有相关数据（需求、任务、缺陷、迭代）',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
  }),
  execute: async ({ context }) => {
    try {
      const projectDetails = await getProjectWithRelations(Number(context.projectId))
      return { success: true, project: projectDetails }
    }
    catch (error: any) {
      console.error('获取项目详情失败:', error)
      return { success: false, error: error.message }
    }
  },
})

// 导出工具
export const projectTools = {
  createProject,
  getProject,
  listProjects,
  getProjectWithDetails,
}
