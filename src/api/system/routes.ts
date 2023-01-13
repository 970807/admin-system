import { http } from '@/utils/http'
import type { responseType } from '../types'

export const getAsyncRoutes = () => {
  return http.request<responseType<any[]>>(
    'get',
    '/api/system/routes/getAsyncRoutes'
  )
}
