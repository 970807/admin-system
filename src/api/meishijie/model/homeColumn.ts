export type listItemType = {
  id: string
  columnName: string // 栏位名称
  system: 1 | 0 // 是否是系统预设栏位 1:是 0:否
  available: 1 | 0 // 是否启用 1:启用 0：禁用
  sortNo: number // 排序值
  createTime: string
  updateTime: string
}

// 获取首页栏位列表请求参数
export interface IGetHomeColumnListParams {
  columnName?: string // 栏位名称
}

// 获取首页栏位列表响应结果
export type IGetHomeColumnListResults = listItemType[]

// 获取首页栏位详情响应结果
export type getHomeColumnDetailResultType = Omit<
  listItemType,
  'createTime' | 'updateTime'
>

// 添加首页栏位请求体
export type addHomeColumnDataType = Omit<
  listItemType,
  'id' | 'system' | 'createTime' | 'updateTime'
>

// 编辑首页栏位请求体
export type editHomeColumnDataType = Omit<
  listItemType,
  'system' | 'createTime' | 'updateTime'
>

// 更新首页栏位排序值请求体
export type updateHomeColumnSortNoDataType = {
  id: listItemType['id']
  sortNo: listItemType['sortNo']
}

// 批量删除首页栏位请求体
export type batchDeleteHomeColumnDataType = {
  idList: Array<listItemType['id']>
}

// 启用/禁用首页栏位请求体
export type availableHomeColumnDataType = {
  available: listItemType['available']
  idList: Array<listItemType['id']>
}
