import Cookies from 'js-cookie'
import { storageSession } from '@pureadmin/utils'
import { useUserStoreHook } from '@/store/modules/user'
import type { IAuthListItem } from '@/api/system/model/auth'

export interface DataInfo<T> {
  /** token */
  accessToken: string
  /** `accessToken`的过期时间（时间戳） */
  expires: T
  /** 用于调用刷新accessToken的接口时所需的token */
  refreshToken: string
  /** 用户名 */
  username?: string
  /** 当前登陆用户的角色 */
  roles?: Array<string>
}

export const sessionKey = 'user-info'
export const TokenKey = 'authorized-token'

/** 获取`token` */
export function getToken(): DataInfo<number> {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  return Cookies.get(TokenKey)
    ? JSON.parse(Cookies.get(TokenKey))
    : storageSession().getItem(sessionKey)
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`这两条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`username`、`roles`、`refreshToken`、`expires`这四条信息放在key值为`user-info`的sessionStorage里（浏览器关闭自动销毁）
 */
export function setToken(data: DataInfo<Date>) {
  let expires = 0
  const { accessToken, refreshToken } = data
  expires = new Date(data.expires).getTime() // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可
  const cookieString = JSON.stringify({ accessToken, expires })

  expires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (expires - Date.now()) / 86400000
      })
    : Cookies.set(TokenKey, cookieString)

  function setSessionKey(username: string, roles: Array<string>) {
    useUserStoreHook().SET_USERNAME(username)
    useUserStoreHook().SET_ROLES(roles)
    storageSession().setItem(sessionKey, {
      refreshToken,
      expires,
      username,
      roles
    })
  }

  if (data.username && data.roles) {
    const { username, roles } = data
    setSessionKey(username, roles)
  } else {
    const username =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.username ?? ''
    const roles =
      storageSession().getItem<DataInfo<number>>(sessionKey)?.roles ?? []
    setSessionKey(username, roles)
  }
}

/** 删除`token`以及key值为`user-info`的session信息 */
export function removeToken() {
  Cookies.remove(TokenKey)
  sessionStorage.clear()
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return 'Bearer ' + token
}

// 权限树结构
export interface IAuthTreeItem extends IAuthListItem {
  children: IAuthTreeItem[]
}
// 把接口返回的权限列表转成树结构
export const transformAuthListToTree = (list: any[] = []): IAuthTreeItem[] => {
  const findParent = (row: any, list: any[]) => {
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

  const copyList = JSON.parse(JSON.stringify(list))
  const resList = []
  while (copyList.length) {
    // 有parentId但是还没插入到children的节点
    const noInsertToParentList = []
    for (let i = 0; i < copyList.length; i++) {
      const cur = copyList[i]
      if (
        typeof cur.parentId !== 'number' &&
        typeof cur.parentId !== 'string'
      ) {
        resList.push(cur)
        copyList.splice(i, 1)
        i--
        continue
      }
      if (cur.id === cur.parentId) {
        copyList.splice(i, 1)
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
      const parent = findParent(cur, resList)
      if (parent) {
        parent.children ? parent.children.push(cur) : (parent.children = [cur])
        copyList.splice(i, 1)
        i--
        continue
      }
      if (copyList.findIndex(item => item.id === cur.parentId) === -1) {
        copyList.splice(i, 1)
        i--
        continue
      }
      noInsertToParentList.push(cur)
    }
  }
  return resList
}
