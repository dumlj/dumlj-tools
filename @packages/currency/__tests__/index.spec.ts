import { convertCurrency } from '@/index'

describe('测试函数 convertCurrency', () => {
  test('返回转换对象', () => {
    const value = 100
    const data = { a: { b: { c: value } } }
    const converter = convertCurrency(data)

    expect(converter).toHaveProperty('origin')
    expect(converter).toHaveProperty('yuanify')
    expect(converter).toHaveProperty('centify')

    expect(converter.origin).toBe(data)
    expect(typeof converter.yuanify).toBe('function')
    expect(typeof converter.centify).toBe('function')
  })

  test('批量转化成元', () => {
    const value = 100
    const data = { a: { b: { c: value } }, a1: value }
    const converter = convertCurrency(data)
    const result = converter.yuanify(['a.b.c', 'a1'])

    expect(data.a.b.c).toEqual(value)
    expect(data.a1).toEqual(value)

    expect(converter.origin.a.b.c).toEqual(value)
    expect(converter.origin.a1).toEqual(value)

    expect(result.a.b.c).toEqual(value / 100)
    expect(result.a1).toEqual(value / 100)
  })

  test('批量转化成分', () => {
    const value = 100
    const data = { a: { b: { c: value } }, a1: value }
    const converter = convertCurrency(data)

    const result = converter.centify(['a.b.c', 'a1'])

    expect(data.a.b.c).toEqual(value)
    expect(data.a1).toEqual(value)

    expect(converter.origin.a.b.c).toEqual(value)
    expect(converter.origin.a1).toEqual(value)

    expect(result.a.b.c).toEqual(value * 100)
    expect(result.a1).toEqual(value * 100)
  })

  test('批量转化数组数据成元', () => {
    const value = 100
    const data = [{ a: [{ b: [{ c: value }] }] }, { a1: value }]
    const converter = convertCurrency(data)
    const result = converter.yuanify(['[].a.[].b.[].c', '[].a1'])

    expect(data[0].a?.[0].b[0].c).toEqual(value)
    expect(data[1].a1).toEqual(value)

    expect(converter.origin[0].a?.[0].b[0].c).toEqual(value)
    expect(converter.origin[1].a1).toEqual(value)

    expect(result[0].a?.[0].b[0].c).toEqual(value / 100)
    expect(result[1].a1).toEqual(value / 100)
  })
})
