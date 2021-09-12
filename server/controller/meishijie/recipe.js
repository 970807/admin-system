const { v4: uuidv4 } = require('uuid')
const meishijieDb = require('../../db/meishijie')

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
    const r = await meishijieDb.query('insert into recipe_detail_list set ?', {
      id: uuidv4(),
      recipeName,
      isVideo,
      coverUrl,
      videoUrl,
      simpleIntroductionTechnology,
      simpleIntroductionTaste,
      simpleIntroductionTime,
      simpleIntroductionDifficulty,
      mainIngredientIdsStr: formatIngredientListToStr(mainIngredientList),
      subIngredientIdsStr: formatIngredientListToStr(subIngredientList),
      peopleCount,
      favCount,
      browerCount,
      authorWords,
      finishFoodImgsStr: formatFinishFoodImgUrlListToStr(finishFoodImgUrlList),
      recipeTips,
      authorId,
      originWebLink,
      createTime: d,
      updateTime: d
    })
    console.log(r)
    res.json({ msg: '测试' })
  } catch (err) {
    next(err)
  }
}
