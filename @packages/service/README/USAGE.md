## USAGE

```typescript
import { create, compose } from '@dumlj/service'
// way1
// create
const instance = create({
    admin: {
        interceptors: {
          request: [
            (config) => {
                // 请求前的拦截器
                return config
            },
            (error) => Promise.reject(error),
            ],
          response: [
            (response) => {
               // 请求成功后的拦截器
              return response.data
            },
            (error) => {
               // 请求失败后的拦截器
              return Promise.reject(error)
            },
          ],
         
        },
    }
},
{
    // AxiosRequestConfig   
}, 
{
    // 默认返回‘prod’
    getCurrentEnv(){
        return 'dev'
    }
    // 通过环境变量获取baseUrl, 默认返回 domain[env] 
    getBaseUrl(env, domain){
        
        return 'http://localhost:3000'
    }
})
instance.admin.get('/api/test')

// way 2
// compose 用于定于不同实例的请求数据格式
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
  }, 
}, ['data']>({}, {})

/**
 * Expect typeof a =  {
    data: {
        list: string[]
    }
    code: string
    message: string
  }
*/
const a = await instance.admin.get<{ list: string[] }>('/api/test')

```
