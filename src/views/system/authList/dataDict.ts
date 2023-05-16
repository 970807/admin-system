// 权限类型
export const AUTH_TYPE_EM = {
  MENU: { name: '菜单', value: 0 },
  BUTTON: { name: '按钮', value: 1 }
} as const

export const AUTH_TYPE_ARR = Object.values(AUTH_TYPE_EM)
