import type { Handlers } from '../types'
import { apiTestHandlers } from './apiTest'
import { cdnHandlers } from './cdns'

import { demoHandlers } from './demo'

export const handlers: Handlers = [...demoHandlers, ...cdnHandlers, ...apiTestHandlers]
