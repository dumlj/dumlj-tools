// 是否为 never
export type IfNever<T, Y, N> = [T] extends [never] ? Y : N
