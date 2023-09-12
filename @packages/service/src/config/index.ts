import { ERROR_MESSAGE_MAP } from '@/constants'
import type { HTTP } from '@/types'

export const ServiceConfig: Required<HTTP.HTTPServiceSettings> = {
  axiosConfig: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    params: {},
    withCredentials: true,
    timeout: 30e3,
  },
  errorMessages: ERROR_MESSAGE_MAP,
}

/**
 * 设置错误信息
 * @param messages
 */
export const setErrorMessages = (messages: Partial<typeof ERROR_MESSAGE_MAP>) => {
  Object.assign(ServiceConfig.errorMessages, messages)
}
