import {
  createTask as apiCreateTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from '@/api/workitem/tasks'
import { createTool } from '@mastra/core'
import { z } from 'zod'

// 任务工具
const createTask = createTool({
  id: 'createTask',
  description: '创建一个新任务',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
    title: z.string().describe('任务标题'),
    description: z.string().describe('任务描述').optional(),
    assignee: z.string().describe('分配给的用户ID').optional(),
    priority: z.enum(['low', 'medium', 'high']).describe('优先级').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).describe('状态').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const task = await apiCreateTask({
        project_id: Number(context.projectId),
        title: context.title,
        description: context.description,
        priority: context.priority || 'medium',
        status: context.status || 'open',
      })
      return { success: true, task }
    }
    catch (error: any) {
      console.error('创建任务失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const getTask = createTool({
  id: 'getTask',
  description: '获取任务详情',
  inputSchema: z.object({
    taskId: z.string().describe('任务ID'),
  }),
  execute: async ({ context }) => {
    try {
      const task = await getTaskById(Number(context.taskId))
      return { success: true, task }
    }
    catch (error: any) {
      console.error('获取任务失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const listTasks = createTool({
  id: 'listTasks',
  description: '列出所有任务',
  inputSchema: z.object({
    random: z.string().describe('随便写就行，因为不能空输入'),
  }),
  execute: async () => {
    try {
      const tasks = await getAllTasks()
      return { success: true, tasks }
    }
    catch (error: any) {
      console.error('列出任务失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const updateTaskTool = createTool({
  id: 'updateTask',
  description: '更新任务信息',
  inputSchema: z.object({
    taskId: z.string().describe('任务ID'),
    title: z.string().describe('任务标题').optional(),
    description: z.string().describe('任务描述').optional(),
    assignee: z.string().describe('分配给的用户ID').optional(),
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
      if (context.assignee)
        updates.assignee = context.assignee
      if (context.priority)
        updates.priority = context.priority
      if (context.status)
        updates.status = context.status

      const task = await updateTask(Number(context.taskId), updates)
      return { success: true, task }
    }
    catch (error: any) {
      console.error('更新任务失败:', error)
      return { success: false, error: error.message }
    }
  },
})

// 导出工具
export const taskTools = {
  createTask,
  getTask,
  listTasks,
  updateTaskTool,
}
