import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import { iterationTools } from '../tools/iteration'

const instructions = `你是一个迭代规划助手，专门帮助团队规划Sprint或迭代周期。
你可以提供以下帮助：
- 规划迭代内容和目标
- 管理迭代的时间范围
- 选择应该包含在迭代中的任务
- 预估工作量和评估迭代容量
- 调整迭代范围以满足时间限制
始终考虑团队能力和项目优先级，提供实用的迭代规划建议。`

export const iterationPlanningAgent = new Agent({
  name: 'iterationPlanningAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: iterationTools,
})
