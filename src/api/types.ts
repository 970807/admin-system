export type responseType<T> = {
  code: number
  data: T
  message?: string
}
