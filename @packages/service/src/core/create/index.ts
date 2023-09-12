import { ServiceConfig } from '@/config'
import type { HTTP } from '@/types'
import type { Helpers } from '@/types'
import { getBaseUrl, getCurrentEnv } from '@/utils/getCurrentEnv'
import type { AxiosRequestConfig, AxiosStatic } from 'axios'
import axios from 'axios'
import defaultsDeep from 'lodash/defaultsDeep'
import { registerExtensions } from '../extensions/registerExtensions'
import { registerBaseResponseInterceptor } from '../interceptors/baseResponse'
import { createHttpInterceptors } from '../interceptors/HttpInterceptors'

export const createAxios = (config: AxiosRequestConfig = ServiceConfig.axiosConfig, axiosStatic: AxiosStatic = axios) => {
  const finalConfig = defaultsDeep({}, config, ServiceConfig.axiosConfig) as AxiosRequestConfig
  const instance = axiosStatic.create(finalConfig)
  registerBaseResponseInterceptor(instance.interceptors)
  return instance
}

/**
 * 创建不同的 HTTP
 * @param domains 域名配置
 * @param config axios 默认配置
 * @param envConfig 环境配置
 *
 * @description
 * 因为域名, 环境等原因额外创建一个基于 Axios
 * 扩展的方法;
 * 根据不同的业务对其进行添加或修改
 *
 * * (注意) 这里不能 Axios 原有功能进行修改,
 * * 以防跟官方文档不一样造成学习成本;
 * * 但可以扩展方法方便调用
 *
 * @description
 * 类型 Domains 主要用于传值给 ThisType，外部不需要使用该值
 * 同时 ThisType 需要用于自身，因为 ts 无法获取自身，
 * 所以这里使用 Domains | Types.HttpDomainConfigs<Domains>
 */
export const create = <
  Domains extends Record<string, HTTP.HttpDomainConfig<any>>,
  Body extends Record<keyof Domains, any> = Record<
    keyof Domains,
    {
      data: any
      [key: string]: any
    }
  >,
  DataChain extends Record<keyof Domains, string[]> = Record<keyof Domains, ['data']>,
  Extension extends Record<keyof Domains, any> = any
>(
  domains: Domains | HTTP.HttpDomainConfigs<Domains>,
  config?: AxiosRequestConfig,
  envConfig?: HTTP.HttpEnvConfig,
  axiosStatic?: AxiosStatic
) => {
  const instances = createAxios(config, axiosStatic) as HTTP.HttpMultipleInstances<Domains>
  const envMethods = { getCurrentEnv, getBaseUrl, ...envConfig }
  const env = envMethods.getCurrentEnv()
  for (const name of Object.keys(domains) as (keyof Domains)[]) {
    const domain = domains[name]
    const baseURL = envMethods.getBaseUrl(env, domain)
    const instance = createAxios({ ...config, baseURL })
    createHttpInterceptors(domain.interceptors ?? {})(instance.interceptors)
    if (domain.extensions) {
      registerExtensions(domain.extensions, instance)
    }
    instances[name] = instance as any
  }
  return instances as unknown as Helpers.HttpCompose<HTTP.HttpMultipleInstances<Domains>, Body, DataChain, Extension>
}

/**
 * 因为每个域都可能有所不同,
 * 因此这里使用可以根据配置来对
 * 不同的域名进行不同的操作
 */
export function compose<Domains extends Record<string, HTTP.HttpDomainConfig<any>>>(domain: Domains) {
  return <
    Body extends Record<keyof Domains, any>,
    DataChain extends Record<keyof Domains, string[]> = Record<keyof Domains, ['data']>,
    // eslint-disable-next-line @typescript-eslint/ban-types
    Extension extends Record<keyof Domains, any> = Record<keyof Domains, {}>
  >(
    config?: AxiosRequestConfig,
    envConfig?: HTTP.HttpEnvConfig,
    axiosStatic?: AxiosStatic
  ) => {
    return create<Domains, Body, DataChain, Extension>(domain, config, envConfig, axiosStatic)
  }
}
