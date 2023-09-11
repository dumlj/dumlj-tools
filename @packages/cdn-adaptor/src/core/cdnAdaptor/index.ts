import type { CDNAdapterOptions, CDNConfig } from '../../types'
import { AdaptError } from '../AdaptError'
import { CheckAliveManager, fetchCheck } from '../checkAliveManager'

export class CdnAdaptor<Key extends string> extends CheckAliveManager {
  private priority: Key[]
  private cdnConfigs: Record<Key, CDNConfig>
  private onError?: (err: AdaptError) => void
  private filter?: (url: string) => boolean
  constructor({ priority, cdnConfigs, onError, filter, ...rest }: CDNAdapterOptions<Key>) {
    super()
    this.priority = priority || (Object.keys(cdnConfigs) as Key[])
    this.onError = onError
    this.filter = filter
    this.cdnConfigs = (Object.entries(cdnConfigs) as [Key, CDNConfig][]).reduce((prev, [key, value]) => {
      prev[key as Key] = {
        toUrl: (url: string) => url,
        ...rest,
        ...value,
      }
      return prev
    }, {} as Record<Key, CDNConfig>)
  }

  private async getAvailableCdnUrl(url: string, ignoreCache: boolean = false): Promise<[string | null, AdaptError[] | null]> {
    if (this.filter && !this.filter(url)) return [url as string, null]
    const errors: AdaptError[] = []
    for (const key of this.priority) {
      const { toUrl, checkAlive, ...res } = this.cdnConfigs[key]

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cdnUrl = toUrl!(url, res)
      if (await this.getCheckAliveResult(cdnUrl, ignoreCache, ...(checkAlive ? checkAlive(url, res) : ([] as any)))) {
        return [cdnUrl, errors?.length ? errors : null]
      } else {
        errors.push(new AdaptError(`${cdnUrl}: check alive failed`, 3, { host: res.host, bucket: res.bucket, key }))
      }
    }
    return [null, [new AdaptError(`${url}: all cdn check alive failed`, 2, { key: 'cdns', host: '', bucket: '' })]]
  }

  async getAvailableUrl(url: string, ignoreCache: boolean = false): Promise<[string | null, AdaptError[] | null]> {
    const [cdnUrl, errors] = await this.getAvailableCdnUrl(url, ignoreCache)
    if (cdnUrl) {
      errors?.map((error) => {
        this.onError?.(error)
      })

      return [cdnUrl, errors]
    }

    return fetchCheck(url)
      .then(() => {
        errors?.map((error) => {
          this.onError?.(error)
        })

        return [url, errors] as [string, AdaptError[] | null]
      })
      .catch(() => {
        const error = new AdaptError(`${url}: all links(including source link) are not alive`, 1, { key: 'all', host: '', bucket: '' })
        this.onError?.(error)
        return [null, [error]]
      })
  }
  getHighestPriorityUrl(url: string) {
    return this.getCdnUrl(url, this.priority[0])
  }

  private getCdnUrl(url: string, key: Key) {
    const { toUrl, ...res } = this.cdnConfigs[key]
    if (this.filter && !this.filter(url)) return url
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return toUrl!(url, res)
  }
}
