import { centify } from './centify'
import type { FindPaths } from './types/find-paths'
import { yuanify } from './yuanify'

/**
 * 价格转换
 * @description
 * 分离 data 与 paths 同时调用主要为了解决 `data` `paths` 同时存在会出现解析缓慢问题
 */
export function convertCurrency<T>(data: T) {
  return {
    origin: data,
    yuanify(paths: FindPaths<T>[]) {
      return yuanify(data, paths as any)
    },
    centify(paths: FindPaths<T>[]) {
      return centify(data, paths as any)
    },
  }
}

export { yuanify, centify }
