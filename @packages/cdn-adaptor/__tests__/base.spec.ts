import { CdnAdaptor, type CDNConfig } from '../src'
const toUrl = (url: string, { host }: { host: string }) => {
  try {
    const urlObj = new URL(url)
    urlObj.host = host
    return urlObj.toString()
  } catch (e) {
    return new URL(url, `https://${host}`).toString()
  }
}

const cdnConfig: Record<string, CDNConfig> = {
  s3: {
    host: 's3.mock.dev',
  },
  oss: {
    host: 'oss.mock.dev',
  },
}

const cdnAdaptor = new CdnAdaptor({
  filter: (url) => !url.includes('no-change'),
  toUrl: toUrl,

  priority: ['s3', 'oss'],
  cdnConfigs: cdnConfig,
})

describe('基础功能', () => {
  test('优先级测试', () => {
    const path = '/change/test.json'
    const url = `https://oss.mock.dev${path}`
    const res = cdnAdaptor.getHighestPriorityUrl(url)
    expect(res).toBe(toUrl(path, cdnConfig.s3))
  })
  test('过滤器测试', async () => {
    const path = '/no-change/test.json'
    const url = `https://oss.mock.dev${path}`
    const res = cdnAdaptor.getHighestPriorityUrl(url)
    expect(res).toBe(url)
    const [res2] = await cdnAdaptor.getAvailableUrl(url)
    expect(res2).toBe(url)
  }, 10)
  test('自动适配测试', async () => {
    const noS3 = '/no-s3/test.json'
    const noOss = '/no-oss/test.json'
    const [resOss] = await cdnAdaptor.getAvailableUrl(noS3)
    expect(resOss).toBe(toUrl(noS3, cdnConfig.oss))
    const [resS3] = await cdnAdaptor.getAvailableUrl(noOss)
    expect(resS3).toBe(toUrl(noOss, cdnConfig.s3))
  })
  test('自定义存活性检测', async () => {
    const check = jest.fn()
    const errorHandler = jest.fn()
    const cdnAdaptor = new CdnAdaptor({
      filter: (url) => !url.includes('no-change'),
      toUrl: toUrl,
      checkAlive: (url, cdnOptions) => {
        return [
          cdnOptions.host,
          async () => {
            const res = await fetch(toUrl('/test/test.gif', cdnOptions)).then((res) => {
              //断言只跑一次
              check()
              return res
            })
            return res.ok
          },
        ]
      },
      onError() {
        errorHandler()
      },
      priority: ['s3', 'oss'],
      cdnConfigs: cdnConfig,
    })
    const dataList = ['/alive/test.json', '/alive/test2.json']
    await Promise.all(dataList.map((data) => cdnAdaptor.getAvailableUrl(data)))
    cdnAdaptor.clearCheckAliveResult()
    await Promise.all(dataList.map((data) => cdnAdaptor.getAvailableUrl(data)))
    expect(check).toHaveBeenCalledTimes(2)
    expect(errorHandler).toHaveBeenCalledTimes(0)
  })
})
