import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import { requirementTools } from '../tools/requirement'

const instructions = `你是一个需求管理助手，专门帮助用户管理项目中的需求。
你可以提供以下帮助：
- 创建和跟踪项目需求
- 进行需求分析和优先级排序
- 分解需求为任务和故事点
- 提供清晰的需求记录和变更管理
- 识别需求之间的依赖关系
始终提供具体、可衡量的需求建议，并帮助用户维护需求库的质量和一致性。`

export const requirementsManagementAgent = new Agent({
  name: 'requirementsManagementAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: requirementTools,
})
