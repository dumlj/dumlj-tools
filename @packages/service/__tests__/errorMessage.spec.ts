import { ServiceConfig } from '@/config'
import { setErrorMessages } from '@/index'

describe('测试错误信息 errorMessages', () => {
  it('测试错误信息 errorMessages', () => {
    const STATUS_410 = 'JEST_STATUS_410'
    setErrorMessages({
      STATUS_410,
    })
    expect(ServiceConfig.errorMessages.STATUS_410).toBe(STATUS_410)
  })
})
