import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { Assign, ValuesType } from 'utility-types'
import { ENVS, ERROR_MESSAGE_MAP } from '@/constants'

/**
 * HTTP 拦截器
 */
export interface HttpInterceptors {
  /**
   * 请求拦截器
   */
  request?: Parameters<AxiosInstance['interceptors']['request']['use']>
  /**
   * 响应拦截器
   */
  response?: Parameters<AxiosInstance['interceptors']['response']['use']>
}

export interface HTTPServiceSettings {
  axiosConfig?: AxiosRequestConfig
  errorMessages?: typeof ERROR_MESSAGE_MAP
}

export type HttpEnvironment = ValuesType<typeof ENVS>

/** 扩展方法 */
export type HttpExtensionMethod = (this: AxiosInstance, ...args: any[]) => any

/** 扩展方法集合 */
export type HttpExtensions<Methods = unknown> = Methods extends string ? Record<Methods, HttpExtensionMethod> : never

/**
 * 配置域名
 * @param Extensions 扩展传值
 */
export type HttpDomainConfig<Extensions = unknown> = Assign<
  // 环境对应的请求地址集合
  Partial<Record<HttpEnvironment, string>>,
  {
    /** 拦截器配置回调 */
    interceptors?: HttpInterceptors
    /**
     * 扩展方法
     * @description
     * 注意这里 ThisType 必须要最外层传递进来, 内部无法获取 this 指向
     */
    extensions?: Extensions extends HttpExtensions<string>
      ? // 这里既是自身也是 axios 实例, 这样才能调用自己
        Extensions & ThisType<AxiosInstance & Extensions>
      : never
  }
>

/** 配置域名集合 */
export type HttpDomainConfigs<E extends Record<string, HttpDomainConfig<any>>> = {
  [K in keyof E]: HttpDomainConfig<E[K]['extensions']>
}

/** 请求实例 */
export type HttpInstance<Config extends HttpDomainConfig> = Config['extensions'] extends Record<string, any>
  ? AxiosInstance & {
      [K in keyof Config['extensions']]: Config['extensions'][K] extends HttpExtensionMethod ? Config['extensions'][K] : never
    }
  : AxiosInstance

/** 请求实例集合 */
export type HttpMultipleInstances<Configs extends Record<string, HttpDomainConfig>> = AxiosInstance & {
  [K in keyof Configs]: HttpInstance<Configs[K]>
}

export type HttpEnvConfig = {
  getCurrentEnv?: () => HttpEnvironment
  getBaseUrl?: (env: HttpEnvironment, domain: HttpDomainConfig) => string
}
