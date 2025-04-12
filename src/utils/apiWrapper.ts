import { request } from './supabaseClient'

/**
 * 高阶函数，用于包装 API 方法，使其使用 request 函数
 * @param apiModule API 模块对象
 * @returns 包装后的 API 模块
 */
export function wrapApiWithRequest<T extends Record<string, any>>(apiModule: T): T {
  const wrappedApi: Record<string, any> = {}

  // 遍历 API 模块中的所有方法
  for (const key in apiModule) {
    const method = apiModule[key]

    // 只包装函数类型的属性
    if (typeof method === 'function') {
      // 创建一个新的包装函数
      wrappedApi[key] = (...args: any[]) => {
        return request(() => method(...args))
      }
    }
    else {
      // 非函数属性直接复制
      wrappedApi[key] = method
    }
  }

  return wrappedApi as T
}
