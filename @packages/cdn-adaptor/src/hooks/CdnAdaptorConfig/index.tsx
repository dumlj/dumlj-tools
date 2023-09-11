import React from 'react'
import { CdnAdaptor } from '../../core'
import type { CDNAdapterOptions } from '../../types'
import type { CdnAdaptorContextType } from './types'

const cdnAdaptorWeekMap = new WeakMap<CDNAdapterOptions<string>, CdnAdaptor<string>>()

const getCdnAdaptor = <Key extends string>(config: CDNAdapterOptions<Key>) => {
  if (!cdnAdaptorWeekMap.has(config)) cdnAdaptorWeekMap.set(config, new CdnAdaptor(config))
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cdnAdaptorWeekMap.get(config)! as CdnAdaptor<Key>
}
const CdnAdaptorContext = React.createContext<CdnAdaptorContextType<string>>({
  cdnConfigs: {},
})

export const useCdnAdaptor = <Key extends string>() => {
  try {
    return React.useContext(CdnAdaptorContext as React.Context<CdnAdaptorContextType<Key>>)
  } catch (e) {
    return null
  }
}

export const useCurrentCdnAdaptor = <Key extends string>(config?: CDNAdapterOptions<Key>) => {
  const superCdnAdaptor = useCdnAdaptor()
  if (!config && !superCdnAdaptor) {
    throw new Error('when config is empty, useCurrentCdnAdaptor must be use in CdnAdaptorConfig!')
  }
  if (config) {
    if (!superCdnAdaptor)
      return {
        ...config,
        cdnAdaptor: getCdnAdaptor(config),
      }
    const newConfig = { ...superCdnAdaptor?.cdnConfigs, ...config }
    return {
      ...newConfig,
      cdnAdaptor: new CdnAdaptor(newConfig),
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return superCdnAdaptor! as CdnAdaptorContextType<Key>
  }
}

export const CdnAdaptorConfig = <Key extends string>(props: { value: CDNAdapterOptions<Key>; children?: React.ReactNode }) => {
  const value = useCurrentCdnAdaptor(props.value)

  return <CdnAdaptorContext.Provider value={value}>{props.children}</CdnAdaptorContext.Provider>
}
