---
theme: default
transition: fade
title: 基于 Agent + MCP 的需求管理平台设计与实现
paginate: true
highlighter: shiki
fonts:
  sans: Noto Sans SC
---

# 基于 Agent + MCP 的需求管理平台设计与实现

AI 驱动的智能化需求管理解决方案

<div class="uppercase text-sm tracking-widest">
冯少康 | 通信工程 2103 | 悉尼智能科技学院
</div>

<div class="abs-bl mx-14 my-12 flex">
  <img src="https://www.neu.edu.cn/__local/4/30/EA/0509D19C69223A9F496920EB50A_B834D310_1019D.png" class="h-8">
  <div class="ml-3 flex flex-col text-left">
    <div>东北大学</div>
    <div class="text-sm opacity-50">2025.06.03</div>
  </div>
</div>

---
layout: center
---

<div class="from-red-50 via-orange-50 to-yellow-50">
  <!-- 左侧内容区 -->
  <div class="space-y-8">
    <!-- 标题区域 -->
    <div class="text-center mb-8">
      <h2 class="font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
        传统需求管理痛点：效率低下
      </h2>
      <div class="text-gray-600 font-medium">
        手工操作繁琐，信息孤岛严重
      </div>
    </div>
    <!-- 痛点列表 -->
    <div class="grid grid-cols-1 gap-4">
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-red-100">
        <div class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">1</span>
        </div>
        <div>
          <span class="font-bold text-red-700 dark:text-red-400">需求收集繁琐：</span>
          <span class="text-gray-700 dark:text-gray-300">多渠道沟通、反馈周期长，易遗漏关键信息</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/30">
        <div class="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">2</span>
        </div>
        <div>
          <span class="font-bold text-orange-700 dark:text-orange-400">任务拆分依赖经验：</span>
          <span class="text-gray-700 dark:text-gray-300">缺乏统一标准，拆分颗粒度参差不齐</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-yellow-100 dark:border-yellow-900/30">
        <div class="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">3</span>
        </div>
        <div>
          <span class="font-bold text-yellow-700 dark:text-yellow-600">状态同步滞后：</span>
          <span class="text-gray-700 dark:text-gray-300">不同系统独立运转，更新推送不及时</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
        <div class="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">4</span>
        </div>
        <div>
          <span class="font-bold text-red-700 dark:text-red-400">人工干预频繁：</span>
          <span class="text-gray-700 dark:text-gray-300">阶段性审核、手动分派，耗时且易出错</span>
        </div>
      </div>
    </div>
  </div>
</div>

---
layout: center
---

<img class="h-120 " src="./assets/tencent.png" />
<div class="text-center text-gray text-14px mt-8px">图片来源：腾讯 CODING 平台</div>

---
layout: center
---

<div class="from-red-50 via-orange-50 to-yellow-50">
  <!-- 左侧内容区 -->
  <div class="flex-1 space-y-8">
    <!-- 标题区域 -->
    <div class="text-center mb-8">
      <h2 class="font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
        Agent + MCP 方案：智能驱动
      </h2>
      <div class="text-gray-600 font-medium">
        从“手动”到“自动”一跃而变
      </div>
    </div>
    <!-- 痛点列表 -->
    <div class="grid grid-cols-1 gap-4">
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-red-100">
        <div class="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">1</span>
        </div>
        <div>
          <span class="font-bold text-red-700 dark:text-red-400">AI Agent: </span>
          <span class="text-gray-700 dark:text-gray-300">通过大模型解析需求，实现自动化拆分与分配</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900/30">
        <div class="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">2</span>
        </div>
        <div>
          <span class="font-bold text-orange-700 dark:text-orange-400">MCP 协议: </span>
          <span class="text-gray-700 dark:text-gray-300">统一接入各类工具与平台，打通数据与任务流</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-yellow-100 dark:border-yellow-900/30">
        <div class="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">3</span>
        </div>
        <div>
          <span class="font-bold text-yellow-700 dark:text-yellow-600">价值诉求: </span>
          <span class="text-gray-700 dark:text-gray-300">快速响应、实时同步、精准预警，构建智能化闭环</span>
        </div>
      </div>
      <div class="flex items-center space-x-4 p-4 bg-white/70 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30">
        <div class="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-bold">4</span>
        </div>
        <div>
          <span class="font-bold text-red-700 dark:text-red-400">行业趋势：</span>
          <span class="text-gray-700 dark:text-gray-300">DevOps、AIOps 与低代码日渐成熟，需求自动化迫在眉睫</span>
        </div>
      </div>
    </div>
  </div>
