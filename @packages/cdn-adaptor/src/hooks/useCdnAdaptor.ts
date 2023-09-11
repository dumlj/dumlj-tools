import React from 'react'
import type { AdaptError } from '../core/AdaptError'
import type { CDNAdapterOptions } from '../types'
import { useCurrentCdnAdaptor } from './CdnAdaptorConfig'
import useMap from './useMap'

export const useCdnAdaptor = <Key extends string>(options?: CDNAdapterOptions<Key>) => {
  const { cdnAdaptor } = useCurrentCdnAdaptor(options)
  const [resultMap, { set }] = useMap<string, string>()

  return {
    a: React.useMemo(
      () =>
        (url: string, { onError }: { onError?: (error: AdaptError) => void } = {}) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (resultMap.has(url)) return resultMap.get(url)!
          cdnAdaptor?.getAvailableUrl(url).then(([res, errors]) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            res && set(url, res)
            onError && errors?.forEach(onError)
          })

          return cdnAdaptor?.getHighestPriorityUrl(url) ?? ''
        },
      [cdnAdaptor, resultMap, set]
    ),
    cdnAdaptor,
  }
}
