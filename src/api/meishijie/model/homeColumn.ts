export type listItemType = {
  id: string
  columnName: string // 栏位名称
  recipeCount: number | null // 栏位菜谱数
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

// 首页栏位-今日热门视频菜谱-查询列表 请求参数
export interface IGetTodayHotVideoRecipeParams {
  recipeName: string // 菜谱名称
}

// 首页栏位 - 今日热门视频菜谱 - 更新排序值 请求体
export type updateTodayHotVideoRecipeSortNoDataType = {
  id: string
  sortNo: number
}

// 首页栏位 - 今日热门视频菜谱 - 删除菜谱 请求体
export type deleteTodayHotVideoRecipeDataType = {
  idList: Array<listItemType['id']>
}

// 首页栏位-今日热搜-查询列表 请求参数
export type IGetTodayHotSearchParams = {
  keyword?: string // 关键词
}

// 首页栏位-今日热搜-查询列表 响应结果
export type IGetTodayHotSearchResults = Array<{
  id: string // 主键id
  keyword: string // 关键词
  sortNo: number // 排序值
  superHot: 1 | 0 // 是否超级热搜 1：是 0:否
}>

// 首页栏位-今日热搜-添加热搜 请求体
export type addTodayHotSearchDataType = {
  keyword?: string // 关键词
  sortNo: number // 排序值
  superHot: 1 | 0 // 是否超级热搜
}

// 首页栏位-今日热搜-更新排序值 请求体
export type updateTodayHotSearchSortNoDataType = {
  id: string // 主键id
  sortNo: number // 排序值
}

// 首页栏位-今日三餐-查询列表 请求参数
export type IGetTodayThreeMealsListParams = {
  type: string // 三餐类型 breakfast：早餐 lunch：午餐 afternoonTea：下午茶 dinner：晚餐 nightSnack：夜宵
  recipeName?: string // 菜谱名称
}

// 首页栏位-今日三餐-查询列表 响应结果
export type getTodayThreeMealsListResults = Array<{
  id: string // 主键id
  recipeId: string // 菜谱id
  recipeName: string // 菜谱名称
  type: string // 三餐类型 breakfast：早餐 lunch：午餐 afternoonTea：下午茶 dinner：晚餐 nightSnack：夜宵
  sortNo: number // 排序值
}>

// 首页栏位-今日三餐-添加菜谱 请求体
export type addTodayThreeMealsDataType = {
  recipeIdList: string[] // 菜谱id列表
  type: string // 三餐类型 breakfast：早餐 lunch：午餐 afternoonTea：下午茶 dinner：晚餐 nightSnack：夜宵
}

// 首页栏位-今日三餐-更新排序值 请求体
export type updateTodayThreeMealsSortNoDataType = {
  id: string // 主键id
  sortNo: number // 排序值
}

// 首页栏位-(非系统)菜谱管理-查询列表 请求参数
export type IGetColumnRecipeListParams = {
  recipeName?: string // 菜谱名称
}

// 首页栏位-(非系统)菜谱管理-查询列表 响应结果
export type getColumnRecipeListResults = Array<{
  id: string // 主键id
  columnId: string // 栏位id
  recipeId: string // 菜谱id
  recipeName: string // 菜谱名称
  sortNo: number // 排序值
}>

// 首页栏位-(非系统)菜谱管理-添加菜谱 请求体
export type addColumnRecipeDataType = {
  columnId: string // 栏位id
  recipeIdList: string[] // 菜谱id列表
}

// 首页栏位-(非系统)菜谱管理-更新排序值 请求体
export type updateColumnRecipeSortNoDataType = {
  id: string // 主键id
  sortNo: number // 排序值
}
