import type { Ref } from 'vue'
import type { listItemType as roleItemType } from '@/api/system/model/role'

export const useRole = (roleList: Ref<roleItemType[]>) => {
  const roleCache = {}
  const getRoleInfoByRoleId = (
    roleId: roleItemType['id']
  ): roleItemType | null => {
    if (roleCache[roleId]) return roleCache[roleId]
    const r = roleList.value.find(item => item.id === roleId)
    if (!r) return null
    roleCache[roleId] = r
    return r
  }
  return { getRoleInfoByRoleId }
}
