import { formatDeleteResponse } from '@/utils/formatDeleteResponse'
import { createHttpInterceptors } from './HttpInterceptors'
import * as errorHandlers from '@/core/error/errorHandlers'
/**
 * 基础响应拦截器注册函数
 */
export const registerBaseResponseInterceptor = createHttpInterceptors({
  response: [
    (response) => {
      return formatDeleteResponse(response)
    },
    async (rejection) => {
      for (const handler of Object.values(errorHandlers)) {
        await handler(rejection)
      }
    },
  ],
})
