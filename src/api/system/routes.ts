import { http } from '@/utils/http'

export const getAsyncRoutes = () => {
  return http.request<any[]>('get', '/api/system/routes/getAsyncRoutes')
}
