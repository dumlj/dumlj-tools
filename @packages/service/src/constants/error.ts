export const REQUEST_ABORTED_MESSAGE = 'Request aborted'

export const ERROR_MESSAGE_MAP = {
  CANCELED: '请求已取消',
  SEND_FAIL: '无法发出请求，请检查头部信息',
  NETWORK_ERROR: '网络连接异常',
  TIMEOUT: '网络连接超时，请重试',
  POST_404: '无法提交数据，请确认来源正确',
  GET_404: '请求资源错误',
  STATUS_410: '当前资源已经被移除',
  STATUS_433: '服务器繁忙，请稍后重试',
  SERVICE_ERROR: '服务器繁忙',
  UNKNOWN_ERROR: '网络错误',
}
