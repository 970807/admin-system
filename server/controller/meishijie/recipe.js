const { v4: uuidv4 } = require('uuid')
const cheerio = require('cheerio')
const meishijieDb = require('../../db/meishijie')
const getList = require('../../utils/getList')

/*
  把成品图列表格式化成特定字符串： 图片链接;图片链接;图片链接;
*/
const formatFinishFoodImgUrlListToStr = list => {
  let resStr = ''
  for (const item of list) {
    resStr += `${item};`
  }
  return resStr
}

const formatFinishFoodImgUrlStrToList = str => {
  return str.slice(0, -1).split(';')
}

/*
  把步骤列表格式化成特定字符串：  步骤图片,步骤内容;步骤图片,步骤内容;步骤图片,步骤内容;
*/
const formatStepListToStr = list => {
  let resStr = ''
  for (const { imgUrl = '', content = '' } of list) {
    resStr += `${imgUrl},${content};`
  }
  return resStr
}

const formatStepStrToList = str => {
  return str
    .slice(0, -1)
    .split(';')
    .map(item => {
      const [imgUrl, content] = item.split(',')
      return { imgUrl, content }
    })
}

exports.getRecipeList = (req, res, next) => {
  getList({
    req,
    db: meishijieDb,
    dbTable: 'recipe_list',
    orderProp: 'update_time',
    searchFieldArr: [{ reqField: 'isVideo', dbField: 'is_video' }],
    likeSearchFieldArr: [{ reqField: 'recipeName', dbField: 'recipe_name' }],
    onSuccess: async function (data) {
      try {
        if (data.list?.length) {
          const promiseArr = []
          data.list.forEach(item => {
            if (!item.authorId) {
              item.authorName = ''
              return
            }
            // 根据authorId查询菜谱作者(authorName)
            const promise = meishijieDb.query(
              'select nickname from user_list where id=? limit 1',
              item.authorId
            )
            promise.then(res => {
              item.authorName = res?.[0]?.nickname ?? ''
            })
            promise.catch(() => {
              item.authorName = null
            })
            promiseArr.push(promise)
          })
          await Promise.all(promiseArr)
        }
        res.json({ code: 0, data })
      } catch (err) {
        next(err)
      }
    },
    onError: function (err) {
      next(err)
    }
  })
}

