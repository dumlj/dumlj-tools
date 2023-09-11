/** 计算根据路径进行 */
export function calc(data: any, path: string, calculate: (value: number, origin: any) => number) {
  if (typeof data === 'object' && data !== null) {
    const paths = path.split('.')
    if (paths.length === 1) {
      if (typeof data[path] !== 'undefined') {
        data[path] = calculate(Number(data[path]), data[path])
      }
    } else {
      const name = paths.shift()
      if (name === '[]') {
        if (Array.isArray(data)) {
          data.forEach((nest) => {
            calc(nest, paths.join('.'), calculate)
          })
        }
      } else if (typeof name === 'string' && typeof data === 'object') {
        calc(data[name], paths.join('.'), calculate)
      }
    }
  }
}
