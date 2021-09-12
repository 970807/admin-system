const meishijieDb = require('../../../db/meishijie')

const isNoHasThisFieldInArr = (field, arr) => {
  for (const item of arr) {
    if (typeof item !== 'object') {
      return true
    }
    if (field in item) {
      continue
    }
    return true
  }
  return false
}

const isHasRepeatFieldInArr = (field, arr) => {
  const noRepeatArr = []
  for (const item of arr) {
    if (!noRepeatArr.find((item2) => item2[field] === item[field])) {
      noRepeatArr.push(item)
    }
  }
  return noRepeatArr.length !== arr.length
}

const validateIngredientList = (ingredientName, ingredientList) => {
  if (!Array.isArray(ingredientList)) {
    return `${ingredientName}字段缺失或错误`
  }
  if (ingredientList.length < 1) {
    return `${ingredientName}应至少为1个`
  }
  if (isNoHasThisFieldInArr('ingredientId', ingredientList)) {
    return `${ingredientName}ingredientId字段为必须`
  }
  if (isNoHasThisFieldInArr('ingredientDose', ingredientList)) {
    return `${ingredientName}ingredientDose字段为必须`
  }
  if (isHasRepeatFieldInArr('ingredientId', ingredientList)) {
    return `${ingredientName}重复`
  }
}

const validateStepList = (list) => {
  if (!Array.isArray(list)) {
    return 'stepList字段缺失或错误'
  }
  if (list.length < 1) {
    return '应至少有1个做法步骤'
  }
  for (const item of list) {
    if (!('imgUrl' in item || 'content' in item)) {
      return '做法步骤的图片链接和内容至少需有1个'
    }
  }
}

const validateFinishFoodImgUrlList = (list) => {
  if (!Array.isArray(list)) {
    return 'finishFoodImgUrlList字段缺失或错误'
  }
  if (list.length < 1) {
    return '应至少有1个成品图'
  }
}

const validateAuthorId = async (authorId) => {
  if (typeof authorId !== 'number') {
    return 'authorId缺失或错误'
  }
  const [{ count }] = await meishijieDb.query(
    'select count(*) as count from user_list where id=?',
    authorId
  )
  if (count < 1) {
    return '菜谱作者不存在'
  }
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
      authorId
    } = req.body
    if (!recipeName) {
      return res.json({ code: '-1', message: '菜谱名称不能为空' })
    }
    if (typeof isVideo !== 'number') {
      return res.json({ code: '-1', message: '缺少isVideo字段' })
    }
    if (!isVideo && !coverUrl) {
      return res.json({ code: '-1', message: '封面图链接不能为空' })
    }
    if (isVideo && !videoUrl) {
      return res.json({ code: '-1', message: '视频链接不能为空' })
    }
    if (!simpleIntroductionTechnology) {
      return res.json({ code: '-1', message: '工艺字段不能为空' })
    }
    if (!simpleIntroductionTaste) {
      return res.json({ code: '-1', message: '口味字段不能为空' })
    }
    if (!simpleIntroductionTime) {
      return res.json({ code: '-1', message: '时间字段不能为空' })
    }
    if (!simpleIntroductionDifficulty) {
      return res.json({ code: '-1', message: '难度字段不能为空' })
    }
    const resMsg1 = validateIngredientList('主料', mainIngredientList)
    if (resMsg1) {
      return res.json({ code: '-1', message: resMsg1 })
    }
    const resMsg2 = validateIngredientList('辅料', subIngredientList)
    if (resMsg2) {
      return res.json({ code: '-1', message: resMsg2 })
    }
    if (typeof peopleCount !== 'number' || peopleCount < 1) {
      return res.json({ code: '-1', message: '份数字段缺失或错误' })
    }
    if (typeof favCount !== 'number' || favCount < 0) {
      return res.json({ code: '-1', message: '收藏数字段缺失或错误' })
    }
    if (typeof browerCount !== 'number' || browerCount < 0) {
      return res.json({ code: '-1', message: '浏览数字段缺失或错误' })
    }
    if (!authorWords) {
      return res.json({ code: '-1', message: '作者推荐语不能为空' })
    }
    const resMsg3 = validateStepList(stepList)
    if (resMsg3) {
      return res.json({ code: '-1', message: resMsg3 })
    }
    const regMsg4 = validateFinishFoodImgUrlList(finishFoodImgUrlList)
    if (regMsg4) {
      return res.json({ code: '-1', message: regMsg4 })
    }
    if (!recipeTips) {
      return res.json({ code: '-1', message: '烹饪技巧不能为空' })
    }
    const regMsg5 = await validateAuthorId(authorId)
    if (regMsg5) {
      return res.json({ code: '-1', message: regMsg5 })
    }
    next()
  } catch (err) {
    next(err)
  }
}
