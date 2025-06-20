import Axios, {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from 'axios'

export type resultType = {
  accessToken?: string
}

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void
  beforeResponseCallback?: (response: PureHttpResponse) => void
}

export default class PureHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T>
  post<T, P>(
    url: string,
    params?: T,
    config?: PureHttpRequestConfig
  ): Promise<P>
  get<T, P>(url: string, params?: T, config?: PureHttpRequestConfig): Promise<P>
}

export type responseType<T> = {
  code: number
  data: T
  message?: string
}

// 请求状态码
export enum requestCode {
  SUCCESS = 0,
  FAIL = -1,
  TOKEN_EXPIRES = 401 // token无效或已过期
}
