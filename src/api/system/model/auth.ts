export interface IAuthListItem {
  id: number
  parentId: number | null
  name: string
  authMarker: string
  menuName: string | null
  menuPath: string | null
  menuIcon: string | null
  redirect: string | null
  cpnPath: string | null
  authType: 0 | 1
  systemAuth: 0 | 1
  sortNo: number
  remark: string | null
  enable: 0 | 1
}

export interface IAddOrEditAuthData {
  id?: number
  parentId: number | null
  name: string
  authMarker: string
  menuName?: string
  menuPath?: string
  menuIcon?: string
  redirect?: string
  cpnPath?: string
  authType: 0 | 1
  sortNo: number
  remark?: string
  enable: 0 | 1
}

export interface IBatchDelAuthData {
  idList: Array<IAuthListItem['id']>
}
