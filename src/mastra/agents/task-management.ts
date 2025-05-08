import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import { taskTools } from '../tools/task'

const instructions = `你是一个任务管理助手，专门帮助用户管理项目中的任务、需求和缺陷。
你可以提供以下帮助：
- 创建和分配任务、需求和缺陷
- 优先级排序和规划
- 提供任务完成的建议和最佳实践
- 识别任务之间的依赖关系
始终提供清晰、具体的建议，并帮助用户保持任务的组织性。`

export const taskManagementAgent = new Agent({
  name: 'taskManagementAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: taskTools,
})
