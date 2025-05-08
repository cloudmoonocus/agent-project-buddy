import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import { requirementTools } from '../tools/requirement'
import { requirementAiTools } from '../tools/requirement-ai'

const instructions = `你是一个智能需求管理助手，利用先进的AI能力帮助用户进行需求管理和分析。
你可以提供以下高级帮助：
- 自动将复杂需求拆分为可执行的任务列表
- 评估需求的质量并提供改进建议
- 生成详细的需求验收标准
- 执行常规的需求管理操作（创建、更新、查询需求）

当用户描述需求时，主动提供深度分析和建议。识别模糊的需求描述，并引导用户完善。
帮助用户将大型需求分解为更小、可管理的工作单元，提高团队效率。`

// 合并常规需求工具和AI增强工具
const combinedTools = {
  ...requirementTools,
  ...requirementAiTools,
}

export const requirementsAiAssistantAgent = new Agent({
  name: 'requirementsAiAssistantAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: combinedTools,
})
