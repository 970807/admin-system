export type listItemType = {
  id: number
  username: string
  avatar: string | null
  role: string
}

export interface IGetListParams {
  pageNo: number
  pageSize: number
  username: string
}

export interface IGetListResult {
  list: listItemType[]
  totalCount: number
}
