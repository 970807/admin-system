const adminDb = require('../../db/admin')

exports.getList = async (req, res, next) => {
  try {
    const list = await adminDb.query(
      'SELECT id,role_name,enable,sort,create_time,update_time FROM role_list order by sort'
    )
    res.json({ code: 0, data: list })
  } catch (err) {
    next(err)
  }
}

exports.existRoleName = async (req, res, next) => {
  try {
    const { roleName } = req.query
    if (!roleName) {
      res.json({ code: -1, message: '角色名不能为空' })
      return
    }
    const [{ count }] = await adminDb.query(
      'SELECT count(*) as count FROM role_list WHERE role_name = ?',
      [roleName]
    )
    res.json({
      code: 0,
      data: count > 0
    })
  } catch (err) {
    next(err)
  }
}

exports.addRole = async (req, res, next) => {
  try {
    const { roleName, enable, sort } = req.body
    if (!roleName) {
      res.json({ code: -1, message: '角色名不能为空' })
      return
    }
    if (typeof enable !== 'number') {
      res.json({ code: -1, message: 'enable字段仅能为数字类型' })
      return
    }
    if (typeof sort !== 'number') {
      res.json({ code: -1, message: 'sort字段仅能为数字类型' })
      return
    }
    const d = new Date()
    await adminDb.query('INSERT INTO role_list set ?', {
      roleName,
      enable,
      sort,
      createTime: d,
      updateTime: d
    })
    res.json({
      code: 0,
      data: null,
      message: '添加角色成功'
    })
  } catch (err) {
    if (err.sqlState === '23000') {
      res.json({
        code: -1,
        message: err.message
      })
      return
    }
    next(err)
  }
}

exports.editRole = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!id) {
      res.json({ code: -1, message: '未知的角色id' })
      return
    }
    const { roleName, enable, sort } = req.body
    if (!roleName) {
      res.json({ code: -1, message: '角色名不能为空' })
      return
    }
    if (typeof enable !== 'number') {
      res.json({ code: -1, message: 'enable字段仅能为数字类型' })
      return
    }
    if (typeof sort !== 'number') {
      res.json({ code: -1, message: 'sort字段仅能为数字类型' })
      return
    }
    await adminDb.query(
      'UPDATE role_list set role_name=?,enable=?,sort=?,update_time=? where id=?',
      [roleName, enable, sort, new Date(), id]
    )
    res.json({ code: 0, data: null, message: '编辑角色成功' })
  } catch (err) {
    next(err)
  }
}

exports.changeRoleStatus = async (req, res, next) => {
  try {
    let { id, enable } = req.params
    if (!id) return res.json({ code: -1, message: '未知的角色id' })
    if (!enable) return res.json({ code: -1, message: 'enable字段不能为空' })
    enable = enable === '0' ? 0 : 1
    await adminDb.query(
      'UPDATE role_list set enable=?,update_time=? where id=?',
      [enable, new Date(), id]
    )
    res.json({
      code: 0,
      data: null,
      message: `${enable ? '启用成功' : '禁用成功'}`
    })
  } catch (err) {
    next(err)
  }
}

exports.batchDel = async (req, res, next) => {
  try {
    const idList = req.body.idList
    if (!Array.isArray(idList)) {
      res.json({ code: -1, message: 'idList不能为空' })
      return
    }
    if (idList.length < 1) {
      res.json({ code: 0, data: null, message: '批量删除成功' })
      return
    }
    await adminDb.query('DELETE FROM role_list WHERE id in (?)', [idList])
   // 把角色拥有的权限也删除
    await adminDb.query('DELETE FROM role_auth_list WHERE role_id in (?)', [idList])
    res.json({ code: 0, data: null, message: '批量删除成功' })
  } catch (err) {
    next(err)
  }
}

exports.del = async (req, res, next) => {
  try {
    const id = req.params.id
    if (!id) return res.json({ code: -1, message: 'id不能为空' })
    await adminDb.query('DELETE FROM role_list WHERE id = ?', [id])
    
    // 把角色拥有的权限也删除
    await adminDb.query('DELETE FROM role_auth_list WHERE role_id = ?', [id])
    res.json({ code: 0, data: null, message: '删除成功' })
  } catch (err) {
    next(err)
  }
}

exports.roleAuth = async (req, res, next) => {
  try {
    const roleId = req.params.roleId
    let authIds = req.body.authIds
    if (!roleId) return res.json({ code: -1, message: '未知的角色id' })
    if (!Array.isArray(authIds)) {
      res.json({ code: -1, message: 'authIds不能为空' })
      return
    }

    // 先查一下角色id是否存在
    const [{ count }] = await adminDb.query('SELECT count(*) as count FROM role_list WHERE id=?', [roleId])
    if (count < 1) {
       return res.json({ code: -1, message: '角色不存在' })
    }
   

    // 查询数据库里该角色拥有的权限
    let dbAuthList = await adminDb.query(
      'SELECT id,role_id,auth_id FROM role_auth_list WHERE role_id=?',
      [roleId]
    )

    // 去掉相同的权限
    const newAuthIds = authIds.filter(
      authId => !dbAuthList.find(dbAuth => dbAuth.authId === authId)
    ) // 过滤后的都是需要添加进数据库的权限

    const newDbAuthList = dbAuthList.filter(
      dbAuth => !authIds.includes(dbAuth.authId)
    ) // 过滤后的都是需要从数据库删除的权限

    
    authIds = newAuthIds // 现在存的都是需要添加进数据库的权限
    dbAuthList = newDbAuthList // 现在存的都是需要从数据库删除的权限

    const promiseList = []
    // 循环接口传过来的权限，对比进行修改(增/删)
    authIds.forEach(authId => {
      // authId：需要添加进数据库的权限id
      const d = new Date()
      if (dbAuthList.length) {
        // 如果数据库有需要删除的权限，就直接更新这一条数据就行
        const oneDbAuth = dbAuthList.shift() // 取一条数据
        promiseList.push(
          adminDb.query(
            'UPDATE role_auth_list SET auth_id=?,create_time=?,update_time=? WHERE id=?',
            [authId, d, d, oneDbAuth.id]
          )
        )
      } else {
        // 如果数据库没有需要删除的权限，就增加一条数据
        promiseList.push(
          adminDb.query('INSERT INTO role_auth_list SET ?', {
            roleId,
            authId,
            createTime: d,
            updateTime: d
          })
        )
      }
    })

    if (dbAuthList.length) {
      // 删除还剩的需要删除数据库的权限
      promiseList.push(
        adminDb.query('DELETE FROM role_auth_list WHERE id in (?)', [
          dbAuthList.map(authItem => authItem.id)
        ])
      )
    }

    await Promise.all(promiseList)
    res.json({ code: 0, data: null, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

exports.getAuthIdsByRoleId = async (req, res, next) => {
  try {
    const roleId = req.params.roleId
    if (!roleId) return res.json({ code: -1, message: '未知的角色id' })

    // 先查一下角色id是否存在
    const [{ count }] = await adminDb.query('SELECT count(*) as count FROM role_list WHERE id=?', [roleId])
    if (count < 1) {
       return res.json({ code: -1, message: '角色不存在' })
    }
    
    const list = await adminDb.query(
      'SELECT auth_id FROM role_auth_list WHERE role_id=?',
      [roleId]
    )
    res.json({ code: 0, data: list.map(item => item.authId) })
  } catch (err) {
    next(err)
  }
}