</div>

---
layout: center
---

<SlidevVideo class="h-120" controls>
  <source src="./assets/AgentVideo.mp4" type="video/mp4" />
</SlidevVideo>
<div class="text-center text-gray text-14px mt-8px">Agent 智能创建“需求”和“任务”</div>

---
layout: center
---

<SlidevVideo class="h-120" controls>
  <source src="./assets/MCPVideo.mp4" type="video/mp4" />
</SlidevVideo>
<div class="text-center text-gray text-14px mt-8px">通过灵活配置 MCP 实现动态工具扩展</div>

---
layout: center
---

<div class="space-y-8">
  <!-- 标题区域 -->
  <div class="text-center mb-8">
    <h2 class="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
      技术核心一：AI Agent
    </h2>
    <div class="text-lg text-gray-600 font-medium">
      类比："一个能理解指令、自动干活的团队小助手"
    </div>
  </div>
  <!-- Agent 工作流程 -->
  <div class="flex justify-center items-center space-x-6 mb-8">
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white text-xl">👁️</span>
      </div>
      <span class="font-bold text-blue-700">感知</span>
    </div>
    <div class="text-gray-400 text-2xl">→</div>
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white text-xl">🧠</span>
      </div>
      <span class="font-bold text-purple-700">决策</span>
    </div>
    <div class="text-gray-400 text-2xl">→</div>
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white text-xl">⚡</span>
      </div>
      <span class="font-bold text-green-700">执行</span>
    </div>
  </div>
  <!-- 平台职责 -->
  <div class="bg-white/70 rounded-2xl p-6 shadow-lg border border-gray-200">
    <h3 class="text-xl font-bold text-center mb-6 text-gray-800">在平台中负责</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        <div class="text-3xl mb-3">📝</div>
        <div class="font-bold text-blue-700 mb-2">解析用户需求</div>
        <div class="text-sm text-gray-600">理解自然语言描述，提取关键信息</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
        <div class="text-3xl mb-3">⚙️</div>
        <div class="font-bold text-purple-700 mb-2">自动生成任务</div>
        <div class="text-sm text-gray-600">智能拆分，创建结构化任务</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
        <div class="text-3xl mb-3">🔄</div>
        <div class="font-bold text-green-700 mb-2">动态调度执行</div>
        <div class="text-sm text-gray-600">优化流程，自动分配资源</div>
      </div>
    </div>
  </div>
</div>

---
layout: center
---

