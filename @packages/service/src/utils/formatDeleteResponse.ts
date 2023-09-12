import type { AxiosResponse } from 'axios'
import { getMethod } from './getMethod'
import { isSuccessStatus } from './isSuccessStatus'

/**
 * 格式化删除请求的响应(hidden body when method euqal DELETE)
 * https://stackoverflow.com/questions/299628/is-an-entity-body-allowed-for-an-http-delete-request?answertab=active#tab-top
 * @param response
 * @returns
 */
export function formatDeleteResponse(response: AxiosResponse) {
  const { status, config } = response
  const method = getMethod(config.method)
  if (method !== 'DELETE') return response
  const data = isSuccessStatus(status)
    ? {
        code: 0,
        success: true,
        message: 'success',
        data: null,
      }
    : {
        code: -1,
        message: 'error',
        success: false,
        data: null,
      }
  response.data = data
  return response
}
