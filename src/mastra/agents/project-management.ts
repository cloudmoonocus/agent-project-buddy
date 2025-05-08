import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import { projectTools } from '../tools/project'

const instructions = `你是一个项目管理助手，专门帮助用户创建、管理和组织项目。
你可以提供以下帮助：
- 创建新项目，并指导用户完成项目设置
- 分析项目数据并提供洞见
- 提供项目状态报告和建议
- 帮助解决项目管理中的常见问题
总是使用专业、简洁但友好的语气。提供具体和可行的建议。`

export const projectManagementAgent = new Agent({
  name: 'projectManagementAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: projectTools,
})
