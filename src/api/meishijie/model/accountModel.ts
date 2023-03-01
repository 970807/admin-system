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
  pageNo: number
  pageSize: number
  account: string
  nickname: string
}

// 获取账号列表响应结果
export interface IGetListResult {
  list: listItemType[]
  totalCount: number
}

// 添加账号请求体
export interface IAddAccountData {
  account?: string
  phone?: string
  password: string
  nickname?: string
  avatar?: string
}

// 添加账号响应结果
export interface IAddAccountResult {
  id: number
  account: string
  phone: string
  nickname: string
  avatar: string
}

// 编辑账号请求体
export interface IEditAccountData extends Omit<IAddAccountData, 'password'> {
  id: number
}

// 编辑账号响应结果
export type IEditAccountResult = IAddAccountResult

// 修改密码请求体
export interface IEditAccountPasswordData {
  id: number
  password: string
}

// 修改密码响应结果
export interface IEditAccountPasswordResult {
  id: number
}

// 删除账号请求体
export interface IDeleteAccountData {
  id: number
}

// 删除账号响应结果
export type IDeleteAccountResult = undefined
