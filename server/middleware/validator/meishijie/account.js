const meishijieDb = require('../../../db/meishijie')

async function validateAddAccount({ account, phone, nickname }) {
  const promiseList = []

  // 判断账号是否重复
  if (account) {
    promiseList.push(
      meishijieDb.query(
        'select count(*) as account_count from user_list where account=?',
        account
      )
    )
  }

  // 判断手机号是否重复
  if (phone) {
    promiseList.push(
      meishijieDb.query(
        'select count(*) as phone_count from user_list where phone=?',
        phone
      )
    )
  }

  // 判断昵称是否重复
  if (nickname) {
    promiseList.push(
      meishijieDb.query(
        'select count(*) as nickname_count from user_list where nickname=?',
        nickname
      )
    )
  }

  const r = await Promise.all(promiseList)

  for (const item of r) {
    const info = item[0]
    if ('accountCount' in info) {
      if (info.accountCount > 0) {
        return '该账号已存在，请更改账号名称'
      }
    }
    if ('phoneCount' in info) {
      if (info.phoneCount > 0) {
        return '该手机号已存在'
      }
    }
    if ('nicknameCount' in info) {
      if (info.nicknameCount > 0) {
        return '该昵称已存在'
      }
    }
  }
}

exports.addAccount = async (req, res, next) => {
  const { account, phone, password, nickname } = req.body
  if (!account && !phone) {
    return res.json({ code: '-1', message: '账号和手机号必须填写一个' })
  }
  if (!password) {
    return res.json({ code: '-1', message: '密码不能为空' })
  }

  try {
    const message = await validateAddAccount({ account, phone, nickname })
    if (message) {
      return res.json({ code: '-1', message })
    }
    next()
  } catch (err) {
    next(err)
  }
}

async function validateEditAccount({ id, account, phone, nickname }) {
  const promiseList = []

  // 判断是否有该id
  promiseList.push(
    meishijieDb.query(
      'select count(*) as id_count from user_list where id=?',
      id
    )
  )

  // 判断账号是否重复
  if (account) {
    promiseList.push(
      meishijieDb.query(
        'select count(*) as account_count from user_list where id<>? and account=?',
        [id, account]
      )
    )
  }

  // 判断手机号是否重复
  if (phone) {
    promiseList.push(
      meishijieDb.query(
        'select count(*) as phone_count from user_list where id<>? and phone=?',
        [id, phone]
      )
    )
  }

  // 判断昵称是否重复
  if (nickname) {
    promiseList.push(
      meishijieDb.query(
        'select count(*) as nickname_count from user_list where id<>? and nickname=?',
        [id, nickname]
      )
    )
  }

  const r = await Promise.all(promiseList)
  console.log(r)

  for (const item of r) {
    const info = item[0]
    if ('idCount' in info) {
      if (info.idCount < 1) {
        return '该账号id不能匹配任何账号'
      }
    }
    if ('accountCount' in info) {
      if (info.accountCount > 0) {
        return '该账号已存在，请更改账号名称'
      }
    }
    if ('phoneCount' in info) {
      if (info.phoneCount > 0) {
        return '该手机号已存在'
      }
    }
    if ('nicknameCount' in info) {
      if (info.nicknameCount > 0) {
        return '该昵称已存在'
      }
    }
  }
}

exports.editAccount = async (req, res, next) => {
  const { id, account, phone, nickname } = req.body
  if (!id) {
    return res.json({ code: '-1', message: 'id不能为空' })
  }
  if (!account && !phone) {
    return res.json({ code: '-1', message: '账号和手机号必须填写一个' })
  }

  try {
    const message = await validateEditAccount({ id, account, phone, nickname })
    if (message) {
      return res.json({ code: '-1', message })
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.editAccountPassword = async (req, res, next) => {
  const { id, password } = req.body
  if (!id) {
    return res.json({ code: '-1', message: 'id不能为空' })
  }
  if (!password) {
    return res.json({ code: '-1', message: '密码不能为空' })
  }
  next()
}
