import { wrapApiWithRequest } from '../utils/apiWrapper'
import * as iterationsApiOriginal from './iterations'
import * as projectsApiOriginal from './projects'
import * as defectsApiOriginal from './workitem/defects.ts'
import * as requirementsApiOriginal from './workitem/requirements.ts'
import * as tasksApiOriginal from './workitem/tasks.ts'

// 使用 wrapApiWithRequest 包装所有 API 模块
const defectsApi = wrapApiWithRequest(defectsApiOriginal)
const iterationsApi = wrapApiWithRequest(iterationsApiOriginal)
const projectsApi = wrapApiWithRequest(projectsApiOriginal)
const requirementsApi = wrapApiWithRequest(requirementsApiOriginal)
const tasksApi = wrapApiWithRequest(tasksApiOriginal)

export {
  defectsApi,
  iterationsApi,
  projectsApi,
  requirementsApi,
  tasksApi,
}
