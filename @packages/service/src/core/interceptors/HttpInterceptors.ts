import type { HTTP } from '@/types'
import { AxiosInstance } from 'axios'

export const createHttpInterceptors = (interceptors: HTTP.HttpInterceptors) => (axiosInterceptors: AxiosInstance['interceptors']) => {
  if (interceptors.request) {
    axiosInterceptors.request.use(...interceptors.request)
  }
  if (interceptors.response) {
    const [onFulfilled, onRejected] = interceptors.response

    // 先注册成功回调, 再注册失败回调，保证失败回调可以处理成功回调的reject
    if (onFulfilled) axiosInterceptors.response.use(onFulfilled)
    if (onRejected) axiosInterceptors.response.use(undefined, onRejected)
  }
}
