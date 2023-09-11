import type { IfConstString } from './if-const-string'

/** 字符串前缀 */
// prettier-ignore
export type Prefix<A, P> = A extends string
? IfConstString<A, IfConstString<P, P extends string ? `${P}.${A}` : A, A>, never>
: never
