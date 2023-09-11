import type { RequiredDeep, Writable } from 'type-fest'
import type { IfAny } from './if-any'
import type { IfNever } from './if-never'
import type { Prefix } from './prefix'

type OmitByValue<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]-?: T[Key] extends ValueType ? never : Key
  }[keyof T]
>

type ValuesType<T extends ReadonlyArray<any> | ArrayLike<any> | Record<any, any>> = T extends ReadonlyArray<any>
  ? T[number]
  : T extends ArrayLike<any>
  ? T[number]
  : T extends object
  ? T[keyof T]
  : never

/** 查找对象路径 */
// prettier-ignore
type FindObjectPaths<T, P = never> = IfAny<T, () => string, () => T extends Record<string, any>
  // 将值为数字的键值筛选出来
  ? ((a: OmitByValue<{ [K in keyof T]: T[K] extends number ? T[K] : never }, never>) => any) extends ((a: infer A) => any)
    // 添加前缀, 完成一个字符串拼接
    ? Prefix<keyof A, P>
    // 剩下不匹配的进行下一轮查找
    | (
      ((b: keyof Omit<T, keyof A>) => any) extends ((b: infer B) => any)
        // 确保 B 必然为 T 的键值
        ? B extends keyof T
          // 处理数组, 否则当对象处理
          ? T[B] extends unknown[]
            ? ReturnType<FindArrayPaths<T[B], Prefix<B, P>>>
            : ReturnType<FindObjectPaths<T[B], Prefix<B, P>>>
          : never
        : never
      )
    : never
  : never>

/** 查找数组路径 */
// prettier-ignore
type FindArrayPaths<T, P = never> = IfAny<T, () => string, () =>
// unknown[] 表示数组包含兼容两种形式 any[], [any]
T extends unknown[]
  // 针对 [any, any] 做处理
  ? T extends [infer A, ...infer R]
    ? (
      // 如果为数组
      A extends unknown[]
       ? ReturnType<FindArrayPaths<A, Prefix<'[]', P>>>
        // 如果为对象 
        : A extends Record<string | number | symbol, any>
          ? ReturnType<FindObjectPaths<A, Prefix<'[]', P>>>
          : never
      )
      // 遍历剩下元素
      | (
        R extends unknown[]
          ? ReturnType<FindArrayPaths<R, Prefix<'[]', P>>>
          : never
      )
      // 处理 any[] 的情况, 所以可以直接一次获取值的类型
    : ReturnType<FindArrayPaths<ValuesType<T>, Prefix<'[]', P>>>
  // 如果不为数组则直接进入一次循环
  : ReturnType<FindObjectPaths<T, Prefix<'[]', P>>>
>

/** 过滤循环引用 */
// prettier-ignore
type FilterLoopRef<T = unknown, R = T> = T extends unknown[]
? NonNullable<T> extends [infer A]
  ? [FilterLoopRef<A, R>]
  : [FilterLoopRef<ValuesType<T>, R>]
: T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? [Extract<T[K], R>] extends [never]
          ? FilterLoopRef<T[K], R | T[K]>
          : never
        : T[K]
    }
  : T

/**
 * 查找路径
 * @description
 * 返回方法主要为了延迟解析;
 * 如果直接接着遍历会出现无限循环错误
 * 因为 any 会导致无限循环, 所以如果为 any, 直接返回字符串
 */
// prettier-ignore
type FindPathsFn<T = unknown> = IfAny<T,
  () => string,
  () => Writable<T> extends unknown[]
    ? ReturnType<FindArrayPaths<FilterLoopRef<T>>>
    : T extends Record<string, any>
      ? ReturnType<FindObjectPaths<FilterLoopRef<T>>>
      : string
>

/** 查找路径 */
export type FindPaths<T, S = ReturnType<FindPathsFn<RequiredDeep<T>>>> = IfNever<S, string, S>
