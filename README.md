# 智能需求管理平台 (SMP)

[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.6-646cff.svg)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.24.5-0170fe.svg)](https://ant.design/)

## 项目概述

智能需求管理平台是一个现代化的项目管理和需求追踪系统，融合了人工智能能力，帮助团队高效地管理软件开发生命周期。平台支持需求管理、任务分配、缺陷跟踪、迭代规划等功能，并提供AI辅助功能以提高需求分析和项目管理效率。

## 主要功能

### 项目管理
- 创建和管理项目
- 项目仪表盘，展示项目整体状态和进度
- 项目指标和统计数据可视化

### 需求管理
- 需求创建、编辑和跟踪
- AI辅助需求分析和质量评估
- 自动生成需求验收标准
- 需求智能拆分为任务

### 任务管理
- 任务创建、分配和状态跟踪
- 任务与需求关联
- 任务进度监控

### 缺陷管理
- 缺陷创建、分类和跟踪
- 缺陷严重程度评估
- 缺陷状态生命周期管理

### 迭代规划
- 迭代创建与时间管理
- 工作项分配到迭代
- 迭代进度和完成度跟踪
- AI辅助迭代规划

### 智能助手
- 需求分析和拆分辅助
- 项目管理建议
- 工作项优先级排序辅助

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Ant Design & @emotion/styled（UI组件和样式）
- React Router Dom（路由管理）
- Zustand（状态管理）
- Ahooks（自定义hooks库）

### AI能力
- @ai-sdk/deepseek（AI模型集成）
- @copilotkit（AI助手集成）
- @mastra（AI工作流和代理）

### 数据存储
- Supabase（后端服务和数据库）

## 项目结构

```
src/
  ├── api/            # API接口层
  │   ├── auth/       # 认证相关API
  │   └── workitem/   # 工作项（需求、任务、缺陷）API
  ├── components/     # 可复用组件
  │   ├── common/     # 通用组件
  │   ├── iteration/  # 迭代相关组件
  │   ├── user/       # 用户相关组件
  │   └── workitem/   # 工作项相关组件
  ├── mastra/         # AI助手和代理
  │   ├── agents/     # 各种专业领域的AI代理
  │   └── tools/      # AI工具集
  ├── pages/          # 页面组件
  │   ├── auth/       # 认证页面
  │   ├── home/       # 首页
  │   └── project/    # 项目相关页面
  ├── store/          # 状态管理
  ├── styles/         # 全局样式和主题配置
  ├── types/          # 类型定义
  └── utils/          # 工具函数
```

## 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
# 或
yarn
```

### 开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 构建
```bash
npm run build
# 或
yarn build
```

### AI助手开发服务器
```bash
npm run dev:mastra
# 或
yarn dev:mastra
```

## 贡献

如果你想为项目做出贡献：
1. Fork这个项目
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的改动 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个Pull Request

## 许可证

[MIT](LICENSE)

## 联系方式

如有问题或建议，请联系项目维护者。
