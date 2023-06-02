<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'system_authList' })
</script>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage, ElTable } from 'element-plus'
import { getList, delAuth, batchDelAuth, updateSortNo } from '@/api/system/auth'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs } from '@/components/Searchs/index'
import { Plus, Download, Upload, Delete } from '@element-plus/icons-vue'
import AddOrEditDrawer from './components/AddOrEditDrawer.vue'
import { AUTH_TYPE_EM, AUTH_TYPE_ARR } from './dataDict'
import type { IAuthListItem } from '@/api/system/model/auth'

type Row = {
  id: IAuthListItem['id']
  [key: string]: any
}

const tableRef = ref<InstanceType<typeof ElTable>>()
const addOrEditDrawerRef = ref<InstanceType<typeof AddOrEditDrawer>>()

const state = reactive<{
  listLoading: boolean
  tableData: Row[]
  multipleSelection: Row[]
}>({
  listLoading: false,
  tableData: [],
  multipleSelection: []
})

const { listLoading, tableData } = toRefs(state)

// 添加一级菜单
const handleAddFirstLevel = () => {
  addOrEditDrawerRef.value.show(null, {
    drawerTitle: '添加一级菜单',
    disableButtonAuthType: true
  })
}

/**
 * 编辑&查看权限
 * @param row
 * @param readMode true：查看(只能看，不能修改) fale：编辑
 */
const handleEdit = (row: Row, readMode: boolean) => {
  addOrEditDrawerRef.value.show(row, {
    drawerTitle: readMode ? '查看' : '编辑权限',
    // '按钮'权限类型被选择的提示
    buttonAuthTypeSelectTip:
      row.authType === AUTH_TYPE_EM.MENU.value &&
      row.children?.length > 0 &&
      '当前权限有子权限，修改为按钮类型将会自动删除其子权限',
    readMode
  })
}

// 添加子权限
const handleAddSubauth = (row?: Row) => {
  if (row.authType === AUTH_TYPE_EM.BUTTON.value) {
    ElMessage.error('按钮类型不能添加子权限')
    return
  }
  addOrEditDrawerRef.value.show(
    { parentId: row.id },
    { drawerTitle: '添加子权限' }
  )
}

const fetchData = () => {
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

  getList().then(res => {
    const list = []
    while (res?.data?.length) {
      for (let i = 0; i < res.data.length; i++) {
        const cur = res.data[i]
        if (typeof cur.parentId !== 'number') {
          list.push(cur)
          res.data.splice(i, 1)
          i--
          continue
        }
        if (cur.id === cur.parentId) {
          res.data.splice(i, 1)
          i--
          continue
        }
        const parent = findParent(cur, list)
        if (parent) {
          parent.children
            ? parent.children.push(cur)
            : (parent.children = [cur])
          res.data.splice(i, 1)
          i--
          continue
        }
        if (res.data.findIndex(item => item.id === cur.parentId) === -1) {
          res.data.splice(i, 1)
          i--
          continue
        }
      }
    }
    state.tableData = list
  })
}

const onSelectionChange = (val: Row[]) => {
  // 过滤掉系统权限(系统权限只能查看，不能编辑)
  state.multipleSelection = val.filter(item => !item.systemAuth)
  if (state.multipleSelection.length !== val.length) {
    // 取消选中系统权限
    val
      .filter(item => !!item.systemAuth)
      .forEach(row => {
        tableRef.value.toggleRowSelection(row, false)
      })
    ElMessage.info('已过滤掉系统权限')
  }
}

// 删除
const handleDel = (id: Row['id']) => {
  ElMessageBox.confirm('删除后将无法恢复，是否继续？', '提示', {
    type: 'warning'
  })
    .then(() => {
      delAuth(id).then(res => {
        ElMessage.success(res.message)
        fetchData()
      })
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

// 批量删除
const handleBatchDel = async () => {
  const idList = state.multipleSelection.map(item => item.id)
  if (idList.length < 1) {
    ElMessage.error('请先选择要删除的权限！')
    return
  }
  await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
  const { message } = await batchDelAuth({ idList })
  ElMessage.success(message)
  fetchData()
}

// 更新排序值
const handleUpdateSortNo = async (row: Row) => {
  const { message } = await updateSortNo(row.id, row.sortNo)
  ElMessage.success(message)
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="auth-list">
    <!-- 添加/编辑菜单 -->
    <AddOrEditDrawer ref="addOrEditDrawerRef" @refresh="fetchData" />

    <PageContainer>
      <template #header>
        <Searchs :showSearchBtn="false">
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="handleAddFirstLevel"
              >添加一级菜单</el-button
            >
            <el-button type="primary" :icon="Upload">导入配置文件</el-button>
            <el-button type="primary" :icon="Download">导出配置文件</el-button>
            <el-button type="danger" :icon="Delete" @click="handleBatchDel"
              >批量删除</el-button
            >
          </template>
        </Searchs>
      </template>
      <template #default>
        <el-table
          v-loading="listLoading"
          element-loading-text="加载中..."
          :data="tableData"
          row-key="id"
          ref="tableRef"
          border
          @selection-change="onSelectionChange"
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column
            align="center"
            prop="name"
            label="名称"
            fixed="left"
          />
          <el-table-column align="center" prop="authMarker" label="权限标识" />
          <el-table-column align="center" prop="menuPath" label="菜单路径" />
          <el-table-column align="center" prop="redirect" label="重定向" />
          <el-table-column align="center" prop="cpnPath" label="组件路径" />
          <el-table-column
            align="center"
            label="权限类型"
            :formatter="
              row =>
                AUTH_TYPE_ARR.find(item => item.value === row.authType)?.name
            "
          />
          <el-table-column
            align="center"
            prop="systemAuth"
            label="系统权限"
            :formatter="row => ['否', '是'][row.systemAuth]"
          />
          <el-table-column align="center" label="排序值" min-width="150">
            <template #default="{ row }">
              <el-input-number
                v-model="row.sortNo"
                :min="0"
                :max="999"
                @change="handleUpdateSortNo(row)"
            /></template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="备注" />
          <el-table-column
            align="center"
            label="操作"
            fixed="right"
            width="220"
          >
            <template #default="{ row }">
              <template v-if="!row.systemAuth">
                <el-button link type="primary" @click="handleEdit(row, false)"
                  >编辑</el-button
                >
                <el-button link type="primary" @click="handleAddSubauth(row)"
                  >添加子权限</el-button
                >
                <el-button link type="danger" @click="handleDel(row.id)"
                  >删除</el-button
                >
              </template>
              <template v-else>
                <el-button link type="primary" @click="handleEdit(row, true)"
                  >查看</el-button
                >
              </template>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageContainer>
  </div>
</template>
