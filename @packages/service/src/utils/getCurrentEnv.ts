import type { HTTP } from '@/types'

/**
 * 获取当前环境(默认)
 * @returns
 */
export const getCurrentEnv = () => {
  return 'product' as HTTP.HttpEnvironment
}

/**
 * 获取域名(默认)
 */
export const getBaseUrl = (env: HTTP.HttpEnvironment, domain: HTTP.HttpDomainConfig) => {
  const protocol = '//'
  const host = domain[env] ?? ''
  return /^https?:\/\//.test(host) ? host : `${protocol}${host}`
}
