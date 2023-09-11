import type { FindPaths } from '@/types/find-paths'
import { expectType } from 'tsd-lite'

describe('测试类型工具 FindPaths', () => {
  test('获取对象路径', () => {
    interface Data {
      a: {
        b: {
          c: number
        }
      }
    }

    expectType<FindPaths<Data>>('a.b.c')
  })

  test('获取数组路径', () => {
    type Data = [{ a?: [{ b: [{ c: number }] }] }]
    expectType<FindPaths<Data>>('[].a.[].b.[].c')
  })

  test('枚举对象内所有路径', () => {
    type Data = { a: number; b: number; c?: { d: number } }
    const result = 'a' as 'a' | 'b' | 'c.d'
    expectType<FindPaths<Data>>(result)
  })

  test('枚举对象内所有路径', () => {
    type Data = { a?: { b: number }[]; c: { d: number }[] }[]
    type Path = FindPaths<Data>
    const result = '[].a.[].b' as '[].a.[].b' | '[].c.[].d'
    expectType<Path>(result)
  })
})
