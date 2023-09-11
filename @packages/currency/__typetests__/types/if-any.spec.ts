import { expectType } from 'tsd-lite'
import type { IfAny } from '@/types/if-any'

describe('测试类型工具 IfAny', () => {
  test('基本类型', () => {
    expectType<IfAny<number, true, false>>(false)
    expectType<IfAny<string, true, false>>(false)
    expectType<IfAny<boolean, true, false>>(false)
    expectType<IfAny<symbol, true, false>>(false)
  })

  test('枚举类型', () => {
    expectType<IfAny<'1', true, false>>(false)
    expectType<IfAny<1, true, false>>(false)
  })

  test('通用类型', () => {
    expectType<IfAny<any, true, false>>(true)
    expectType<IfAny<never, true, false>>(false)
    expectType<IfAny<void, true, false>>(false)
    expectType<IfAny<unknown, true, false>>(false)
  })

  test('数组类型', () => {
    expectType<IfAny<any[], true, false>>(false)
    expectType<IfAny<never[], true, false>>(false)
    expectType<IfAny<void[], true, false>>(false)
    expectType<IfAny<unknown[], true, false>>(false)
    expectType<IfAny<number[], true, false>>(false)
    expectType<IfAny<string[], true, false>>(false)
    expectType<IfAny<boolean[], true, false>>(false)
    expectType<IfAny<symbol[], true, false>>(false)
  })

  test('只读数组类型', () => {
    expectType<IfAny<readonly any[], true, false>>(false)
    expectType<IfAny<readonly never[], true, false>>(false)
    expectType<IfAny<readonly void[], true, false>>(false)
    expectType<IfAny<readonly unknown[], true, false>>(false)
    expectType<IfAny<readonly number[], true, false>>(false)
    expectType<IfAny<readonly string[], true, false>>(false)
    expectType<IfAny<readonly boolean[], true, false>>(false)
    expectType<IfAny<readonly symbol[], true, false>>(false)
  })

  test('对象类型', () => {
    expectType<IfAny<Record<string, any>, true, false>>(false)
    expectType<IfAny<Record<symbol, any>, true, false>>(false)
    expectType<IfAny<Record<number, any>, true, false>>(false)
  })

  test('只读对象类型', () => {
    expectType<IfAny<Readonly<Record<string, any>>, true, false>>(false)
    expectType<IfAny<Readonly<Record<symbol, any>>, true, false>>(false)
    expectType<IfAny<Readonly<Record<number, any>>, true, false>>(false)
  })
})
