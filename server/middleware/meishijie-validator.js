const meishijieDb = require('../db/meishijie')

async function validateAddAccount({ account, phone }) {
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

  const r = await Promise.all(promiseList)

  for (const item of r) {
    const info = item[0]
    if ('account_count' in info) {
      if (info.account_count > 0) {
        return '该账号已存在，请更改账号名称'
      }
    }
    if ('phone_count' in info) {
      if (info.phone_count > 0) {
        return '该手机号已存在'
      }
    }
  }
}

exports.addAccountValidator = async (req, res, next) => {
  const { account, phone, password } = req.body
  if (!account && !phone) {
    return res.send({ code: '-1', message: '账号和手机号必须填写一个' })
  }
  if (!password) {
    return res.send({ code: '-1', message: '密码不能为空' })
  }

  try {
    const message = await validateAddAccount({ account, phone })
    if (message) {
      return res.send({ code: '-1', message })
    }
    next()
  } catch (err) {
    next(err)
  }
}

async function validateEditAccount({ id, account, phone }) {
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

  const r = await Promise.all(promiseList)

  for (const item of r) {
    const info = item[0]
    if ('id_count' in info) {
      if (info.id_count < 1) {
        return '该账号id不能匹配任何账号'
      }
    }
    if ('account_count' in info) {
      if (info.account_count > 0) {
        return '该账号已存在，请更改账号名称'
      }
    }
    if ('phone_count' in info) {
      if (info.phone_count > 0) {
        return '该手机号已存在'
      }
    }
  }
}

exports.editAccountValidator = async (req, res, next) => {
  const { id, account, phone } = req.body
  if (!id) {
    return res.send({ code: '-1', message: 'id不能为空' })
  }
  if (!account && !phone) {
    return res.send({ code: '-1', message: '账号和手机号必须填写一个' })
  }

  try {
    const message = await validateEditAccount({ id, account, phone })
    if (message) {
      return res.send({ code: '-1', message })
    }
    next()
  } catch (err) {
    next(err)
  }
}

exports.editAccountPasswordValidator = async (req, res, next) => {
  const { id, password } = req.body
  if (!id) {
    return res.send({ code: '-1', message: 'id不能为空' })
  }
  if (!password) {
    return res.send({ code: '-1', message: '密码不能为空' })
  }
  next()
}