exports.addRecipe = async (req, res, next) => {
  try {
    const {
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
      authorWords,
      stepList,
      finishFoodImgUrlList,
      recipeTips,
      authorId,
      originWebLink,
      publish = 0
    } = req.body
    const d = new Date()
    const id = uuidv4()
    const r = await meishijieDb.query('insert into recipe_list set ?', {
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
      authorWords,
      finishFoodImgsStr: formatFinishFoodImgUrlListToStr(finishFoodImgUrlList),
      stepsStr: formatStepListToStr(stepList),
      recipeTips,
      authorId,
      originWebLink,
      publish,
      createTime: d,
      updateTime: d
    })
    if (r.affectedRows < 1) {
      res.json({ code: -1, message: '添加菜谱失败' })
      return
    }
    res.json({ code: 0, message: '添加菜谱成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.editRecipe = async (req, res, next) => {
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
      authorWords,
      stepList,
      finishFoodImgUrlList,
      recipeTips,
      authorId,
      originWebLink,
      publish = 0
    } = req.body
    const r = await meishijieDb.query(
      'update recipe_list set recipe_name=?,is_video=?,cover_url=?,video_url=?,recipe_qrcode=?,simple_introduction_technology=?,simple_introduction_taste=?,simple_introduction_time=?,simple_introduction_difficulty=?,main_ingredients_str=?,sub_ingredients_str=?,people_count=?,fav_count=?,brower_count=?,author_words=?,finish_food_imgs_str=?,steps_str=?,recipe_tips=?,author_id=?,origin_web_link=?,publish=?,update_time=? where id=?',
      [
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
        authorWords,
        formatFinishFoodImgUrlListToStr(finishFoodImgUrlList),
        formatStepListToStr(stepList),
        recipeTips,
        authorId,
        originWebLink,
        publish,
        new Date(),
        id
      ]
    )
    if (r.changedRows < 1) {
      res.json({ code: -1, message: '修改菜谱失败' })
      return
    }
    res.json({ code: 0, message: '修改菜谱成功', data: { id } })
  } catch (err) {
    next(err)
  }
}

exports.batchDeleteRecipe = async (req, res, next) => {
  try {
    const { idList } = req.body
    const { affectedRows } = await meishijieDb.query(
      'delete from recipe_list where id in ?',
      [[idList]]
    )
    if (affectedRows < 1) {
      return res.json({ code: -1, message: '批量删除菜谱失败' })
    }
    res.json({ code: 0, message: '批量删除菜谱成功' })
  } catch (err) {
    next(err)
  }
}

exports.getRecipeDetailById = async (req, res, next) => {
  try {
    const { id } = req.query
    const [detail] = await meishijieDb.query(
      'select * from recipe_list where id=? limit 1',
      id
    )
    if (!detail) {
      res.json({ code: -1, message: '获取详情失败' })
      return
    }
    // 根据authorId查询菜谱作者
    if (detail.authorId) {
      await meishijieDb
        .query(
          'select nickname from user_list where id=? limit 1',
          detail.authorId
        )
        .then(res => {
          detail.authorName = res?.[0]?.nickname ?? ''
        })
        .catch(() => {
          detail.authorName = null
        })
    } else {
      detail.authorName = ''
    }
    detail.stepList = formatStepStrToList(detail.stepsStr)
    delete detail.stepsStr
    detail.finishFoodImgUrlList = formatFinishFoodImgUrlStrToList(
      detail.finishFoodImgsStr
    )
    delete detail.finishFoodImgsStr
    delete detail.createTime
    delete detail.updateTime
    res.json({ code: 0, data: detail })
  } catch (err) {
    next(err)
  }
}

exports.importFromHtmlStr = async (req, res, next) => {
  try {
    const { htmlStr } = req.body
    const $ = cheerio.load(htmlStr)
    const recipeName = $('.recipe_header_info .recipe_title').text()
    const isVideo = $('.recipe_header_c .recipe_topvideow').length > 0
    let coverUrl
    let videoUrl
    if (isVideo) {
      coverUrl = $(
        '.recipe_header_c .recipe_topvideow .recipe_topvideo_bg'
      ).attr('src')
      videoUrl = $('.recipe_header_c .recipe_topvideow .recipe_topvideo').attr(
        'src'
      )
    }
    const simpleIntroductionTechnology = $(
      '.recipe_header_info .info2 .info2_item1 strong'
    ).text()
    const simpleIntroductionTaste = $(
      '.recipe_header_info .info2 .info2_item2 strong'
    ).text()
    const simpleIntroductionTime = $(
      '.recipe_header_info .info2 .info2_item3 strong'
    ).text()
    const simpleIntroductionDifficulty = $(
      '.recipe_header_info .info2 .info2_item4 strong'
    ).text()
    const recipeQrcode = $('.recipe_qrcodebox .qrcode img').attr('src')
    let mainIngredientsStr = ''
    $('.recipe_ingredients:first-child .right strong').each((index, item) => {
      const ingredientName = $(item).find('a').text()
      const ingredientDose = $(item).text().slice(ingredientName.length)
      mainIngredientsStr += `${ingredientName}:${ingredientDose};`
    })
    let subIngredientsStr = ''
    $('.recipe_ingredients1 .right strong').each((index, item) => {
      const ingredientName = $(item).find('a').text()
      const ingredientDose = $(item).text().slice(ingredientName.length)
      subIngredientsStr += `${ingredientName}:${ingredientDose};`
    })
    const peopleCount = Number($('.rf').text().slice(0, -2))
    const favRegResult = $('.recipe_header_info .info1')
      .text()
      .match(/\·\s+(\d+)\s+收藏/)
    const favCount = favRegResult && Number(favRegResult[1])
    const browserRegResult = $('.recipe_header_info .info1')
      .text()
      .match(/\·\s+(\d+)\s+浏览/)
    const browerCount = browserRegResult && Number(browserRegResult[1])
    const authorName = $('.recipe_header_info .info1 a').text()
    const authorRegResult = $('.recipe_author .avatarw')
      .css('background')
      .match(/url\((.+)\)/)
    const authorAvatar = authorRegResult && authorRegResult[1]
    const authorWords = $('.author_words p').text()
    let stepsStr = ''
    $('.recipe_step_box .recipe_step .step_content').each((index, item) => {
      const imgUrl = $(item).find('img.stepimg').attr('src')
      const content = $(item).find('p').text()
      stepsStr += `${imgUrl},${content};`
    })
    let finishFoodImgsStr = ''
    $('.recipe_finish_box img').each((index, item) => {
      finishFoodImgsStr += $(item).attr('src')
      finishFoodImgsStr += ';'
    })
    const recipeTips = $('.recipe_tips .recipe_tips_words p').text()

    const d = new Date()
    // 根据作者名查找该作者是否存在，不存在则创建作者
    const [r] = await meishijieDb.query(
      'select id from user_list where nickname=?',
      authorName
    )
    let authorId
    if (r) {
      // 作者已存在
      authorId = r.id
    } else {
      // 不存在，创建该作者
      const randomStr = uuidv4()
      const { insertId } = await meishijieDb.query(
        'insert into user_list set ?',
        {
          account: randomStr,
          password: randomStr,
          nickname: authorName,
          avatar: authorAvatar,
          createTime: d,
          updateTime: d
        }
      )
      authorId = insertId
    }

    // 创建菜谱
    const { insertId: recipeId } = await meishijieDb.query(
      'insert into recipe_list set ?',
      {
        id: uuidv4(),
        isVideo,
        coverUrl,
        videoUrl,
        recipeName,
        favCount,
        browerCount,
        simpleIntroductionTechnology,
        simpleIntroductionTaste,
        simpleIntroductionTime,
        simpleIntroductionDifficulty,
        recipeQrcode,
        mainIngredientsStr,
        subIngredientsStr,
        peopleCount,
        authorId,
        authorWords,
        finishFoodImgsStr,
        stepsStr,
        recipeTips,
        createTime: d,
        updateTime: d
      }
    )
    res.send({
      code: 0,
      message: '创建菜谱成功',
      data: { recipeId, recipeName }
    })
  } catch (err) {
    next(err)
    return
  }
}

exports.publish = async (req, res, next) => {
  try {
    const { publish, idList } = req.body

    if (Array.isArray(idList) && idList.length) {
      const { affectedRows } = await meishijieDb.query(
        'update recipe_list set publish=?, update_time=? where id in (?)',
        [publish, new Date(), idList]
      )
      if (affectedRows < 1) {
        return res.json({ code: -1, message: '操作失败' })
      }
    }
    res.json({ code: 0, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}
