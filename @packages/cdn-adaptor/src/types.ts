import type { AdaptError } from './core/AdaptError'

export type CDNOptions = {
  protocol?: string
  host: string
  bucket?: string
}
export type CheckAlive = (originUrl: string, cdnOptions: CDNOptions) => [string, () => Promise<boolean>]

export interface CDNAdapterOptionsBase<Key extends string> {
  checkAlive?: CheckAlive
  /**
   * 过滤器，返回 true 表示该 url 需要被处理
   * @param originUrl
   * @returns
   */
  filter?: (originUrl: string) => boolean
  toUrl?: (originUrl: string, options: CDNOptions) => string
  onError?: (err: AdaptError) => void
  priority?: Key[]
}

export interface CDNConfig extends Omit<CDNAdapterOptionsBase<any>, 'priority' | 'filter'>, CDNOptions {}
export interface CDNAdapterOptions<Key extends string> extends CDNAdapterOptionsBase<Key> {
  cdnConfigs: Record<Key, CDNConfig>
}
