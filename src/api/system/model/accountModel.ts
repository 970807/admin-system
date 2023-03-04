export type listItemType = {
  id: number
  username: string
  avatar: string | null
  role: string
  enable: 0 | 1
}

export interface IGetListParams {
  pageNo: number
  pageSize: number
  username?: string
  roleId?: number
  orderProp: string
  orderSeq: '' | 'asc' | 'desc'
}

export interface IGetListResult {
  list: listItemType[]
  totalCount: number
}

export interface IIsExistAccountParams {
  username: string
}

export interface IAddAccountData {
  username: string
  password: string
  avatar?: string
  roleId: number
  enable: 0 | 1
}

export type IEditAccountData = Omit<IAddAccountData, 'password'>

export interface IBatchDelData {
  idList: Array<listItemType['id']>
}

export interface IResetPasswordData {
  id: listItemType['id']
  password: IAddAccountData['password']
}
