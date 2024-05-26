<!-- 角色授权 -->
<template>
  <div class="role-auth">
    <PageContainer>
      <template #header>
        <div class="title-header-row">
          <div class="left">
            <h3 class="head-title">
              <el-icon
                class="icon-back"
                @click="router.push({ name: 'system_roleList' })"
              >
                <Back />
              </el-icon>
              <span>角色授权</span>
            </h3>
            <div class="role-info">
              <span>角色编号：{{ route.query.roleId }}</span>
              <span>角色名称：{{ route.query.roleName }}</span>
            </div>
          </div>
          <div class="right">
            <div class="row">
              <el-button type="primary" @click="onSave">保存</el-button>
            </div>
            <div class="row">
              <el-button
                type="primary"
                link
                :icon="CircleCheck"
                @click="onCheckedAll"
                >全选</el-button
              >
              <el-button
                type="primary"
                link
                :icon="CircleClose"
                @click="onCancelCheckedAll"
                >取消全选</el-button
              >
            </div>
          </div>
        </div>
      </template>
      <template #default>
        <el-table
          v-loading="listLoading"
          element-loading-text="加载中..."
          :data="tableData"
          :span-method="spanMethodFn"
          border
        >
          <el-table-column align="center" label="一级菜单">
            <template #default="{ row }">
              <el-checkbox
                :label="row.firstMenuId"
                :model-value="checkedIds.includes(row.firstMenuId)"
                @change="onCheckedChange($event, 'firstMenu', row)"
                >{{ row.firstMenuName }}</el-checkbox
              >
            </template>
          </el-table-column>
          <el-table-column align="center" label="二级菜单">
            <template #default="{ row }">
              <el-checkbox
                v-if="row.secondMenuId"
                :label="row.secondMenuId"
                :model-value="checkedIds.includes(row.secondMenuId)"
                @change="onCheckedChange($event, 'secondMenu', row)"
                >{{ row.secondMenuName }}</el-checkbox
              >
            </template>
          </el-table-column>
          <el-table-column align="center" prop="roleName" label="权限点">
            <template #default="{ row }">
              <el-checkbox-group
                v-if="row.authList?.length"
                v-model="checkedIds"
              >
                <el-checkbox
                  v-for="auth in row.authList"
                  :key="auth.id"
                  :label="auth.id"
                  >{{ auth.name }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
export default defineComponent({ name: 'system_roleAuth' })
</script>

<script lang="ts" setup>
import PageContainer from '@/components/PageContainer/index.vue'
import { ElMessage } from 'element-plus'
import { Back, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { reactive, toRefs } from 'vue'
import { getList as getAllAuthList } from '@/api/system/auth'
import { roleAuth, getAuthIdsByRoleId } from '@/api/system/role'

const router = useRouter()
const route = useRoute()

const state = reactive<{
  tableData: any[]
  listLoading: boolean
  checkedIds: string[]
}>({
  tableData: [],
  listLoading: false,
  checkedIds: []
})

const { tableData, listLoading, checkedIds } = toRefs(state)

const fetchData = () => {
  const formateData = (list: any[]) => {
    if (!Array.isArray(list) || list.length < 1) return []
    const results = []
    // 一级菜单
    const firstMenuList = list.filter(item => !item.parentId)
    firstMenuList.forEach(fItem => {
      const fRow: any = { firstMenuId: fItem.id, firstMenuName: fItem.name }
      // 找对应的二级菜单
      const secondMenuList = list.filter(item => item.parentId === fItem.id)
      if (secondMenuList.length < 1) {
        // 没有二级菜单
        results.push(fRow)
        return
      }
      // 找对应的权限点
      secondMenuList.forEach(sItem => {
        const sRow: any = {
          ...fRow,
          secondMenuId: sItem.id,
          secondMenuName: sItem.name
        }
        const authList = list.filter(item => item.parentId === sItem.id)
        if (authList.length < 1) {
          // 没有权限点
          results.push(sRow)
          return
        }
        sRow.authList = authList.map(item => ({ id: item.id, name: item.name }))
        results.push(sRow)
      })
    })
    return results
  }

  state.listLoading = true

  Promise.allSettled([
    getAllAuthList(),
    getAuthIdsByRoleId(Number(route.query.roleId))
  ])
    .then(([res1, res2]) => {
      if (res1.status === 'fulfilled') {
        state.tableData = formateData(res1.value?.data)
      } else {
        state.tableData = []
      }

      if (res2.status === 'fulfilled') {
        state.checkedIds = res2.value?.data ?? []
      } else {
        state.checkedIds = []
      }
    })
    .finally(() => (state.listLoading = false))
}

const spanMethodFn = ({
  row,
  column,
  rowIndex,
  columnIndex
}: {
  row: any
  column: any
  rowIndex: number
  columnIndex: number
}) => {
  if (columnIndex === 0) {
    if (
      row.firstMenuId &&
      row.firstMenuId === state.tableData[rowIndex - 1]?.firstMenuId
    ) {
      return [0, 1]
    }
    let rowSpan = 1
    let i = 1
    while (
      row.firstMenuId &&
      row.firstMenuId === state.tableData[rowIndex + i]?.firstMenuId
    ) {
      rowSpan++
      i++
    }
    return [rowSpan, 1]
  }
}

/**
 * 勾选/取消勾选
 * @param isChecked 是否选中
 * @param checkedTarget firstMenu：勾选/取消勾选目标为一级菜单 secondMenu：目标为二级菜单
 * @param row tableRow对象
 */
const onCheckedChange = (
  isChecked: boolean | any,
  checkedTarget: string,
  row: any
) => {
  if (isChecked) {
    // 勾选
    if (checkedTarget === 'firstMenu') {
      // 勾选目标为一级菜单
      if (!state.checkedIds.includes(row.firstMenuId))
        state.checkedIds.push(row.firstMenuId)
      // 把对应的二级菜单也勾选
      state.tableData.forEach(item => {
        if (item.firstMenuId === row.firstMenuId && item.secondMenuId) {
          if (!state.checkedIds.includes(item.secondMenuId))
            state.checkedIds.push(item.secondMenuId)
          // 把对应的权限点也勾选
          if (item.authList?.length) {
            state.checkedIds.push(
              ...item.authList
                .map(auth => auth.id)
                .filter(itm => !state.checkedIds.includes(itm))
            )
          }
        }
      })
    } else if (checkedTarget === 'secondMenu') {
      // 勾选目标为二级菜单
      if (!state.checkedIds.includes(row.secondMenuId))
        state.checkedIds.push(row.secondMenuId)
      // 把对应的权限点也勾选
      if (row.authList?.length) {
        state.checkedIds.push(
          ...row.authList
            .map(auth => auth.id)
            .filter(itm => !state.checkedIds.includes(itm))
        )
      }
    }
  } else {
    // 取消勾选
    if (checkedTarget === 'firstMenu') {
      // 取消勾选目标为一级菜单
      const findIdx = state.checkedIds.indexOf(row.firstMenuId)
      if (findIdx !== -1) state.checkedIds.splice(findIdx, 1)
      // 把对应的二级菜单也取消勾选
      state.tableData.forEach(item => {
        if (item.firstMenuId === row.firstMenuId && item.secondMenuId) {
          const findIdx = state.checkedIds.indexOf(item.secondMenuId)
          if (findIdx !== -1) state.checkedIds.splice(findIdx, 1)
          // 把对应的权限点也取消勾选
          if (item.authList?.length) {
            item.authList.forEach(itm => {
              const findIdx = state.checkedIds.indexOf(itm.id)
              if (findIdx !== -1) state.checkedIds.splice(findIdx, 1)
            })
          }
        }
      })
    } else if (checkedTarget === 'secondMenu') {
      // 取消勾选目标为二级菜单
      const findIdx = state.checkedIds.indexOf(row.secondMenuId)
      if (findIdx !== -1) state.checkedIds.splice(findIdx, 1)
      // 把对应的权限点也取消勾选
      if (row.authList?.length) {
        row.authList.forEach(itm => {
          const findIdx = state.checkedIds.indexOf(itm.id)
          if (findIdx !== -1) state.checkedIds.splice(findIdx, 1)
        })
      }
    }
  }
}

// 全选
const onCheckedAll = () => {
  const checkedIds = state.checkedIds
  state.tableData.forEach(item => {
    if (item.firstMenuId && !checkedIds.includes(item.firstMenuId))
      checkedIds.push(item.firstMenuId)
    if (item.secondMenuId && !checkedIds.includes(item.secondMenuId))
      checkedIds.push(item.secondMenuId)
    if (item.authList?.length) {
      checkedIds.push(
        ...item.authList
          .map(auth => auth.id)
          .filter(itm => !checkedIds.includes(itm))
      )
    }
  })
}

// 取消全选
const onCancelCheckedAll = () => {
  state.checkedIds.splice(0, state.checkedIds.length)
}

// 保存
const onSave = () => {
  state.listLoading = true
  roleAuth(Number(route.query.roleId), { authIds: state.checkedIds })
    .then(res => {
      ElMessage.success(res.message)
    })
    .finally(() => (state.listLoading = false))
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.role-auth {
  .title-header-row {
    display: flex;
    justify-content: space-between;
    background: var(--el-color-primary-light-9);
    padding: 16px;
    --gap-top: 10px;

    .left {
      .head-title {
        display: flex;
        align-items: center;
        font-size: 16px;

        .icon-back {
          cursor: pointer;
        }

        span {
          color: #131418;
          margin-left: 2px;
        }
      }

      .role-info {
        margin-top: var(--gap-top);
        font-size: 14px;
        color: #131418;

        span + span {
          margin-left: 24px;
        }
      }
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .row {
        display: flex;
        justify-content: flex-end;

        // ~ .row {
        // margin-top: var(--gap-top);
        // }
      }
    }
  }
}
</style>
