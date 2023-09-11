## USAGE

### Class实例使用

```typescript
// class使用
import { CdnAdaptor, type CDNConfig } from '@dumlj/cdn-adapter'

/**
* cdn请求链接构造方法
*/
const toUrl = (url: string, { host }: { host: string }) => {
  try {
    const urlObj = new URL(url)
    urlObj.host = host
    return urlObj.toString()
  } catch (e) {
    return new URL(url, `https://${host}`).toString()
  }
}

/**
* cdn源配置
*/
const cdnConfig: Record<string, CDNConfig> = {
  s3: {
    host: 's3.mock.dev',
  },
  oss: {
    host: 'oss.mock.dev',
  },
}

const cdnAdaptor = new CdnAdaptor({
  // 过滤器，true才进入适配流程
  filter: (url) => !url.includes('no-change'),
  toUrl: toUrl,
  // 优先级
  priority: ['s3', 'oss'],
  cdnConfigs: cdnConfig,
  // 存活性检测配置
  checkAlive(originUrl, cdnOptions) {
    // [key, 校验方法（返回Promise<boolean>）], 同一个key在同一个实例中只会校验一次
    return [cdnOptions.host,  async () => {
            const res = await fetch(toUrl('/test/test.gif', cdnOptions)).then((res) => {
              return res
            })
            return res.ok
        },
    ]
  },
  //错误回调
  onError(err){
    // 错误分级
    console.log(error.level);
    // 失活的cdn配置
    console.log(error.cdn);
    // 错误信息
    console.log(error.message);
  }
})
const originUrl = 'test.json';
// 同步获取最高优先级的地址（忽略存活性校验）
const res = cdnAdaptor.getHighestPriorityUrl(originUrl)
// 获取存活且优先级最高的地址
const res1 = await cdnAdaptor.getAvailableUrl(originUrl)

// 获取存活且优先级最高的地址, 忽略缓存
const res2 = await cdnAdaptor.getAvailableUrl(originUrl, true)
```

### react hook使用

```typescript
// react hook使用
import { CdnAdaptor, type CDNConfig } from '@series-one/cdn-adapter'


/**
* cdn请求链接构造方法
*/
const toUrl = (url: string, { host }: { host: string }) => {
  try {
    const urlObj = new URL(url)
    urlObj.host = host
    return urlObj.toString()
  } catch (e) {
    return new URL(url, `https://${host}`).toString()
  }
}

/**
* cdn源配置
*/
const cdnConfig: Record<string, CDNConfig> = {
  s3: {
    host: 's3.mock.dev',
  },
  oss: {
    host: 'oss.mock.dev',
  },
}

export const Com: React.FC = ()=>{
  const img = 'pic.jpg';
  // a方法会先返回getHighestPriorityUrl的结果，然后等getAvailableUrl返回后更新
  const { a } = useCdnAdaptor({
    filter: (url) => !url.includes('no-change'),
    toUrl: toUrl,

    priority: ['s3', 'oss'],
    cdnConfigs: cdnConfig,
  })

  return <img src={a(img)} />
}


```

```typescript
// 统一配置

// react hook使用
import { CdnAdaptor,CdnAdaptorConfig, type CDNConfig } from '@series-one/cdn-adapter'


/**
* cdn请求链接构造方法
*/
const toUrl = (url: string, { host }: { host: string }) => {
  try {
    const urlObj = new URL(url)
    urlObj.host = host
    return urlObj.toString()
  } catch (e) {
    return new URL(url, `https://${host}`).toString()
  }
}

/**
* cdn源配置
*/
const cdnConfig: Record<string, CDNConfig> = {
  s3: {
    host: 's3.mock.dev',
  },
  oss: {
    host: 'oss.mock.dev',
  },
}


const Com: React.FC = () => {
  const img = 'pic.jpg'
  // a方法会先返回getHighestPriorityUrl的结果，然后等getAvailableUrl返回后更新
  const { a } = useCdnAdaptor()

  return <img src={a(img)} />
}

const App: React.FC = () => {
  return (
    <CdnAdaptorConfig
      value={{
        filter: (url) => !url.includes('no-change'),
        toUrl: toUrl,

        priority: ['s3', 'oss'],
        cdnConfigs: cdnConfig,
      }}
    >
      <Com />
    </CdnAdaptorConfig>
  )
}
```