<div class="space-y-8">
  <!-- 标题区域 -->
  <div class="text-center mb-8">
    <h2 class="text-3xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
      技术核心二：MCP 协议
    </h2>
    <div class="text-lg text-gray-600 font-medium">
      类比："一个统一的插头标准，让 AI 轻松接入各种工具"
    </div>
  </div>
  <!-- MCP 工作流程 -->
  <div class="flex justify-center items-center space-x-6 mb-8">
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white text-xl">🔌</span>
      </div>
      <span class="font-bold text-green-700">连接</span>
    </div>
    <div class="text-gray-400 text-2xl">→</div>
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white text-xl">⚡</span>
      </div>
      <span class="font-bold text-teal-700">调用</span>
    </div>
    <div class="text-gray-400 text-2xl">→</div>
    <div class="flex items-center space-x-4">
      <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
        <span class="text-white text-xl">🔄</span>
      </div>
      <span class="font-bold text-cyan-700">同步</span>
    </div>
  </div>
  <!-- 平台职责 -->
  <div class="bg-white/70 rounded-2xl p-6 shadow-lg border border-gray-200">
    <h3 class="text-xl font-bold text-center mb-6 text-gray-800">在平台中负责</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
        <div class="text-3xl mb-3">🔧</div>
        <div class="font-bold text-green-700 mb-2">工具动态注册</div>
        <div class="text-sm text-gray-600">即插即用，快速扩展外部能力</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
        <div class="text-3xl mb-3">📊</div>
        <div class="font-bold text-teal-700 mb-2">状态实时同步</div>
        <div class="text-sm text-gray-600">与 Jira、GitHub 双向数据流</div>
      </div>
      <div class="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
        <div class="text-3xl mb-3">🌐</div>
        <div class="font-bold text-cyan-700 mb-2">多系统集成</div>
        <div class="text-sm text-gray-600">统一协议，消除数据孤岛</div>
      </div>
    </div>
  </div>
</div>

---
layout: center
---

## 系统架构概览

<div class="mt-6 grid grid-cols-2 gap-6">
  <!-- 前端展示层 -->
  <div class="flex items-start p-6 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800/30 dark:to-blue-900/30 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl shadow-md mr-5">
      🎨
    </div>
    <div>
      <h3 class="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">前端展示层</h3>
      <p class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">React + Tailwind CSS + Ant Design</p>
      <p class="text-gray-700 dark:text-gray-300 text-sm">
        构建响应式用户界面，提供直观、高效的需求管理与交互体验。
      </p>
    </div>
  </div>
  <!-- 智能决策层 -->
  <div class="flex items-start p-6 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800/30 dark:to-purple-900/30 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-tr from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl shadow-md mr-5">
      🤖
    </div>
    <div>
      <h3 class="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">智能决策层</h3>
      <p class="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">Mastra 框架 + DeepSeek LLM</p>
      <p class="text-gray-700 dark:text-gray-300 text-sm">
        核心 AI Agent，负责自然语言需求理解、任务智能分解与调度。
      </p>
    </div>
  </div>
  <!-- 数据服务层 -->
  <div class="flex items-start p-6 bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-800/30 dark:to-green-900/30 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl shadow-md mr-5">
      🗄️
    </div>
    <div>
      <h3 class="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">数据服务层</h3>
      <p class="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Supabase (PostgreSQL)</p>
      <p class="text-gray-700 dark:text-gray-300 text-sm">
        提供稳定可靠的云端数据库服务与实时数据同步能力，支撑高并发读写。
      </p>
    </div>
  </div>
  <!-- 数据流转与集成层 -->
  <div class="flex items-start p-6 bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800/30 dark:to-orange-900/30 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl shadow-md mr-5">
      🔄
    </div>
    <div>
      <h3 class="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-1">数据流转与集成层</h3>
      <p class="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">MCP 协议 + API 网关</p>
      <p class="text-gray-700 dark:text-gray-300 text-sm">
        通过 MCP 协议实现与 Jira、GitHub 等外部系统的无缝集成和双向数据同步。
      </p>
    </div>
  </div>
</div>

---
layout: center
---

<h2 class="text-center">AI 交互数据流程图</h2>

<img class="mt-14px h-100 mx-auto" src="./assets/AIDataFlow.png" />

---

## 基于 Mastra 框架的 Agent 设计

<div class="mt-14px">1. 创建需求 tool 定义</div>
```ts
const createRequirement = createTool({
  id: 'createRequirement',
  description: '创建一个新需求',
  inputSchema: z.object({
    projectId: z.string().describe('项目ID'),
    title: z.string().describe('需求标题'),
    description: z.string().describe('需求描述').optional(),
    priority: z.enum(['low', 'medium', 'high']).describe('优先级').optional(),
    status: z.enum(['open', 'in_progress', 'closed']).describe('状态').optional(),
  }),
  execute: async ({ context }) => {
    const requirement = await apiCreateRequirement({
      project_id: Number(context.projectId),
      title: context.title,
      description: context.description,
      priority: context.priority || 'medium',
      status: context.status || 'open',
    })
    return { success: true, requirement }
  }
})
```

