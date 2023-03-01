export type listItemType = {
  id: number
  roleName: string
  enable: 0 | 1
  createTime: string
  updateTime: string
}

export type IGetListResult = listItemType[]

export interface IExistRoleNameParams {
  roleName: string
}

export type IExistRoleNameResult = boolean

export interface IAddOrEditRoleData {
  roleName: string
  enable: 0 | 1
}
