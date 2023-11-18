const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const adminDb = require('../../db/admin')

// 系统权限文件路径
const SYSTEM_AUTH_FILE_PATH = path.join(
  __dirname,
  '../../data/system/systemAuthList.json'
)

// 权限类型
const AUTH_TYPE_EM = {
  MENU: { name: '菜单', value: 0 },
  BUTTON: { name: '按钮', value: 1 }
}

exports.getList = async (req, res, next) => {
  try {
    // 查询非系统权限
    const resList = await adminDb.query(
      `SELECT
        id,parent_id,name,auth_marker,menu_name,menu_path,menu_icon,redirect,cpn_path,auth_type,sort_no,remark,enable,create_time,update_time
      FROM
        auth_list
      ORDER BY sort_no`
    )

    // 添加非系统权限标识
    resList.forEach(item => (item.systemAuth = 0))

    // 查询系统权限
    fs.readFile(SYSTEM_AUTH_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        // 读取文件出错，直接返回非系统权限
        res.json({ code: 0, data: resList })
        return
      }
      // 系统权限
      const systemAuthList = JSON.parse(data)
      // 添加系统权限标识
      systemAuthList.forEach(item => (item.systemAuth = 1))

      // 返回系统权限+非系统权限
      res.json({
        code: 0,
        data: [...systemAuthList, ...resList].sort(
          (a, b) => a.sortNo - b.sortNo
        )
      })
    })
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
      menuName,
      menuPath,
      menuIcon,
      redirect,
      cpnPath,
      authType,
      sortNo,
      remark,
      enable
    } = req.body
    // 必填项校验
    if (!name) return res.json({ code: -1, message: '名称不能为空' })
    if (!authMarker) return res.json({ code: -1, message: '权限标识不能为空' })
    if (typeof authType !== 'number')
      return res.json({ code: -1, message: '权限类型不能为空' })
    if (typeof sortNo !== 'number')
      return res.json({ code: -1, message: '排序值不能为空' })
    if (authType === 0 && !menuPath)
      return res.json({ code: -1, message: '菜单路径不能为空' })
    if (parentId && authType === 0 && !cpnPath)
      return res.json({ code: -1, message: '组件路径不能为空' })
    if (enable !== 0 && enable !== 1)
      return res.json({ code: -1, message: '是否启用仅能为0或1' })

    const d = new Date()
    if (id) {
      // 编辑权限

      // 查询旧的数据
      const r1 = (
        await adminDb.query('SELECT id,auth_type FROM auth_list WHERE id=?', [
          id
        ])
      )?.[0]
      // 查询不到旧数据
      if (!r1)
        return res.json({ code: 1, message: `编辑权限失败，id：${id}不存在` })

      // 更新数据库
      await adminDb.query(
        `UPDATE auth_list SET 
        parent_id=?,name=?,auth_marker=?,menu_name=?,menu_path=?,menu_icon=?,
        redirect=?,cpn_path=?,auth_type=?,sort_no=?,remark=?,enable=?,update_time=?
          WHERE id=?
        `,
        [
          parentId,
          name,
          authMarker,
          menuName,
          menuPath,
          menuIcon,
          redirect,
          cpnPath,
          authType,
          sortNo,
          remark,
          enable,
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

      if (parentId) {
        // 添加子权限
        // 查询旧的数据
        const r1 = (
          await adminDb.query('SELECT id FROM auth_list WHERE id=?', [parentId])
        )?.[0]
        // 查询不到旧数据
        if (!r1)
          return res.json({
            code: 1,
            message: `添加子权限失败，parentId：${parentId}不存在`
          })
      }

      await adminDb.query('INSERT INTO auth_list SET ?', {
        id: uuidv4(),
        parentId,
        name,
        authMarker,
        menuName,
        menuPath,
        menuIcon,
        redirect,
        cpnPath,
        authType,
        sortNo,
        remark,
        enable,
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
    const id = req.params.id

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

  // 下次循环要查询的ids
  let nextQueryIds = [...initIds]

  while (nextQueryIds.length) {
    // 先查出所有要删除的节点id
    const r1 = await adminDb.query(
      'SELECT id FROM auth_list WHERE parent_id in (?)',
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

exports.updateSortNo = async (req, res, next) => {
  try {
    const id = req.params.id
    const sortNo = Number(req.params.sortNo)
    if (isNaN(sortNo))
      return res.json({ code: -1, message: '请输入正确的排序值' })

    // 查询是否是系统权限
    const systemAuthList = JSON.parse(
      fs.readFileSync(SYSTEM_AUTH_FILE_PATH, 'utf8')
    )
    const findRes = systemAuthList.find(item => item.id === id)
    if (findRes) {
      // 查到了对应的系统权限
      findRes.sortNo = sortNo
      // 保存回去
      fs.writeFileSync(
        SYSTEM_AUTH_FILE_PATH,
        JSON.stringify(systemAuthList, null, 2),
        'utf8'
      )
      res.json({ code: 0, data: { id, sortNo }, message: '操作成功' })
      return
    }

    // 找不到系统权限，继续寻找是否是非系统权限

    // 非系统权限
    await adminDb.query('UPDATE auth_list SET sort_no=? WHERE id=?', [
      sortNo,
      id
    ])
    res.json({ code: 0, data: { id, sortNo }, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}

// 启用&禁用
exports.changeStatus = async (req, res, next) => {
  try {
    const id = req.params.id
    const enable = Number(req.params.isEnable)
    if (!id) return res.json({ code: -1, message: 'id不能为空' })

    // 查询是否是系统权限
    const systemAuthList = JSON.parse(
      fs.readFileSync(SYSTEM_AUTH_FILE_PATH, 'utf8')
    )
    const findRes = systemAuthList.find(item => item.id === id)
    if (findRes) {
      // 查到了对应的系统权限
      res.json({ code: -1, message: '系统权限禁止修改' })
      return
    }

    // 非系统权限
    await adminDb.query('UPDATE auth_list SET enable=? WHERE id=?', [
      enable,
      id
    ])
    res.json({ code: 0, data: { id, enable }, message: '操作成功' })
  } catch (err) {
    next(err)
  }
}
