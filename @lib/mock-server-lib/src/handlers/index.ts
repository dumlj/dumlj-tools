import type { Handlers } from '../types'
import { cdnHandlers } from './cdns'

import { demoHandlers } from './demo'

export const handlers: Handlers = [...demoHandlers, ...cdnHandlers]
