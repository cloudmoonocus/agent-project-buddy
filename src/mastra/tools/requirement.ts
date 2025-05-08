import {
  createRequirement as apiCreateRequirement,
  getAllRequirements,
  getRequirementById,
  updateRequirement,
} from '@/api/workitem/requirements'
import { createTool } from '@mastra/core'
import { z } from 'zod'

// 需求工具
const createRequirement = createTool({
  id: 'createRequirement',
  description: '创建一个新需求',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
    title: z.string().describe('需求标题'),
    description: z.string().describe('需求描述').optional(),
    priority: z.enum(['low', 'medium', 'high']).describe('优先级').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).describe('状态').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const requirement = await apiCreateRequirement({
        project_id: Number(context.projectId),
        title: context.title,
        description: context.description,
        priority: context.priority || 'medium',
        status: context.status || 'open',
      })

      return { success: true, requirement }
    }
    catch (error: any) {
      console.error('创建需求失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const getRequirement = createTool({
  id: 'getRequirement',
  description: '获取需求详情',
  inputSchema: z.object({
    requirementId: z.string().describe('需求ID'),
  }),
  execute: async ({ context }) => {
    try {
      const requirement = await getRequirementById(Number(context.requirementId))
      return { success: true, requirement }
    }
    catch (error: any) {
      console.error('获取需求失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const listRequirements = createTool({
  id: 'listRequirements',
  description: '列出所有需求',
  inputSchema: z.object({
    random: z.string().describe('随便写就行，因为不能空输入'),
  }),
  execute: async () => {
    try {
      const requirements = await getAllRequirements()
      return { success: true, requirements }
    }
    catch (error: any) {
      console.error('列出需求失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const updateRequirementTool = createTool({
  id: 'updateRequirement',
  description: '更新需求信息',
  inputSchema: z.object({
    requirementId: z.string().describe('需求ID'),
    title: z.string().describe('需求标题').optional(),
    description: z.string().describe('需求描述').optional(),
    priority: z.enum(['low', 'medium', 'high']).describe('优先级').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).describe('状态').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const updates: any = {}
      if (context.title)
        updates.title = context.title
      if (context.description)
        updates.description = context.description
      if (context.priority)
        updates.priority = context.priority
      if (context.status)
        updates.status = context.status

      const requirement = await updateRequirement(Number(context.requirementId), updates)
      return { success: true, requirement }
    }
    catch (error: any) {
      console.error('更新需求失败:', error)
      return { success: false, error: error.message }
    }
  },
})

// 导出工具
export const requirementTools = {
  createRequirement,
  getRequirement,
  listRequirements,
  updateRequirementTool,
}
