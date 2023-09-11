import { travel } from '@/travel'

describe('测试函数 travel', () => {
  test('支持自定义回调', () => {
    const callback = jest.fn((value) => value)
    travel({ abc: 100 }, ['abc'], callback)
    expect(callback).toHaveBeenCalled()
  })

  test('返回处理后的数据', () => {
    const value = 100
    const data = { a: { b: { c: value } } }
    const result = travel(data, ['a.b.c'], (value) => value)
    expect(result).toEqual(data)
    expect(result).not.toBe(data)
  })

  test('批量路径查找', () => {
    const value = 100
    const data = { a: { b: { c: value } }, a1: value }
    travel(data, ['a.b.c', 'a1'], (value) => {
      expect(value).toEqual(value)
      return value
    })
  })

  test('批量计算', () => {
    const value = 100
    const data = { a: { b: { c: value } }, a1: value }
    const callback = jest.fn((value) => value * 100)
    const result = travel(data, ['a.b.c', 'a1'], callback)
    expect(result.a1).toEqual(value * 100)
    expect(result.a.b.c).toEqual(value * 100)
    expect(result).not.toBe(data)
    expect(callback).toBeCalledTimes(2)
  })
})
