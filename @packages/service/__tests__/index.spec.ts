import { ERROR_MESSAGE_MAP } from '@/constants'
import { compose } from '@/core'
import axios from 'axios'

const generate = compose({
  admin: {
    interceptors: {
      request: [
        (config) => {
          return config
        },
        (error) => Promise.reject(error),
      ],
      response: [
        (response) => {
          return response.data
        },
      ],
      extensions: {},
    },
  },
})
const instance = generate<{
  admin: {
    data: unknown
    code: string
    message: string
  }
}>({}, {}, axios)
describe('index test', () => {
  it('test', async () => {
    try {
      const a = await instance.admin.get<{
        list: string[]
      }>('/api/test')
      expect(a.data).toEqual({
        test: 1,
      })
    } catch (e: any) {
      expect(e.message).toBe(ERROR_MESSAGE_MAP.GET_404)
    }
  })
})
