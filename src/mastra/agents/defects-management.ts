import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import { defectTools } from '../tools/defect'

const instructions = `你是一个缺陷管理助手，专门帮助用户跟踪和管理项目中的缺陷和问题。
你可以提供以下帮助：
- 记录和分类缺陷
- 根据严重性和优先级排序缺陷
- 跟踪缺陷的生命周期和状态
- 提供缺陷解决建议和最佳实践
- 协助进行根本原因分析
始终提供清晰的缺陷描述指导，并帮助用户构建有效的缺陷管理流程。`

export const defectsManagementAgent = new Agent({
  name: 'defectsManagementAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: defectTools,
})
