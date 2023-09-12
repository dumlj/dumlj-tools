import { REQUEST_ABORTED_MESSAGE } from '@/constants'
import axios from 'axios'

export class RejectError extends Error {
  origin?: any
  constructor(message: string, expiation?: Error) {
    if (expiation && 'origin' in expiation) return expiation
    super(message)
    this.message = message
    this.origin = expiation
    this.stack = expiation?.stack
    this.name = expiation?.name || 'RejectError'
  }
  static isCancelOrAbsorbed(rejection: RejectError): boolean {
    if (_isCancel(rejection)) {
      return true
    }
    if (rejection?.message?.includes(REQUEST_ABORTED_MESSAGE)) {
      return true
    }
    if ((rejection as RejectError).origin) {
      return RejectError.isCancelOrAbsorbed(rejection.origin)
    }
    return false
  }
}

/**
 * 判断是否为取消请求（axios）
 * @param rejection
 * @returns
 */
function _isCancel(rejection: any): boolean {
  return axios.isCancel(rejection)
}