---

## 基于 Mastra 框架的 Agent 设计

<div class="mt-14px">2. System Prompt</div>
```md
你是一个全能型项目管理助手，整合了多种专业能力帮助用户管理软件项目的各个方面。

你具备以下核心能力:
- 项目管理：创建和管理项目、跟踪项目状态、生成项目报告
- 需求管理：创建、分解和跟踪项目需求，进行需求分析
- 任务管理：创建、分配和跟踪任务，管理任务依赖关系
- 迭代规划：规划Sprint/迭代，分配工作项，管理迭代容量
- 缺陷管理：记录、分类和跟踪缺陷，协助问题解决
- 智能需求分析：使用AI增强能力进行深度需求分析和分解

当用户提出问题时，自动识别最适合处理该问题的领域，并提供专业、实用的建议和操作。始终保持专业但友好的语气，优先提供具体、可行的建议。

作为团队的项目助手，帮助用户提高项目管理效率，保持工作有序，并确保项目成功交付。
```

---

## 基于 Mastra 框架的 Agent 设计

<div class="mt-14px">3. 初始化 Buddy Agent</div>
```ts
const allTools = {
  ...projectTools, ...taskTools, ...requirementTools,
  ...requirementAiTools, ...iterationTools, ...defectTools,
}
async function getMCPTools() {
  try {
    const tools = await mcp.getTools()
    return tools
  } catch(error) {
    console.error('获取 MCP 工具失败', error)
    return {}
  }
}
export const projectBuddyAgent = new Agent({
  name: 'projectBuddyAgent',
  model: deepseek('deepseek-chat'),
  instructions,
  tools: {
    ...allTools,
    ...(await getMCPTools()),
  },
})
```

---

## MCP 集成：拓展 Agent 能力

