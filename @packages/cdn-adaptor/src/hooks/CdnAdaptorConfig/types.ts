import { CdnAdaptor } from '../../core'
import { CDNAdapterOptions } from '../../types'

export interface CdnAdaptorContextType<Key extends string> extends CDNAdapterOptions<Key> {
  cdnAdaptor?: CdnAdaptor<Key>
}
