const adminDb = require('../../db/admin')
const authData = require('../../data/system/auth')

// 权限类型
const AUTH_TYPE_EM = {
  MENU: { name: '菜单', value: 0 },
  BUTTON: { name: '按钮', value: 1 }
}

exports.getList = async (req, res, next) => {
  try {
    const resList = await adminDb.query(
      `SELECT
        id,parent_id,name,auth_marker,menu_path,menu_icon,redirect,cpn_path,auth_type,system_auth,sort_no,remark,create_time,update_time
      FROM
        auth_list
      ORDER BY sort_no`
    )
    res.json({ code: 0, data: [...authData.SYSTEM_AUTH_LIST, ...resList] })
  } catch (err) {
    next(err)
  }
}

exports.addOrEditAuth = async (req, res, next) => {
  try {
    const {
      id,
      parentId,
      name,
      authMarker,
      menuPath,
      menuIcon,
      redirect,
      cpnPath,
      authType,
      sortNo,
      remark
    } = req.body
    // 必填项校验
    if (!name) return res.json({ code: -1, message: '名称不能为空' })
    if (!authMarker) return res.json({ code: -1, message: '权限标识不能为空' })
    if (typeof authType !== 'number')
      return res.json({ code: -1, message: '权限类型不能为空' })
    if (typeof sortNo !== 'number')
      return res.json({ code: -1, message: '排序值不能为空' })
    const d = new Date()
    if (typeof id === 'number') {
      // 编辑权限

      // 查询旧的数据
      const r1 = (
        await adminDb.query(
          'SELECT id,auth_type,system_auth FROM auth_list WHERE id=?',
          [id]
        )
      )?.[0]
      // 查询不到旧数据
      if (!r1)
        return res.json({ code: 1, message: `编辑权限失败，id：${id}不存在` })

      // 不能编辑系统权限
      if (!!r1.systemAuth)
        return res.json({ code: -1, message: '不能编辑系统权限' })

      // 更新数据库
      await adminDb.query(
        `UPDATE auth_list SET 
        parent_id=?,name=?,auth_marker=?,menu_path=?,menu_icon=?,
        redirect=?,cpn_path=?,auth_type=?,sort_no=?,remark=?,update_time=?
          WHERE id=?
        `,
        [
          parentId,
          name,
          authMarker,
          menuPath,
          menuIcon,
          redirect,
          cpnPath,
          authType,
          sortNo,
          remark,
          new Date(),
          id
        ]
      )

      if (
        authType === AUTH_TYPE_EM.BUTTON.value &&
        r1.authType === AUTH_TYPE_EM.MENU.value
      ) {
        // 如果权限类型从'菜单'修改成了'按钮'，自动删除子权限
        await adminDb.query('DELETE FROM auth_list WHERE parent_id=?', [id])
      }

      res.json({ code: 0, data: null, message: '编辑权限成功' })
    } else {
      // 新增权限

      if (typeof parentId === 'number') {
        // 添加子权限
        // 查询旧的数据
        const r1 = (
          await adminDb.query(
            'SELECT id,system_auth FROM auth_list WHERE id=?',
            [parentId]
          )
        )?.[0]
        // 查询不到旧数据
        if (!r1)
          return res.json({
            code: 1,
            message: `添加子权限失败，parentId：${parentId}不存在`
          })
        if (!!r1.systemAuth)
          return res.json({ code: -1, message: '不能在系统权限下添加子权限' })
      }

      await adminDb.query('INSERT INTO auth_list SET ?', {
        parentId,
        name,
        authMarker,
        menuPath,
        menuIcon,
        redirect,
        cpnPath,
        authType,
        sortNo,
        remark,
        systemAuth: 0,
        createTime: d,
        updateTime: d
      })
      res.json({ code: 0, data: null, message: '添加权限成功' })
    }
  } catch (err) {
    next(err)
  }
}

exports.del = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // 要删除的节点和其后代节点
    const needDelIds = await deleteAllNeedDelIds([id])

    res.json({ code: 0, data: { deletedIds: needDelIds }, message: '删除成功' })
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

    // 要删除的节点和其后代节点
    const needDelIds = await deleteAllNeedDelIds(idList)

    res.json({
      code: 0,
      data: { deletedIds: needDelIds },
      message: '批量删除成功'
    })
  } catch (err) {
    next(err)
  }
}

// 删除节点和其后代节点
async function deleteAllNeedDelIds(initIds) {
  // 要删除的节点和其后代节点
  let needDelIds = [...initIds]

  if (needDelIds.length < 1) return needDelIds

  // 过滤掉系统权限
  const r1 = await adminDb.query(
    'SELECT id FROM auth_list WHERE system_auth!=1 and id in (?)',
    [needDelIds]
  )
  needDelIds = r1.map(item => item.id)
  if (needDelIds.length < 1) return needDelIds

  // 下次循环要查询的ids
  let nextQueryIds = [...initIds]

  while (nextQueryIds.length) {
    // 先查出所有要删除的节点id(过滤掉系统权限)
    const r1 = await adminDb.query(
      'SELECT id FROM auth_list WHERE system_auth!=1 and parent_id in (?)',
      [nextQueryIds]
    )
    nextQueryIds = r1.map(item => item.id)
    // 要删除的节点(去重)
    needDelIds = [...new Set(needDelIds.concat(nextQueryIds))]
  }

  // 删除
  await adminDb.query('DELETE FROM auth_list WHERE id in (?)', [needDelIds])
  return needDelIds
}
