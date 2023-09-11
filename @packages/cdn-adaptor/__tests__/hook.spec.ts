import { useCdnAdaptor } from './../src/hooks'
import { renderHook } from '@testing-library/react-hooks'
import { useMemo } from 'react'

const toUrl = (url: string, { host }: { host: string }) => {
  try {
    const urlObj = new URL(url)
    urlObj.host = host
    return urlObj.toString()
  } catch (e) {
    return new URL(url, `https://${host}`).toString()
  }
}

const cdnConfig = {
  s3: {
    host: 's3.mock.dev',
  },
  oss: {
    host: 'oss.mock.dev',
  },
}
describe('react hook测试', () => {
  test('useCdnAdaptor', async () => {
    const path = '/no-s3/test.json'
    const url = `https://oss.mock.dev${path}`
    const { result, waitForNextUpdate } = renderHook(() => {
      const { a } = useCdnAdaptor({
        filter: (url) => !url.includes('no-change'),
        toUrl: toUrl,

        priority: ['s3', 'oss'],
        cdnConfigs: cdnConfig,
      })
      return useMemo(() => {
        return a(url)
      }, [a])
    })

    expect(result.current).toBe(toUrl(path, cdnConfig.s3))
    await waitForNextUpdate({
      timeout: 1100,
    })
    expect(result.current).toBe(toUrl(path, cdnConfig.oss))
  })
})
