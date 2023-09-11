import type { IfAny } from './if-any'
import type { IfNever } from './if-never'

/** 判断是否为常量字符串 */
export type IfConstString<V, T, F> = IfAny<V, F, IfNever<V, F, V extends string ? (V extends Extract<string, V> ? F : T) : F>>
