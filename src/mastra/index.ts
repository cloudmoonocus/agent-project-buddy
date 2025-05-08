import {
  CopilotRuntime,
  copilotRuntimeNodeHttpEndpoint,
  ExperimentalEmptyAdapter,
} from '@copilotkit/runtime'
import { MastraClient } from '@mastra/client-js'
import { Mastra } from '@mastra/core'
import { registerApiRoute } from '@mastra/core/server'
import { projectBuddyAgent } from './agents/buddy.ts'
import { defectsManagementAgent } from './agents/defects-management.ts'
import { iterationPlanningAgent } from './agents/iteration-planning.ts'
import { projectManagementAgent } from './agents/project-management.ts'
import { requirementsAiAssistantAgent } from './agents/requirements-ai-assistant.ts'
import { requirementsManagementAgent } from './agents/requirements-management.ts'
import { taskManagementAgent } from './agents/task-management.ts'

const serviceAdapter = new ExperimentalEmptyAdapter()

export const mastra = new Mastra({
  agents: {
    projectBuddyAgent,
    projectManagementAgent,
    taskManagementAgent,
    iterationPlanningAgent,
    requirementsManagementAgent,
    defectsManagementAgent,
    requirementsAiAssistantAgent,
  },
  server: {
    port: 4111,
    apiRoutes: [
      registerApiRoute('/copilotkit', {
        method: `POST`,
        handler: async (c) => {
          const client = new MastraClient({
            baseUrl: process.env.MASTRA_API_URL || 'http://localhost:4111',
          })
          const runtime = new CopilotRuntime({
            agents: await client.getAGUI({ resourceId: 'projectBuddyAgent' }),
          })
          const handler = copilotRuntimeNodeHttpEndpoint({
            endpoint: '/copilotkit',
            runtime,
            serviceAdapter,
          })
          return handler.handle(c.req.raw, {})
        },
      }),
    ],
    cors: {
      origin: [process.env.WEB_STATIC_URL || 'http://localhost:3000'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'x-copilotkit-runtime-client-gql-version'],
      credentials: false,
    },
  },
})
