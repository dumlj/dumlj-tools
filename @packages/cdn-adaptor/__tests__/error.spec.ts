import { CdnAdaptor } from '../src/core'

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
describe('错误处理', () => {
  test('3级错误，单个cdn失效', async () => {
    expect.assertions(2)
    const cdnAdaptor = new CdnAdaptor({
      toUrl: toUrl,

      priority: ['s3', 'oss'],
      cdnConfigs: cdnConfig,
      onError(err) {
        expect(err.level).toBe(3)
        expect(err.cdn.host).toBe(cdnConfig.s3.host)
      },
    })
    const noS3 = '/no-s3/test.json'
    await cdnAdaptor.getAvailableUrl(noS3)
  })
  test('2级错误，所有cdn失效', async () => {
    expect.assertions(2)
    const noAll = 'https://origin.mock.dev/no-data/test.json'

    const cdnAdaptor = new CdnAdaptor({
      toUrl: toUrl,

      priority: ['s3', 'oss'],
      cdnConfigs: cdnConfig,
      onError(err) {
        expect(err.level).toBe(2)
        expect(err.cdn.key).toBe('cdns')
      },
    })
    await cdnAdaptor.getAvailableUrl(noAll)
  })
  test('1级错误，所有cdn失效，源链接也失效', async () => {
    expect.assertions(3)
    const noAll = 'https://origin.mock.dev/no-origin/test.json'

    const cdnAdaptor = new CdnAdaptor({
      toUrl: toUrl,

      priority: ['s3', 'oss'],
      cdnConfigs: cdnConfig,
      onError(err) {
        expect(err.level).toBe(1)
        expect(err.cdn.key).toBe('all')
      },
    })
    const [, error] = await cdnAdaptor.getAvailableUrl(noAll)
    expect(error?.[0]).toBeInstanceOf(Error)
  })
})
