import { DEFAULT_METHOD } from '@/constants'

export function getMethod(method?: string) {
  return (method ?? DEFAULT_METHOD).toLocaleUpperCase()
}
