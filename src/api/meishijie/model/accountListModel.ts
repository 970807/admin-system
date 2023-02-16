export type listItemType = {
  id: number
  phone: string | null
  account: string | null
  password: string
  nickname: string | null
  avatar: string | null
  fanCount: number | null
  createTime: string
  updateTime: string
}

// 获取账号列表请求参数
export interface IGetListParams {
  page: number
  pageSize: number
  account: string
  nickname: string
}

// 获取账号列表响应结果
export interface IGetListResult {
  list: listItemType[]
  totalCount: number
}
