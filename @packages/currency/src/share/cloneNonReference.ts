/** 无引用克隆 */
export function cloneNonReference<T>(data: T): T {
  try {
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    throw new Error('复制错误, 请确认数据是否循环引用')
  }
}
