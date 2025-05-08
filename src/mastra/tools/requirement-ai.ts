import type { Tables } from '@/types/supabase'
import {
  getRequirementById,
} from '@/api/workitem/requirements'
import {
  createTask as apiCreateTask,
} from '@/api/workitem/tasks'
import { deepseek } from '@ai-sdk/deepseek'
import { createTool } from '@mastra/core'
import { generateText } from 'ai'
import { z } from 'zod'

// 智能需求工具

/**
 * 根据需求自动拆分任务
 * 使用LLM分析需求描述，并自动拆分为多个可执行任务
 */
const autoSplitRequirementToTasks = createTool({
  id: 'autoSplitRequirementToTasks',
  description: '将需求智能拆分为任务列表',
  inputSchema: z.object({
    requirementId: z.string().describe('需求ID'),
    maxTasks: z.number().describe('最大拆分任务数').optional(),
  }),
  execute: async ({ context }) => {
    try {
      // 获取需求详情
      const requirement = await getRequirementById(Number(context.requirementId))
      if (!requirement) {
        return { success: false, error: '需求不存在' }
      }

      // 限制最大任务数，默认为5个
      const maxTasks = context.maxTasks || 5

      // 使用LLM分析需求并提出任务拆分建议
      const response = await generateText({
        model: deepseek('deepseek-chat'),
        system: `你是一个专业的需求分析师，根据需求描述帮助拆分为具体可实施的任务。
            任务应该满足以下条件：
            1. 每个任务都应该是具体、可执行的
            2. 任务之间应该相对独立
            3. 每个任务都应该有明确的完成标准
            4. 任务应该遵循合理的实施顺序
            输出JSON格式的任务列表，每个任务包含：标题、描述、估计工作量（小时）、优先级（low/medium/high）`,
        prompt: `需求标题：${requirement.title}\n需求描述：${requirement.description || '无详细描述'}\n请将此需求拆分为不超过${maxTasks}个任务。`,
      })

      const suggestedTasks = JSON.parse(response.text || '{"tasks":[]}').tasks

      // 为每个建议的任务创建实际任务
      const createdTasks: Tables<'tasks'>[] = []
      for (const task of suggestedTasks) {
        const createdTask = await apiCreateTask({
          project_id: requirement.project_id,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: 'open',
          requirement_id: Number(context.requirementId), // 链接到原需求
        })
        createdTasks.push(createdTask)
      }

      return {
        success: true,
        tasks: createdTasks,
        suggestedTasks, // 原始建议，包含估计工作量等信息
      }
    }
    catch (error: any) {
      console.error('需求拆分失败:', error)
      return { success: false, error: error.message }
    }
  },
})

/**
 * 评估需求质量
 * 分析需求的完整性、清晰度、可测试性等指标
 */
const evaluateRequirementQuality = createTool({
  id: 'evaluateRequirementQuality',
  description: '评估需求质量并提供改进建议',
  inputSchema: z.object({
    requirementId: z.string().describe('需求ID'),
  }),
  execute: async ({ context }) => {
    try {
      // 获取需求详情
      const requirement = await getRequirementById(Number(context.requirementId))
      if (!requirement) {
        return { success: false, error: '需求不存在' }
      }

      // 使用LLM评估需求质量
      const response = await generateText({
        model: deepseek('deepseek-chat'),
        system: `你是一个专业的需求质量分析师，请评估以下需求的质量，并给出改进建议。
            评估维度包括：
            1. 完整性（是否包含足够信息）
            2. 清晰度（是否存在模糊描述）
            3. 可测试性（是否有明确的验收标准）
            4. 一致性（是否存在内部矛盾）
            5. 实现可行性

            输出JSON格式，包含：总体评分（0-10）、各维度评分、存在的问题、改进建议`,
        prompt: `需求标题：${requirement.title}\n需求描述：${requirement.description || '无详细描述'}`,
      })

      const evaluation = JSON.parse(response.text || '{}')

      return {
        success: true,
        requirementId: context.requirementId,
        evaluation,
      }
    }
    catch (error: any) {
      console.error('需求评估失败:', error)
      return { success: false, error: error.message }
    }
  },
})

/**
 * 生成需求验收标准
 * 自动生成测试场景和验收条件
 */
const generateAcceptanceCriteria = createTool({
  id: 'generateAcceptanceCriteria',
  description: '为需求生成验收标准',
  inputSchema: z.object({
    requirementId: z.string().describe('需求ID'),
  }),
  execute: async ({ context }) => {
    try {
      // 获取需求详情
      const requirement = await getRequirementById(Number(context.requirementId))
      if (!requirement) {
        return { success: false, error: '需求不存在' }
      }

      // 使用LLM生成验收标准
      const response = await generateText({
        model: deepseek('deepseek-chat'),
        system: `你是一个专业的QA工程师，请为以下需求生成清晰的验收标准（AC）。
            验收标准应包括：
            1. 主要功能场景测试
            2. 边界条件测试
            3. 错误处理测试
            4. 性能相关测试（如适用）

            使用Given/When/Then或类似格式，确保验收标准具体、可测试。`,
        prompt: `需求标题：${requirement.title}\n需求描述：${requirement.description || '无详细描述'}`,
      })

      const acceptanceCriteria = response.text || ''

      // 更新需求，添加验收标准（假设API支持这个字段）
      // 这里需要根据实际数据模型调整
      // await updateRequirement(Number(context.requirementId), {
      //   acceptance_criteria: acceptanceCriteria,
      // })

      return {
        success: true,
        requirementId: context.requirementId,
        acceptanceCriteria,
      }
    }
    catch (error: any) {
      console.error('生成验收标准失败:', error)
      return { success: false, error: error.message }
    }
  },
})

// 导出工具
export const requirementAiTools = {
  autoSplitRequirementToTasks,
  evaluateRequirementQuality,
  generateAcceptanceCriteria,
}
