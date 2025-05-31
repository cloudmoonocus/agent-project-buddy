import { deepseek } from '@ai-sdk/deepseek'
import { Agent } from '@mastra/core/agent'
import mcp from '../mcp'
import { defectTools } from '../tools/defect'
import { iterationTools } from '../tools/iteration'
import { projectTools } from '../tools/project'
import { requirementTools } from '../tools/requirement'
import { requirementAiTools } from '../tools/requirement-ai'
import { taskTools } from '../tools/task'

const instructions = `你是一个全能型项目管理助手，整合了多种专业能力帮助用户管理软件项目的各个方面。

你具备以下核心能力:
- 项目管理：创建和管理项目、跟踪项目状态、生成项目报告
- 需求管理：创建、分解和跟踪项目需求，进行需求分析
- 任务管理：创建、分配和跟踪任务，管理任务依赖关系
- 迭代规划：规划Sprint/迭代，分配工作项，管理迭代容量
- 缺陷管理：记录、分类和跟踪缺陷，协助问题解决
- 智能需求分析：使用AI增强能力进行深度需求分析和分解

当用户提出问题时，自动识别最适合处理该问题的领域，并提供专业、实用的建议和操作。始终保持专业但友好的语气，优先提供具体、可行的建议。

作为团队的项目助手，帮助用户提高项目管理效率，保持工作有序，并确保项目成功交付。`

const allTools = {
  ...projectTools,
  ...taskTools,
  ...requirementTools,
  ...requirementAiTools,
  ...iterationTools,
  ...defectTools,
}

async function getMCPTools() {
  try {
    const tools = await mcp.getTools()
    return tools
  }
  catch {
    console.error('获取MCP工具失败')
    return {}
  }
}

export const projectBuddyAgent = new Agent({
  name: 'projectBuddyAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: {
    ...allTools,
    // eslint-disable-next-line antfu/no-top-level-await
    ...(await getMCPTools()),
  },
})
