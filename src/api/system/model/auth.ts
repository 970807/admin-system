export interface IAuthListItem {
  id: number
  parentId: number | null
  name: string
  authMarker: string
  menuPath: string | null
  menuIcon: string | null
  redirect: string | null
  cpnPath: string | null
  authType: 0 | 1
  systemAuth: 0 | 1
  sortNo: number
  remark: string | null
}

export interface IAddOrEditAuthData {
  id?: number
  parentId: number | null
  name: string
  authMarker: string
  menuPath?: string
  menuIcon?: string
  redirect?: string
  cpnPath?: string
  authType: 0 | 1
  sortNo: number
  remark?: string
}

export interface IBatchDelAuthData {
  idList: Array<IAuthListItem['id']>
}
