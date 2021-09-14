const { v4: uuidv4 } = require('uuid')
const meishijieDb = require('../../db/meishijie')
const getList = require('../../utils/getList')

/*
  把食材列表格式化成特定字符串： 食材id:用量;食材id:用量;
*/
const formatIngredientListToStr = (list) => {
  let resStr = ''
  for (const { ingredientId, ingredientDose } of list) {
    resStr += `${ingredientId}:${ingredientDose};`
  }
  return resStr
}

const formatIngredientsStrToList = (str) => {
  return str
    .slice(0, -1)
    .split(';')
    .map((item) => {
      const [ingredientId, ingredientDose] = item.split(':')
      return { ingredientId: Number(ingredientId), ingredientDose }
    })
}

/*
  把成品图列表格式化成特定字符串： 图片链接;图片链接;图片链接;
*/
const formatFinishFoodImgUrlListToStr = (list) => {
  let resStr = ''
  for (const item of list) {
    resStr += `${item};`
  }
  return resStr
}

const formatFinishFoodImgUrlStrToList = (str) => {
  return str.slice(0, -1).split(';')
}

/*
  把步骤列表格式化成特定字符串：  步骤图片,步骤内容;步骤图片,步骤内容;步骤图片,步骤内容;
*/
const formatStepListToStr = (list) => {
  let resStr = ''
  for (const { imgUrl = '', content = '' } of list) {
    resStr += `${imgUrl},${content};`
  }
  return resStr
}

const formatStepStrToList = (str) => {
  return str
    .slice(0, -1)
    .split(';')
    .map((item) => {
      const [imgUrl, content] = item.split(',')
      return { imgUrl, content }
    })
}

const getIngredientNameFromIngredientMap = (ingredientList, ingredientMap) => {
  const res = []
  for (const item of ingredientList) {
    const ingredientId = item.ingredientId
    const r = ingredientMap.find((item2) => item2.id === ingredientId)
    const ingredientName = r && r.ingredientName
    res.push({ ...item, ...{ ingredientName } })
  }
  return res
}

exports.getRecipeList = (req, res, next) => {
  getList({
    req,
    res,
    next,
    db: meishijieDb,
    dbTable: 'recipe_detail_list'
  })
}

exports.addRecipe = async (req, res, next) => {
  try {
    const {
      recipeName,
      isVideo,
      coverUrl,
      videoUrl,
      simpleIntroductionTechnology,
      simpleIntroductionTaste,
      simpleIntroductionTime,
      simpleIntroductionDifficulty,
      mainIngredientList,
      subIngredientList,
      peopleCount,
      favCount,
      browerCount,
      authorWords,
      stepList,
      finishFoodImgUrlList,
      recipeTips,
      authorId,
      originWebLink
    } = req.body
    const d = new Date()
    const id = uuidv4()
    const r1 = await meishijieDb.query('insert into recipe_detail_list set ?', {
      id,
      recipeName,
      isVideo,
      coverUrl,
      videoUrl,
      simpleIntroductionTechnology,
      simpleIntroductionTaste,
      simpleIntroductionTime,
      simpleIntroductionDifficulty,
      mainIngredientsStr: formatIngredientListToStr(mainIngredientList),
      subIngredientsStr: formatIngredientListToStr(subIngredientList),
      peopleCount,
      favCount,
      browerCount,
      authorWords,
      finishFoodImgsStr: formatFinishFoodImgUrlListToStr(finishFoodImgUrlList),
      stepsStr: formatStepListToStr(stepList),
      recipeTips,
      authorId,
      originWebLink,
      createTime: d,
      updateTime: d
    })
    if (r1.affectedRows < 1) {
      res.json({ code: '-1', message: '添加菜谱失败' })
    }
    res.json({ code: '200', message: '添加菜谱成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.getRecipeDetailById = async (req, res, next) => {
  try {
    const { id } = req.query
    const [detail] = await meishijieDb.query(
      'select * from recipe_detail_list where id=?',
      id
    )
    if (!detail) {
      res.json({ code: '-1', message: '获取详情失败' })
    }
    detail.stepList = formatStepStrToList(detail.stepsStr)
    delete detail.stepsStr
    detail.finishFoodImgUrlList = formatFinishFoodImgUrlStrToList(
      detail.finishFoodImgsStr
    )
    delete detail.finishFoodImgsStr
    delete detail.createTime
    delete detail.updateTime
    detail.mainIngredientList = formatIngredientsStrToList(
      detail.mainIngredientsStr
    )
    delete detail.mainIngredientsStr
    detail.subIngredientList = formatIngredientsStrToList(
      detail.subIngredientsStr
    )
    delete detail.subIngredientsStr
    const allIngredientIdList = [
      ...detail.mainIngredientList.map((item) => item.ingredientId),
      ...detail.subIngredientList.map((item) => item.ingredientId)
    ]
    const ingredientMap = await meishijieDb.query(
      'select * from recipe_ingredient_list where id in (?)',
      [allIngredientIdList]
    )
    detail.mainIngredientList = getIngredientNameFromIngredientMap(
      detail.mainIngredientList,
      ingredientMap
    )
    detail.subIngredientList = getIngredientNameFromIngredientMap(
      detail.subIngredientList,
      ingredientMap
    )
    res.json({ code: '200', data: detail })
  } catch (err) {
    next(err)
  }
}
