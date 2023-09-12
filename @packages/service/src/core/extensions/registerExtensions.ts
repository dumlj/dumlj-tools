import type { HTTP } from '@/types'
import { AxiosInstance } from 'axios'

export function registerExtensions<E extends HTTP.HttpExtensions<string>>(extensions: E, bind: AxiosInstance): bind is AxiosInstance & E {
  for (const key in Object.keys(extensions)) {
    const extension = extensions[key].bind(bind)
    if (typeof extension === 'function') {
      Object.assign(bind, { [key]: extension })
    }
  }
  return true
}
