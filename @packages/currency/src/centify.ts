import { times } from 'number-precision'
import { isNil } from './share/isNil'
import { travel } from './travel'

/**
 * 变成分, 用于数据提交时
 * @description
 * 请确保数据中所有价格都进行转换
 */
export function centify<T>(data: T, paths: string[]) {
  return travel(data, paths, (value, origin) => (isNil(origin) ? origin : times(value, 100)))
}
