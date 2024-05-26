export interface IAuthListItem {
  id: string
  parentId: number | null
  name: string
  authMarker: string
  menuName: string | null
  menuPath: string | null
  menuIcon: string | null
  menuHidden: 0 | 1
  redirect: string | null
  cpnPath: string | null
  authType: 0 | 1
  systemAuth: 0 | 1
  sortNo: number
  remark: string | null
  enable: 0 | 1
}

export interface IAddOrEditAuthData {
  id?: string
  parentId: number | null
  name: string
  authMarker: string
  menuName?: string
  menuPath?: string
  menuIcon?: string
  menuHidden: 0 | 1
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
