import { expectType } from 'tsd-lite'
import type { IfConstString } from '@/types/if-const-string'

describe('测试类型工具 IfConstString', () => {
  test('基本类型', () => {
    expectType<IfConstString<number, true, false>>(false)
    expectType<IfConstString<string, true, false>>(false)
    expectType<IfConstString<boolean, true, false>>(false)
    expectType<IfConstString<symbol, true, false>>(false)
  })

  test('枚举类型', () => {
    expectType<IfConstString<'1', true, false>>(true)
    expectType<IfConstString<1, true, false>>(false)
  })

  test('通用类型', () => {
    expectType<IfConstString<any, true, false>>(false)
    expectType<IfConstString<never, true, false>>(false)
    expectType<IfConstString<void, true, false>>(false)
    expectType<IfConstString<unknown, true, false>>(false)
  })

  test('数组类型', () => {
    expectType<IfConstString<any[], true, false>>(false)
    expectType<IfConstString<never[], true, false>>(false)
    expectType<IfConstString<void[], true, false>>(false)
    expectType<IfConstString<unknown[], true, false>>(false)
    expectType<IfConstString<number[], true, false>>(false)
    expectType<IfConstString<string[], true, false>>(false)
    expectType<IfConstString<boolean[], true, false>>(false)
    expectType<IfConstString<symbol[], true, false>>(false)
  })

  test('只读数组类型', () => {
    expectType<IfConstString<readonly any[], true, false>>(false)
    expectType<IfConstString<readonly never[], true, false>>(false)
    expectType<IfConstString<readonly void[], true, false>>(false)
    expectType<IfConstString<readonly unknown[], true, false>>(false)
    expectType<IfConstString<readonly number[], true, false>>(false)
    expectType<IfConstString<readonly string[], true, false>>(false)
    expectType<IfConstString<readonly boolean[], true, false>>(false)
    expectType<IfConstString<readonly symbol[], true, false>>(false)
  })

  test('对象类型', () => {
    expectType<IfConstString<Record<string, any>, true, false>>(false)
    expectType<IfConstString<Record<symbol, any>, true, false>>(false)
    expectType<IfConstString<Record<number, any>, true, false>>(false)
  })

  test('只读对象类型', () => {
    expectType<IfConstString<Readonly<Record<string, any>>, true, false>>(false)
    expectType<IfConstString<Readonly<Record<symbol, any>>, true, false>>(false)
    expectType<IfConstString<Readonly<Record<number, any>>, true, false>>(false)
  })
})
