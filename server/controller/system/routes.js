const fs = require('fs')
const path = require('path')
const adminDb = require('../../db/admin')

// 系统权限文件路径
const SYSTEM_AUTH_FILE_PATH = path.join(
  __dirname,
  '../../data/system/systemAuthList.json'
)

// 把扁平的权限列表格式化为树结构
const transfromAuthListToTree = data => {
  const findParent = (row, list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === row.parentId) {
        return list[i]
      }
      if (list[i].children?.length) {
        const r = findParent(row, list[i].children)
        if (r) return r
      }
    }
    return null
  }

  const list = []
  while (data?.length) {
    // 有parentId但是还没插入到children的节点
    const noInsertToParentList = []
    for (let i = 0; i < data.length; i++) {
      const cur = data[i]
      if (
        typeof cur.parentId !== 'number' &&
        typeof cur.parentId !== 'string'
      ) {
        list.push(cur)
        data.splice(i, 1)
        i--
        continue
      }
      if (cur.id === cur.parentId) {
        data.splice(i, 1)
        i--
        continue
      }
      if (
        noInsertToParentList.map(item => item.parentId).includes(cur.parentId)
      ) {
        // 为了保证顺序，下一轮再添加到children中
        noInsertToParentList.push(cur)
        continue
      }
      const parent = findParent(cur, list)
      if (parent) {
        parent.children ? parent.children.push(cur) : (parent.children = [cur])
        data.splice(i, 1)
        i--
        continue
      }
      if (data.findIndex(item => item.id === cur.parentId) === -1) {
        data.splice(i, 1)
        i--
        continue
      }
      noInsertToParentList.push(cur)
    }
  }
  return list
}

// 转为路由需要的格式的字段
const formateRouteTree = (tree, isRoot = true) => {
  for (const item of tree) {
    if (!item.meta) item.meta = {}
    if (item.name) {
      item.meta.title = item.name
      delete item.name
    }
    if (item.menuName) item.name = item.menuName
    if (item.menuPath) item.path = item.menuPath
    // 子路由(isRoot === false)不需要'rank'属性，不然页面跳转会不正确
    if (typeof item.sortNo === 'number' && isRoot) item.meta.rank = item.sortNo
    if (item.menuIcon) item.meta.icon = item.menuIcon
    if (item.cpnPath) item.component = item.cpnPath
    if (!item.redirect) delete item.redirect
    if (item.children?.length) {
      formateRouteTree(item.children, false)
    }

    delete item.parentId
    delete item.authMarker
    delete item.menuName
    delete item.menuPath
    delete item.menuIcon
    delete item.cpnPath
    delete item.authType
    delete item.systemAuth
    delete item.sortNo
    delete item.remark
    delete item.createTime
    delete item.updateTime
  }
  return tree
}

exports.getAsyncRoutes = async (req, res, next) => {
  try {
    // 查询非系统权限
    const resList = await adminDb.query(
      `SELECT
        id,parent_id,name,auth_marker,menu_name,menu_path,menu_icon,redirect,cpn_path,auth_type,sort_no,remark,enable,create_time,update_time
      FROM
        auth_list
      WHERE enable = 1 AND auth_type = 0
      ORDER BY sort_no`
    )

    // 查询系统权限
    fs.readFile(SYSTEM_AUTH_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        // 读取文件出错，直接返回非系统权限
        res.json({
          code: 0,
          data: formateRouteTree(transfromAuthListToTree(resList), true)
        })
        return
      }
      // 系统权限
      const systemAuthList = JSON.parse(data).filter(item => item.enable === 1)

      // 返回系统权限+非系统权限
      res.json({
        code: 0,
        data: formateRouteTree(
          transfromAuthListToTree(
            [...systemAuthList, ...resList].sort((a, b) => a.sortNo - b.sortNo)
          ),
          true
        )
      })
    })
  } catch (err) {
    next(err)
  }
}
