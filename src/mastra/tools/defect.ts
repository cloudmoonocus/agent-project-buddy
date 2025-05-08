import {
  createDefect as apiCreateDefect,
  getAllDefects,
  getDefectById,
  updateDefect,
} from '@/api/workitem/defects'
import { createTool } from '@mastra/core'
import { z } from 'zod'

// 缺陷工具
const createDefect = createTool({
  id: 'createDefect',
  description: '创建一个新缺陷',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
    title: z.string().describe('缺陷标题'),
    description: z.string().describe('缺陷描述').optional(),
    blocking_level: z.enum(['none', 'low', 'medium', 'high']).describe('严重程度').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).describe('状态').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const defect = await apiCreateDefect({
        project_id: Number(context.projectId),
        title: context.title,
        description: context.description,
        blocking_level: context.blocking_level || 'low',
        status: context.status || 'open',
      })

      return { success: true, defect }
    }
    catch (error: any) {
      console.error('创建缺陷失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const getDefect = createTool({
  id: 'getDefect',
  description: '获取缺陷详情',
  inputSchema: z.object({
    defectId: z.string().describe('缺陷ID'),
  }),
  execute: async ({ context }) => {
    try {
      const defect = await getDefectById(Number(context.defectId))
      return { success: true, defect }
    }
    catch (error: any) {
      console.error('获取缺陷失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const listDefects = createTool({
  id: 'listDefects',
  description: '列出所有缺陷',
  inputSchema: z.object({
    random: z.string().describe('随便写就行，因为不能空输入'),
  }),
  execute: async () => {
    try {
      const defects = await getAllDefects()
      return { success: true, defects }
    }
    catch (error: any) {
      console.error('列出缺陷失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const updateDefectTool = createTool({
  id: 'updateDefect',
  description: '更新缺陷信息',
  inputSchema: z.object({
    defectId: z.string().describe('缺陷ID'),
    title: z.string().describe('缺陷标题').optional(),
    description: z.string().describe('缺陷描述').optional(),
    blocking_level: z.enum(['none', 'low', 'medium', 'high']).describe('严重程度').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).describe('状态').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const updates: any = {}
      if (context.title)
        updates.title = context.title
      if (context.description)
        updates.description = context.description
      if (context.blocking_level)
        updates.blocking_level = context.blocking_level
      if (context.status)
        updates.status = context.status

      const defect = await updateDefect(Number(context.defectId), updates)
      return { success: true, defect }
    }
    catch (error: any) {
      console.error('更新缺陷失败:', error)
      return { success: false, error: error.message }
    }
  },
})

// 导出工具
export const defectTools = {
  createDefect,
  getDefect,
  listDefects,
  updateDefectTool,
}
