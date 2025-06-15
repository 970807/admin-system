export type listItemType = {
  id: string
  isVideo: 1 | 0 // 是否是视频菜谱 1 => 是 0 => 否
  coverUrl: string // 菜谱封面地址
  videoUrl: string // 菜谱视频地址
  recipeName: string // 菜谱名称
  favCount: number // 收藏数
  browerCount: number // 浏览数
  simpleIntroductionTechnology: string // 工艺
  simpleIntroductionTaste: string // 口味
  simpleIntroductionTime: string // 时间
  simpleIntroductionDifficulty: string // 难度
  mainIngredientsStr: string // 主料
  subIngredientsStr: string // 辅料
  peopleCount: number // 人份 例：3人份
  authorId: string // 作者用户id
  authorName: string | null // 作者用户名称
  authorWords: string
  finishFoodImgsStr: string
  stepsStr: string // 菜谱步骤：格式 =>  步骤图片,步骤内容;步骤图片,步骤内容;
  recipeTips: string | null
  originWebLink: string | null // 美食杰官方对应的链接
  publish: 1 | 0 // 是否发布 1:发布 0:未发布
  createTime: string
  updateTime: string
}

// 获取菜谱列表请求参数
export interface IGetRecipeListParams {
  recipeName: string
  isVideo?: 1 | 0 // 是否是视频菜谱 1：是 0:否
  pageNo: number
  pageSize: number
}

// 获取菜谱列表响应结果
export interface IGetRecipeListResult {
  list: listItemType[]
  totalCount: number
}

export type stepListType = Array<{ imgUrl: string; content: string }>

// 获取菜谱详情响应结果
export type getRecipeDetailByIdResultType = Omit<
  listItemType,
  'createTime' | 'updateTime'
> & {
  finishFoodImgUrlList: string[]
  stepList: stepListType
}

// 添加菜谱请求体
export type addRecipeDataType = Omit<
  listItemType,
  | 'id'
  | 'finishFoodImgsStr'
  | 'stepsStr'
  | 'authorName'
  | 'createTime'
  | 'updateTime'
>

// 编辑菜谱请求体
export type editRecipeDataType = Omit<
  listItemType,
  'authorName' | 'finishFoodImgsStr' | 'stepsStr' | 'createTime' | 'updateTime'
>

// html导入菜谱请求体
export interface IImportFromHtmlStrDataType {
  htmlStr: string
}

// 批量删除菜谱请求体
export interface IBatchDeleteRecipeData {
  idList: string[]
}

// 发布/取消发布菜谱请求体
export interface IPublishRecipeData {
  publish: 1 | 0
  idList: string[]
}
