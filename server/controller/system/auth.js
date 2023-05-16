const adminDb = require('../../db/admin')

exports.getList = async (req, res, next) => {
  try {
    const data = await adminDb.query(
      'SELECT id,parent_id,name,auth_marker,menu_path,menu_icon,redirect,cpn_path,auth_type,sort_no,remark,create_time,update_time FROM auth_list'
    )
    res.json({ code: 0, data })
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
      res.json({ code: 0, data: null, message: '编辑权限成功' })
    } else {
      // 新增权限
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
        createTime: d,
        updateTime: d
      })
      res.json({ code: 0, data: null, message: '添加权限成功' })
    }
  } catch (err) {
    next(err)
  }
}