<div class="mt-14px"></div>
```ts
async function getMcpConfig(userId: string) {
  const response = await fetch(
    `${getEnv('SUPABASE_URL')}/rest/v1/user_configs?select=mcp_config&user_id=eq.${userId}`,
    {
      method: 'GET',
      headers: {
        'apikey': getEnv('SUPABASE_ANON_KEY'),
        'Authorization': `Bearer ${getEnv('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
    },
  )
  const data = await response.json()
  return data
}
const mcpConfig: Tables<'user_configs'>[] = await getMcpConfig()
const mcp = new MCPClient(first(mcpConfig)?.mcp_config || {})
```

---

<!-- 标题区域 -->
<div class="mb-6">
  <h2 class="mb-2">
    核心数据模型设计
  </h2>
  <div class="text-lg text-slate-600 dark:text-slate-400 font-medium">
    PostgreSQL + Row Level Security + 实时订阅
  </div>
</div>
<div class="grid grid-cols-5 gap-8 items-center">
  <!-- 左侧图片区域 -->
  <div class="col-span-2">
    <div class="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
      <img class="w-full object-contain rounded-xl shadow-lg" src="./assets/SupabaseSchema.png" />
      <div class="text-center text-slate-600 dark:text-slate-400 text-sm mt-4 font-medium">
        Supabase 数据库表结构图
      </div>
    </div>
  </div>
  <!-- 右侧内容区域 -->
  <div class="col-span-3">
    <!-- 特性卡片 -->
    <div class="flex flex-col space-y-4">
      <!-- 实体划分 -->
      <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 rounded-xl border border-blue-200 dark:border-blue-700">
        <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
          <span class="text-white text-lg">🧱</span>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">实体层次清晰</h3>
          <div class="text-xs text-blue-600 dark:text-blue-400">Projects → Iterations → Requirements → Tasks</div>
        </div>
      </div>
      <!-- 关联关系 -->
      <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30 rounded-xl border border-green-200 dark:border-green-700">
        <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
          <span class="text-white text-lg">🔗</span>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-bold text-green-700 dark:text-green-300 mb-1">外键关联强约束</h3>
          <div class="text-xs text-green-600 dark:text-green-400">确保数据一致性与可追溯性</div>
        </div>
      </div>
      <!-- 状态管理 -->
      <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30 rounded-xl border border-purple-200 dark:border-purple-700">
        <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
          <span class="text-white text-lg">⚙️</span>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-bold text-purple-700 dark:text-purple-300 mb-1">枚举字段标准化</h3>
          <div class="text-xs text-purple-600 dark:text-purple-400">status、priority、blocking_level</div>
        </div>
      </div>
      <!-- MCP 配置 -->
      <div class="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-xl border border-orange-200 dark:border-orange-700">
        <div class="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
          <span class="text-white text-lg">🔧</span>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-bold text-orange-700 dark:text-orange-300 mb-1">MCP 动态配置</h3>
          <div class="text-xs text-orange-600 dark:text-orange-400">jsonb 存储，支持灵活扩展</div>
        </div>
      </div>
    </div>
  </div>
</div>

---

## 系统集成与测试

<div class="mt-8 flex gap-8 items-start">
  <!-- 左侧: Vercel CICD 图片 -->
  <div class="w-110">
    <div class="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-4 shadow-xl border border-slate-200">
      <img class="w-full object-contain rounded-xl shadow-lg" src="./assets/VercelDeloy.png" />
      <div class="text-center text-slate-600 text-sm mt-3 font-medium">
        Vercel CI/CD 集成部署
      </div>
    </div>
  </div>
  <!-- 右侧: 环境配置详情 -->
  <div class="flex-1 space-y-3">
    <!-- GitHub 集成 -->
    <div class="bg-white/70 rounded-xl py-3 px-5 shadow-sm border border-gray-200">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <span class="text-white text-xs">🐙</span>
        </div>
        <h3 class="text-base font-bold text-gray-800">GitHub 自动集成</h3>
      </div>
      <div class="text-xs text-gray-600 space-y-1">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-black rounded-full"></div>
          <div>代码推送自动触发构建</div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-black rounded-full"></div>
          <div>Pull Request 自动部署预览</div>
        </div>
      </div>
    </div>
    <!-- 多环境管理 -->
    <div class="bg-white/70 rounded-xl py-3 px-5 shadow-sm border border-gray-200">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white text-xs">🌍</span>
        </div>
        <h3 class="text-base font-bold text-gray-800">多环境部署</h3>
      </div>
      <div class="space-y-1">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span class="text-xs font-medium text-yellow-700">Preview: PR 分支自动预览</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-green-500 rounded-full"></div>
          <span class="text-xs font-medium text-green-700">Production: main 分支生产部署</span>
        </div>
      </div>
    </div>
    <!-- 环境变量管理 -->
    <div class="bg-white/70 rounded-xl py-3 px-5 shadow-sm border border-gray-200">
      <div class="flex items-center space-x-3 mb-2">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <span class="text-white text-xs">🔐</span>
        </div>
        <h3 class="text-base font-bold text-gray-800">配置隔离</h3>
      </div>
      <div class="text-xs text-gray-600 space-y-1">
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-black rounded-full"></div>
          <div>数据库连接分环境配置</div>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-2 h-2 bg-black rounded-full"></div>
          <div>API 密钥通过环境变量安全管理</div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="mt-12"></div>

> Vercel 是一个面向前端开发者的云平台，用于快速构建、部署和交付现代 Web 应用。

---

## 系统集成与测试

<div class="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-200">
  <div class="flex items-center space-x-3 mb-4">
    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
      <span class="text-white text-xl">💬</span>
    </div>
    <h3 class="text-xl font-bold text-gray-800">多轮对话优化 System Prompt</h3>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="space-y-3">
      <div class="bg-white/70 rounded-lg p-4 border border-blue-100">
        <h4 class="font-bold text-blue-700 mb-2 flex items-center">
          <span class="mr-2">🎯</span>角色定位迭代
        </h4>
        <div class="text-sm text-gray-600 space-y-1">
          <div>• 从通用助手 → 专业项目管理助手</div>
          <div>• 增强业务领域理解能力</div>
          <div>• 优化指令响应精准度</div>
        </div>
      </div>
      <div class="bg-white/70 rounded-lg p-4 border border-purple-100">
        <h4 class="font-bold text-purple-700 mb-2 flex items-center">
          <span class="mr-2">🔄</span>上下文记忆优化
        </h4>
        <div class="text-sm text-gray-600 space-y-1">
          <div>• 记录项目状态与历史操作</div>
          <div>• 保持会话连贯性</div>
          <div>• 支持复杂任务链式执行</div>
        </div>
      </div>
    </div>
    <div class="space-y-3">
      <div class="bg-white/70 rounded-lg p-4 border border-green-100">
        <h4 class="font-bold text-green-700 mb-2 flex items-center">
          <span class="mr-2">⚙️</span>工具调用优化
        </h4>
        <div class="text-sm text-gray-600 space-y-1">
          <div>• 智能选择最适合的工具组合</div>
          <div>• 减少无效 API 调用</div>
          <div>• 提升执行效率</div>
        </div>
      </div>
      <div class="bg-white/70 rounded-lg p-4 border border-orange-100">
        <h4 class="font-bold text-orange-700 mb-2 flex items-center">
          <span class="mr-2">📊</span>反馈循环机制
        </h4>
        <div class="text-sm text-gray-600 space-y-1">
          <div>• 根据用户反馈调整策略</div>
          <div>• 学习用户操作偏好</div>
          <div>• 持续改进对话质量</div>
        </div>
      </div>
    </div>
  </div>
</div>

---

## 系统集成与测试

<div class="mt-14px"></div>

通过 GitHub Actions 实现自动化测试，确保代码质量和功能稳定性。
```yaml
# .github/workflows/test.yml
name: Run Tests
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
```

---

## 总结

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
    <div class="text-center mb-3">
      <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
        <span class="text-white text-xl">🤖</span>
      </div>
    </div>
    <h3 class="font-bold text-blue-700 text-center mb-2">AI Agent 智能化</h3>
    <div class="text-sm text-gray-600 space-y-1">
      <div>• 自然语言需求理解与解析</div>
      <div>• 智能任务分解与调度</div>
      <div>• 基于历史数据的优化决策</div>
    </div>
  </div>

  <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
    <div class="text-center mb-3">
      <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
        <span class="text-white text-xl">🔗</span>
      </div>
    </div>
    <h3 class="font-bold text-green-700 text-center mb-2">MCP 协议集成</h3>
    <div class="text-sm text-gray-600 space-y-1">
      <div>• 统一工具接入标准</div>
      <div>• Jira、GitHub 双向同步</div>
      <div>• 动态扩展外部能力</div>
    </div>
  </div>

  <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
    <div class="text-center mb-3">
      <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
        <span class="text-white text-xl">⚡</span>
      </div>
    </div>
    <h3 class="font-bold text-purple-700 text-center mb-2">流程自动化</h3>
    <div class="text-sm text-gray-600 space-y-1">
      <div>• 需求采集到变更追踪闭环</div>
      <div>• 风险预警与异常监测</div>
      <div>• 显著提升管理效率</div>
    </div>
  </div>
</div>

<div class="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
  <h4 class="font-bold text-gray-700 mb-2 flex items-center">
    <span class="mr-2">🎯</span>核心贡献
  </h4>
  <div class="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-3">
    <div>
      <span class="font-medium text-blue-600">理论创新：</span>标准化AI-企业系统双向通信
    </div>
    <div>
      <span class="font-medium text-green-600">技术实现：</span>高内聚低耦合设计，降低系统集成复杂度
    </div>
    <div>
      <span class="font-medium text-purple-600">工程验证：</span>高并发环境下动态工具调用稳定性得到验证
    </div>
    <div>
      <span class="font-medium text-orange-600">应用价值：</span>项目全流程自动化，用户认可度高
    </div>
  </div>
</div>

---

## 展望

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
  <!-- 智能算法优化 -->
  <div class="space-y-4">
    <div class="text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
        <span class="text-white text-2xl">🧠</span>
      </div>
      <h3 class="text-lg font-bold text-gray-800">智能算法优化</h3>
    </div>
    <div class="space-y-3">
      <div class="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <h4 class="font-bold text-blue-700 text-sm mb-1">自适应学习</h4>
        <div class="text-xs text-gray-600">持续优化需求解析准确率</div>
      </div>
      <div class="p-3 bg-purple-50 rounded-lg border border-purple-100">
        <h4 class="font-bold text-purple-700 text-sm mb-1">跨领域扩展</h4>
        <div class="text-xs text-gray-600">增强专业术语理解，支持更多行业场景</div>
      </div>
    </div>
  </div>

  <!-- 系统架构升级 -->
  <div class="space-y-4">
    <div class="text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
        <span class="text-white text-2xl">🏗️</span>
      </div>
      <h3 class="text-lg font-bold text-gray-800">系统架构升级</h3>
    </div>
    <div class="space-y-3">
      <div class="p-3 bg-green-50 rounded-lg border border-green-100">
        <h4 class="font-bold text-green-700 text-sm mb-1">实时通信增强</h4>
        <div class="text-xs text-gray-600">WebSocket 双向推送，异步消息队列优化</div>
      </div>
      <div class="p-3 bg-teal-50 rounded-lg border border-teal-100">
        <h4 class="font-bold text-teal-700 text-sm mb-1">安全合规</h4>
        <div class="text-xs text-gray-600">可追溯存证与差分隐私保护</div>
      </div>
    </div>
  </div>

  <!-- 应用场景拓展 -->
  <div class="space-y-4">
    <div class="text-center">
      <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
        <span class="text-white text-2xl">🚀</span>
      </div>
      <h3 class="text-lg font-bold text-gray-800">应用场景拓展</h3>
    </div>
    <div class="space-y-3">
      <div class="p-3 bg-orange-50 rounded-lg border border-orange-100">
        <h4 class="font-bold text-orange-700 text-sm mb-1">多行业验证</h4>
        <div class="text-xs text-gray-600">医疗设备研制、智能制造、金融风控</div>
      </div>
      <div class="p-3 bg-red-50 rounded-lg border border-red-100">
        <h4 class="font-bold text-red-700 text-sm mb-1">生态扩展</h4>
        <div class="text-xs text-gray-600">适配 Notion、飞书等更多协作工具</div>
      </div>
    </div>
  </div>
</div>

<div class="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
  <div class="flex items-center space-x-3 mb-3">
    <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
      <span class="text-white text-sm">🎯</span>
    </div>
    <h4 class="font-bold text-indigo-700">长远目标</h4>
  </div>
  <div class="text-sm text-gray-600">
    构建多 Agent 协作生态，实现项目全生命周期智能化管理，为企业数字化转型提供坚实的技术支撑与创新驱动力。
  </div>
</div>

---
layout: center
---

<div class="flex flex-col items-center justify-center h-full space-y-8">
  <!-- 感谢标题 -->
  <div class="text-center space-y-4">
    <h1 class="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
      感谢各位老师
    </h1>
    <div class="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
  </div>

  <!-- 答辩人信息 -->
  <div class="relative">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur opacity-75"></div>
    <div class="relative bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
      <div class="text-center space-y-3">
        <div class="text-2xl font-bold text-gray-800 dark:text-white">答辩人</div>
        <div class="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          冯少康
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">通信工程 2103 | 悉尼智能科技学院</div>
      </div>
    </div>
  </div>
</div>
