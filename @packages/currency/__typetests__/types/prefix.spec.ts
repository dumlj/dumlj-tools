import { expectType } from 'tsd-lite'
import type { Prefix } from '@/types/prefix'

describe('测试类型工具 prefix', () => {
  test('连接字符串', () => {
    expectType<Prefix<'foo', 'bar'>>('bar.foo')
  })

  test('错误入参', () => {
    expectType<Prefix<'foo', void>>('foo')
    expectType<Prefix<'foo', never>>('foo')
    expectType<Prefix<'foo', unknown>>('foo')
    expectType<Prefix<'foo', any>>('foo')
    expectType<Prefix<'foo', boolean>>('foo')
    expectType<Prefix<'foo', number>>('foo')
    expectType<Prefix<'foo', string>>('foo')
  })
})
