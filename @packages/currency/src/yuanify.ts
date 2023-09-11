import { divide } from 'number-precision'
import { isNil } from './share/isNil'
import { travel } from './travel'

/**
 * 变成元, 用于数据获取时
 * @description
 * 请确保数据中所有价格都进行转换
 */
export function yuanify<T>(data: T, paths: string[]) {
  return travel(data, paths, (value, origin) => (isNil(origin) ? origin : divide(value, 100)))
}
