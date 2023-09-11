import { calc } from './calc'
import { cloneNonReference } from './share/cloneNonReference'

/** 遍历所有路径集合进行计算 */
export function travel<T>(data: T, paths: string[], calculate: (value: number, origin: any) => number) {
  data = cloneNonReference(data)
  paths.forEach((path) => calc(data, path, calculate))
  return data
}
