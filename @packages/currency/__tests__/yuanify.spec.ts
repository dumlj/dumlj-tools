import { yuanify } from '@/yuanify'

describe('测试函数 yuanify', () => {
  test('批量转换成元', () => {
    const value = 100
    const data = { a: { b: { c: value } }, a1: value }
    const result = yuanify(data, ['a.b.c', 'a1'])
    expect(result.a1).toEqual(value / 100)
    expect(result.a.b.c).toEqual(value / 100)
    expect(result).not.toBe(data)
  })
  test('空值不转换', () => {
    const data = { a: { b: { c: null } } }
    const result = yuanify(data, ['a.b.c'])
    expect(result.a.b.c).toEqual(null)
    expect(result).not.toBe(data)
  })
})
