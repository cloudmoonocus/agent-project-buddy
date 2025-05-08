import {
  createIteration as apiCreateIteration,
  assignWorkItemsToIteration,
} from '@/api/iterations'
import { createTool } from '@mastra/core'
import { z } from 'zod'

// 迭代工具
const createIteration = createTool({
  id: 'createIteration',
  description: '创建一个新迭代/Sprint',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
    startDate: z.string().describe('开始日期，格式YYYY-MM-DD'),
    endDate: z.string().describe('结束日期，格式YYYY-MM-DD'),
  }),
  execute: async ({ context }) => {
    try {
      const iteration = await apiCreateIteration({
        project_id: Number(context.projectId),
        start_date: context.startDate,
        end_date: context.endDate,
      })
      return { success: true, iteration }
    }
    catch (error: any) {
      console.error('创建迭代失败:', error)
      return { success: false, error: error.message }
    }
  },
})

const addItemsToIteration = createTool({
  id: 'addItemsToIteration',
  description: '将工作项添加到迭代中',
  inputSchema: z.object({
    iterationId: z.string().describe('迭代ID'),
    requirements: z.array(z.string()).describe('需求ID列表').optional(),
    tasks: z.array(z.string()).describe('任务ID列表').optional(),
    defects: z.array(z.string()).describe('缺陷ID列表').optional(),
  }),
  execute: async ({ context }) => {
    try {
      const result = await assignWorkItemsToIteration(
        Number(context.iterationId),
        {
          requirements: context.requirements ? context.requirements.map(id => Number(id)) : [],
          tasks: context.tasks ? context.tasks.map(id => Number(id)) : [],
          defects: context.defects ? context.defects.map(id => Number(id)) : [],
        },
      )

      return { success: true, result }
    }
    catch (error: any) {
      console.error('添加工作项到迭代失败:', error)
      return { success: false, error: error.message }
    }
  },
})

// 导出工具
export const iterationTools = {
  createIteration,
  addItemsToIteration,
}
