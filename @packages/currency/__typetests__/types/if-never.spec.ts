import { expectType } from 'tsd-lite'
import type { IfNever } from '@/types/if-never'

describe('测试类型工具 IfNever', () => {
  test('基本类型', () => {
    expectType<IfNever<number, true, false>>(false)
    expectType<IfNever<string, true, false>>(false)
    expectType<IfNever<boolean, true, false>>(false)
    expectType<IfNever<symbol, true, false>>(false)
  })

  test('枚举类型', () => {
    expectType<IfNever<'1', true, false>>(false)
    expectType<IfNever<1, true, false>>(false)
  })

  test('通用类型', () => {
    expectType<IfNever<any, true, false>>(false)
    expectType<IfNever<never, true, false>>(true)
    expectType<IfNever<void, true, false>>(false)
    expectType<IfNever<unknown, true, false>>(false)
  })

  test('数组类型', () => {
    expectType<IfNever<any[], true, false>>(false)
    expectType<IfNever<never[], true, false>>(false)
    expectType<IfNever<void[], true, false>>(false)
    expectType<IfNever<unknown[], true, false>>(false)
    expectType<IfNever<number[], true, false>>(false)
    expectType<IfNever<string[], true, false>>(false)
    expectType<IfNever<boolean[], true, false>>(false)
    expectType<IfNever<symbol[], true, false>>(false)
  })

  test('只读数组类型', () => {
    expectType<IfNever<readonly any[], true, false>>(false)
    expectType<IfNever<readonly never[], true, false>>(false)
    expectType<IfNever<readonly void[], true, false>>(false)
    expectType<IfNever<readonly unknown[], true, false>>(false)
    expectType<IfNever<readonly number[], true, false>>(false)
    expectType<IfNever<readonly string[], true, false>>(false)
    expectType<IfNever<readonly boolean[], true, false>>(false)
    expectType<IfNever<readonly symbol[], true, false>>(false)
  })

  test('对象类型', () => {
    expectType<IfNever<Record<string, any>, true, false>>(false)
    expectType<IfNever<Record<symbol, any>, true, false>>(false)
    expectType<IfNever<Record<number, any>, true, false>>(false)
  })

  test('只读对象类型', () => {
    expectType<IfNever<Readonly<Record<string, any>>, true, false>>(false)
    expectType<IfNever<Readonly<Record<symbol, any>>, true, false>>(false)
    expectType<IfNever<Readonly<Record<number, any>>, true, false>>(false)
  })
})
