exports.getAsyncRoutes = (req, res) => {
  /**
   * roles：页面级别权限，这里模拟二种 "admin"、"common"
   * admin：管理员角色
   * common：普通角色
   */

  const permissionRouter = {
    path: '/permission',
    meta: {
      title: '权限管理',
      icon: 'lollipop',
      rank: 10
    },
    children: [
      {
        path: '/permission/page/index',
        name: 'PermissionPage',
        meta: {
          title: '页面权限',
          roles: ['admin', 'common']
        }
      },
      {
        path: '/permission/button/index',
        name: 'PermissionButton',
        meta: {
          title: '按钮权限',
          roles: ['admin', 'common'],
          auths: ['btn_add', 'btn_edit', 'btn_delete']
        }
      }
    ]
  }

  res.json({
    code: 0,
    data: [permissionRouter]
  })
}
