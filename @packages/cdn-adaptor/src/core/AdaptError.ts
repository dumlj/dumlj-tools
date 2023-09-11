export enum AdaptErrorLevel {
  /**
   * 所有资源失活，包括源链接
   */
  ALL_DEAD = 1,
  /**
   * 所有CDN资源失活
   */
  ALL_CDN_DEAD,
  /**
   * 单个CDN资源失活
   */
  CDN_DEAD,
}

export class AdaptError extends Error {
  level: AdaptErrorLevel
  cdn: {
    host: string
    bucket?: string
    key: string
  }
  constructor(
    message: string,
    level: number,
    cdn: {
      host: string
      bucket?: string
      key: string
    }
  ) {
    super(message)
    this.name = 'AdaptError'
    this.level = level
    this.cdn = cdn
  }
}
