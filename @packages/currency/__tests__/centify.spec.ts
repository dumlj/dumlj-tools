import { centify } from '@/centify'

describe('测试函数 centify', () => {
  test('批量转换成分', () => {
    const value = 100
    const data = { a: { b: { c: value } }, a1: value }
    const result = centify(data, ['a.b.c', 'a1'])
    expect(result.a1).toEqual(value * 100)
    expect(result.a.b.c).toEqual(value * 100)
    expect(result).not.toBe(data)
  })
  test('空值不转换', () => {
    const data = { a: { b: { c: null } } }
    const result = centify(data, ['a.b.c'])
    expect(result.a.b.c).toEqual(null)
    expect(result).not.toBe(data)
  })
})
