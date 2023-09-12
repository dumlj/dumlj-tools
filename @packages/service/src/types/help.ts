import type { AxiosInstance, AxiosPromise } from 'axios'
import type { Assign, FunctionKeys } from 'utility-types'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {}

/**
 * 获取为Axios实例的键值集合
 * @example
 * // Expect: 'a' | 'b'
 * AxiosKeys<{ a: AxiosInstance, b: AxiosInstance, c: 1 }>
 */
export type AxiosKeys<T> = { [K in keyof T]: T[K] extends AxiosInstance ? K : never }[keyof T]

/**
 * 覆盖存在的字段
 * @param Target 操作对象
 * @param Source 需要覆盖的对象
 * @example
 * // Expect: {
 * //   abc: 321;
 * // }
 * type D = AssignDefined<{ abc: 123 }, { abc: 321 }>
 */
// prettier-ignore
export type AssignDefined<
  Target extends Record<string, any>,
  Source extends Record<string, any>
> = {
  [K in keyof Target]: K extends keyof Source
    ? Source[K]
    : Target[K]
}

/**
 * 翻转枚举数组类型
 * @param EnumArray 枚举数组类型
 * @param Next 不需要传值, 结果集合, 主要用于递归
 * @example
 * // Expect: ['c', 'b', 'a']
 * type A = Reverse<['a', 'b', 'c']>
 */
// prettier-ignore
// 注意这里 R 必须使用空数组, 否则 X 将会带上其他类型
export type Reverse<EnumArray extends string[], Next = []> = ((...args: EnumArray) => void) extends ((a: infer First, ...b: infer Rest) => void)
  ? First extends string
    // 这里需要确认值才进行递归
    // 所以先取出 [First, ...Next]
    // 因为 TS 无法使用这种描述方式
    // 所以可以使用 Parameters 或者以下方式获取
    // 这里使用 Result 代表其值
    ? ((a: First, ...args: Next extends string[] ? Next : []) => any) extends ((...args: infer Result) => any)
      ? Rest extends [...any, string]
        // 这里需要递归
        ? Reverse<Rest, Result>
        // 打断递归
        : Result
      : never
    : never
  : never

/**
 * 创建链式对象(逆序)
 * @param Chain 链式键值集合, 枚举数组
 * @param Target 对象值
 * @example
 * // Expect: {
 * //   c: {
 * //     b: {
 * //       a: 1
 * //     }
 * //   }
 * // }
 * type A = ReverseChainRecord<['a', 'b', 'c'], 1>
 */
// prettier-ignore
export type ReverseChainRecord<Chain extends string[], Target = any> = ((...args: Chain) => void) extends ((a: infer First, ...b: infer Rest) => void)
  ? First extends string
    // 这里需要确认值才进行递归
    // 所以先取出 Record<First, Target>, 这里使用 Result 取代其值
    ? ((a: Record<First, Target>) => any) extends ((a: infer Result) => any)
      ? Rest extends [...any, string]
        // 这里需要递归
        ? ReverseChainRecord<Rest, Result>
        // 打断递归
        : Result
      : never
    : never
  : never

/**
 * 创建链式对象(顺序)
 * @param Chain 链式键值集合, 枚举数组
 * @param Data 对象值
 * @param ReversedData 不需要传值, 内部使用
 * @description
 * 因为一般使用习惯都是顺序设值, 所以这里使用翻转 `Reverse`
 * @example
 * // Expect: {
 * //   a: {
 * //     b: {
 * //       c: 1
 * //     }
 * //   }
 * // }
 * type A = ChainRecord<['a', 'b', 'c'], 1>
 */
// prettier-ignore
export type ChainRecord<Chain extends string[], Data = any, ReversedData extends Reverse<Chain> = Reverse<Chain>> = ReverseChainRecord<ReversedData, Data>

/**
 * 深度合并
 * @param A 第一个对象
 * @param B 第二个对象
 * @example
 * // Expect: {
 * //   a: {
 * //     a: 1
 * //   }
 * //   data: {
 * //     a: 1
 * //     b: 2
 * //     c: 3
 * //   }
 * // }
 * type A = {
 *  a: number
 *  data: {
 *    a: 1
 *    c: 3
 *  }
 * }
 * type B = {
 *  a: {
 *    a: 1
 *  }
 *  data: {
 *    b: 2
 *  }
 * }
 * type A = DeepMerge<A, B>
 */
// prettier-ignore
export type DeepMerge<
  A extends Record<string, any>,
  B extends Record<string, any>
> = Assign<A, {
  // 这里需要确定 A 与 B 的相同属性都必须为对象才能合并,
  // 否则将 B 的属性过滤掉
  [K in keyof B]: K extends keyof A
    ? A[K] extends Record<string, any>
      ? B[K] extends Record<string, any>
        // 这里需要递归
        ? DeepMerge<A[K], B[K]>
        // 打断递归
        : B[K]
      : B[K]
    : B[K]
}>

/**
 * 修正返回值
 * @param Instance Axios/Http 实例, 通过 create 生成的实例
 * @param Body 不同域的返回格式(返回值 body)
 * @param DataChain 不同域的动态返回值所在位置(返回值 data 所在 body 的键值链式数组)
 * @description
 * 修正因为拦截器而改变的返回值;
 * 因为类型工具无法通过泛型传递, 又因为每个接口返回值都可能不相同, 而需要调用的时候才去声明
 * 因此这里需要只能通过链式描述来确定最终返回值, 参考下面的 <R = any>
 * @example
 * type A = InterceptHttp<AxiosInstance, { a: 1 }, ['data']>
 * const http: A = null
 * http.post<{ abc: 1 }>('url').then((response) => {
 *  console.log(response.data.abc) // 1
 * })
 */
// prettier-ignore
export type InterceptHttp<
  Instance extends AxiosInstance,
  Body extends Record<string, any>,
  DataChain extends string[]
> = AssignDefined<Instance, {
  [Fn in FunctionKeys<Instance>]: Instance[Fn] extends (...args: any[]) => AxiosPromise<any>
    ? <R = any>(...args: Parameters<Instance[Fn]>) => Promise<Simplify<DeepMerge<Body, ChainRecord<DataChain, R>>>>
    : Instance[Fn]
}>

export type HttpCompose<
  Instance extends AxiosInstance,
  Body extends Record<AxiosKeys<Instance>, any>,
  DataChain extends Record<AxiosKeys<Instance>, string[]>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  Extension extends Partial<Record<AxiosKeys<Instance>, any>> = {}
> = AssignDefined<
  Instance,
  {
    [K in AxiosKeys<Instance>]: Instance[K] extends AxiosInstance ? AssignDefined<InterceptHttp<Instance[K], Body[K], DataChain[K]>, Extension[K]> : never
  }
>
