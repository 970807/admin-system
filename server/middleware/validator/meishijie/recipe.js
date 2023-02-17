const meishijieDb = require('../../../db/meishijie')

const validateStepList = list => {
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

const validateFinishFoodImgUrlList = list => {
  if (!Array.isArray(list)) {
    return 'finishFoodImgUrlList字段缺失或错误'
  }
  if (list.length < 1) {
    return '应至少有1个成品图'
  }
}

const validateAuthorId = async authorId => {
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

exports.getRecipeList = (req, res, next) => {
  const { pageNo, pageSize } = req.query
  if (!pageNo) {
    return res.json({ code: -1, message: 'page字段为必须' })
  }
  if (!pageSize) {
    return res.json({ code: -1, message: 'pageSize字段为必须' })
  }
  next()
}

async function addOrEditRecipeValidator(req, res, next, isEdit) {
  try {
    const {
      id,
      recipeName,
      isVideo,
      coverUrl,
      videoUrl,
      recipeQrcode,
      simpleIntroductionTechnology,
      simpleIntroductionTaste,
      simpleIntroductionTime,
      simpleIntroductionDifficulty,
      mainIngredientsStr,
      subIngredientsStr,
      peopleCount,
      favCount,
      browerCount,
      stepList,
      finishFoodImgUrlList,
      recipeTips,
      authorId
    } = req.body
    if (isEdit && !id) {
      return res.json({ code: -1, message: 'id字段为必须' })
    }
    if (!recipeName) {
      return res.json({ code: -1, message: '菜谱名称不能为空' })
    }
    if (!recipeQrcode) {
      return res.json({ code: -1, message: '菜谱二维码链接不能为空' })
    }
    if (typeof isVideo !== 'number') {
      return res.json({ code: -1, message: '缺少isVideo字段' })
    }
    if (!isVideo && !coverUrl) {
      return res.json({ code: -1, message: '封面图链接不能为空' })
    }
    if (isVideo && !videoUrl) {
      return res.json({ code: -1, message: '视频链接不能为空' })
    }
    if (!simpleIntroductionTechnology) {
      return res.json({ code: -1, message: '工艺字段不能为空' })
    }
    if (!simpleIntroductionTaste) {
      return res.json({ code: -1, message: '口味字段不能为空' })
    }
    if (!simpleIntroductionTime) {
      return res.json({ code: -1, message: '时间字段不能为空' })
    }
    if (!simpleIntroductionDifficulty) {
      return res.json({ code: -1, message: '难度字段不能为空' })
    }
    if (!mainIngredientsStr) {
      return res.json({ code: -1, message: '主料字段不能为空' })
    }
    if (!subIngredientsStr) {
      return res.json({ code: -1, message: '辅料字段不能为空' })
    }
    if (typeof peopleCount !== 'number' || peopleCount < 1) {
      return res.json({ code: -1, message: '份数字段缺失或错误' })
    }
    if (typeof favCount !== 'number' || favCount < 0) {
      return res.json({ code: -1, message: '收藏数字段缺失或错误' })
    }
    if (typeof browerCount !== 'number' || browerCount < 0) {
      return res.json({ code: -1, message: '浏览数字段缺失或错误' })
    }
    const resMsg3 = validateStepList(stepList)
    if (resMsg3) {
      return res.json({ code: -1, message: resMsg3 })
    }
    const regMsg4 = validateFinishFoodImgUrlList(finishFoodImgUrlList)
    if (regMsg4) {
      return res.json({ code: -1, message: regMsg4 })
    }
    if (!recipeTips) {
      return res.json({ code: -1, message: '烹饪技巧不能为空' })
    }
    const regMsg5 = await validateAuthorId(authorId)
    if (regMsg5) {
      return res.json({ code: -1, message: regMsg5 })
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.addRecipe = (req, res, next) => {
  addOrEditRecipeValidator(req, res, next, false)
}

exports.editRecipe = (req, res, next) => {
  addOrEditRecipeValidator(req, res, next, true)
}

exports.batchDeleteRecipe = (req, res, next) => {
  const { idList } = req.body
  if (!idList || idList.length < 1) {
    return res.json({ code: -1, message: 'idList数组至少有1个元素' })
  }
  next()
}

exports.getRecipeDetailById = (req, res, next) => {
  const { id } = req.query
  if (!id) {
    return res.json({ code: -1, message: 'id字段为必须' })
  }
  next()
}

exports.importFromHtmlStr = (req, res, next) => {
  const { htmlStr } = req.body
  if (!htmlStr) {
    return res.json({ code: -1, message: 'htmlStr字段为必须' })
  }
  next()
}
