import { CopilotKit } from '@copilotkit/react-core'
import { CopilotSidebar } from '@copilotkit/react-ui'
import '@copilotkit/react-ui/styles.css'

export function CopilotKitComponent() {
  return (
    <CopilotKit
      runtimeUrl="http://localhost:4111/copilotkit"
      agent="projectBuddyAgent"
    >
      <CopilotSidebar
        defaultOpen={false}
        clickOutsideToClose={false}
        hitEscapeToClose={false}
        instructions="你是一个专业的项目管理助手，帮助用户处理需求、任务、缺陷和迭代规划相关的问题。提供清晰、专业的建议，使用礼貌友好的语气。"
        labels={{
          title: '项目管理智能助手',
          initial: '👋 您好！我是您的项目管理助手，可以帮助您处理需求、任务、缺陷和迭代规划等工作。请告诉我您需要什么帮助？',
          placeholder: '输入您的问题或需求...',
        }}
      />
    </CopilotKit>
  )
}
