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
      rank: 999
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

  const meishijieRouter = {
    path: '/meishijie',
    redirect: '/meishijie/account-list',
    name: 'meishijie',
    meta: {
      title: '美食杰',
      icon: 'mdi:food',
      rank: 10
    },
    children: [
      {
        path: '/meishijie/account-list',
        name: 'MeishijieAccountList',
        meta: {
          title: '账号列表',
          roles: ['admin']
        },
        component: '/src/views/meishijie/accountList'
      },
      {
        path: '/meishijie/ingredient-management',
        name: 'MeishijieIngredientManagement',
        meta: {
          title: '食材管理',
          roles: ['admin']
        },
        component: '/src/views/meishijie/ingredientManagement'
      }
    ]
  }

  const systemRouter = {
    path: '/system',
    redirect: '/system/account-list',
    name: 'system',
    meta: {
      title: '系统管理',
      icon: 'eos-icons:system-ok',
      rank: 100
    },
    children: [
      {
        path: '/system/account-list',
        name: 'SystemAccountList',
        meta: {
          title: '账号列表',
          roles: ['admin']
        },
        component: '/src/views/system/accountList'
      },
      {
        path: '/system/role-list',
        name: 'SystemRoleList',
        meta: {
          title: '角色列表',
          roles: ['admin']
        },
        component: '/src/views/system/roleList'
      },
      {
        path: '/system/auth-list',
        name: 'SystemAuthList',
        meta: {
          title: '权限列表',
          roles: ['admin']
        },
        component: '/src/views/system/authList'
      }
    ]
  }

  res.json({
    code: 0,
    data: [meishijieRouter, permissionRouter, systemRouter]
  })
}
