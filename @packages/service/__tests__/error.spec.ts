import { REQUEST_ABORTED_MESSAGE } from '@/constants'
import { RejectError } from '@/core/error'
import { CanceledError } from 'axios'

describe('测试错误类 RejectError', () => {
  test('测试错误类 RejectError', () => {
    const error = new RejectError('test')
    expect(error).toBeInstanceOf(RejectError)
    expect(error.name).toBe('RejectError')
  })
  test('测试错误类 RejectError with origin', () => {
    const MSG = 'test'
    const error = new RejectError(MSG, new Error(MSG))
    expect(error).toBeInstanceOf(RejectError)
    expect(error.message).toBe(MSG)
    expect(error.origin).toBeInstanceOf(Error)
    expect(error.origin.name).toBe('Error')
    expect(error.stack).toBe(error.origin.stack)
  })
  test('测试错误类 RejectError.isCancelOrAbsorbed', () => {
    const MSG = 'test'
    const error = new RejectError(MSG, new Error(MSG))
    expect(RejectError.isCancelOrAbsorbed(error)).toBe(false)
    const cancelError = new CanceledError(MSG)
    expect(RejectError.isCancelOrAbsorbed(cancelError)).toBe(true)
    const cancelError2 = new RejectError(REQUEST_ABORTED_MESSAGE)
    expect(RejectError.isCancelOrAbsorbed(cancelError2)).toBe(true)
    const cancelError3 = new RejectError(MSG, cancelError)
    expect(RejectError.isCancelOrAbsorbed(cancelError3)).toBe(true)
    const cancelError4 = new RejectError(MSG, cancelError2)
    expect(RejectError.isCancelOrAbsorbed(cancelError4)).toBe(true)
  })
})
