import { calc } from '@/calc'

describe('测试函数 calc', () => {
  test('自定义回调', () => {
    const callback = jest.fn((value) => value)
    calc({ a: 100 }, 'a', callback)
    expect(callback).toHaveBeenCalled()
  })

  test('返回 undefined', () => {
    const value = 100
    const data = { a: { b: { c: value } } }
    expect(calc(data, 'a.b.c', (value) => value)).toEqual(undefined)
  })

  test('对象路径查找', () => {
    const value = Math.random()
    const data = { a: { b: { c: value } } }
    calc(data, 'a.b.c', (value) => {
      expect(value).toEqual(value)
      return value
    })
  })

  test('数组路径查找', () => {
    const value = Math.random()
    const data = [{ a: [{ b: [{ c: value }] }] }]
    calc(data, '[].a.[].b.[].c', (value) => {
      expect(value).toEqual(value)
      return value
    })
  })

  test('改变源数据值', () => {
    const value = 100
    const data = { a: { b: { c: value } } }
    calc(data, 'a.b.c', (value) => value * 100)
    expect(data.a.b.c).toEqual(value * 100)
  })

  test('查找非数字元素', () => {
    const value = 100
    const data = { a: { b: { c: value } } }
    calc(data, 'a', (value, origin) => {
      expect(isNaN(value)).toBeTruthy()
      expect(origin).toEqual(data.a)
      return value
    })
  })

  test('查找不到元素不执行回调', () => {
    const callback = jest.fn((value) => value)
    calc({ a: 100 }, 'a.b.c', callback)
    expect(callback).not.toBeCalled()
  })

  test('处理非对象或NULL', () => {
    const callback = jest.fn((value) => value)
    calc('a', 'a', callback)
    calc(100, 'a', callback)
    calc(NaN, 'a', callback)
    calc(true, 'a', callback)
    calc(undefined, 'a', callback)
    calc(null, 'a', callback)
    calc(Symbol('abc'), 'a', callback)
    expect(callback).not.toBeCalled()
  })

  test('处理 实例对象', () => {
    const value = 100
    const data = new (class {
      a: { b: { c: number } }

      constructor() {
        this.a = { b: { c: value } }
      }
    })()

    const callback = jest.fn((value) => value * 100)
    calc(data, 'a.b.c', callback)
    expect(callback).toBeCalled()
    expect(data.a.b.c).toEqual(value * 100)
  })
})
