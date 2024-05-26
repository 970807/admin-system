<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  nextTick
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Searchs } from '@/components/Searchs/index'
import { Plus, Delete } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { getList, changeRoleStatus, batchDel, delRole } from '@/api/system/role'
import { formatTime } from '@/utils/time'
import AddOrEditRoleDrawer from './components/AddOrEditRoleDrawer.vue'
import type { TableInstance } from 'element-plus'
import type { listItemType } from '@/api/system/model/role'

export default defineComponent({
  name: 'system_roleList',
  components: { PageContainer, Searchs, AddOrEditRoleDrawer },
  setup() {
    const router = useRouter()
    const route = useRoute()

    const tableRef = ref<TableInstance>()
    const addOrEditRoleDrawerRef =
      ref<InstanceType<typeof AddOrEditRoleDrawer>>()

    const state = reactive<{
      listLoading: boolean
      tableData: listItemType[]
      selectedRow: listItemType[]
    }>({
      listLoading: false,
      tableData: [],
      selectedRow: []
    })

    const fetchData = () => {
      state.listLoading = true
      getList()
        .then(res => {
          state.tableData = res.data
        })
        .finally(() => (state.listLoading = false))
    }

    // 添加/编辑角色
    const onAddOrEdit = (data?: listItemType) => {
      addOrEditRoleDrawerRef.value.show(data)
    }

    // 授权
    const onAuth = (data: listItemType) => {
      router.push({
        name: 'system_roleAuth',
        query: { roleId: data.id, roleName: data.roleName }
      })
    }

    // 启用/禁用角色
    const onEnableChange = async (data: listItemType) => {
      const enable = data.enable
      const curEnable = enable ? 0 : 1
      await ElMessageBox.confirm(
        `是否确定${curEnable ? '启用' : '禁用'}该角色？`,
        '提示'
      )
      const { message } = await changeRoleStatus(data.id, curEnable)
      data.enable = curEnable
      ElMessage.success(message)
    }

    // 滚动到表格的某一行
    const tableScrollToRow = (rowIndex: number) => {
      const tableEl = tableRef.value.$el as HTMLElement
      const tableRowEls = tableEl.querySelectorAll('.el-table__row')
      const scrollY = Array.from(tableRowEls)
        .slice(0, rowIndex)
        .reduce((pre, cur) => pre + cur.clientHeight, 0)
      tableRef.value.scrollTo(0, scrollY)
    }

    // 表格行高亮
    const tableRowClassName = ({
      row,
      rowIndex
    }: {
      row: listItemType
      rowIndex: number
    }) => {
      const activeId = route.query['active-id']
      if (!activeId) return
      if (row.id === +activeId) {
        if (rowIndex > 0) nextTick(() => tableScrollToRow(rowIndex))
        return 'active-row'
      }
    }

    // 批量删除
    const onBatchDel = async () => {
      const idList = state.selectedRow.map(item => item.id)
      if (idList.length < 1) {
        ElMessage.error('请先选择要删除的角色！')
        return
      }
      await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
      const { message } = await batchDel({ idList })
      ElMessage.success(message)
      fetchData()
    }

    // 删除
    const onDel = async (id: listItemType['id']) => {
      await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
      const { message } = await delRole(id)
      ElMessage.success(message)
      fetchData()
    }

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state),
      tableRef,
      fetchData,
      addOrEditRoleDrawerRef,
      onAddOrEdit,
      onAuth,
      onEnableChange,
      formatTime,
      tableRowClassName,
      onBatchDel,
      onDel,
      Plus,
      Delete
    }
  }
})
</script>

<template>
  <div class="role-list">
    <AddOrEditRoleDrawer ref="addOrEditRoleDrawerRef" @refresh="fetchData" />
    <PageContainer>
      <template #header>
        <Searchs :showSearchBtn="false">
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="onAddOrEdit()"
              >添加角色</el-button
            >
            <el-button type="danger" :icon="Delete" @click="onBatchDel"
              >批量删除</el-button
            >
          </template>
        </Searchs>
      </template>
      <template #default>
        <el-table
          ref="tableRef"
          v-loading="listLoading"
          element-loading-text="加载中..."
          :data="tableData"
          :row-class-name="tableRowClassName"
          height="100%"
          border
          @selection-change="val => (selectedRow = val)"
        >
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="70"
          />
          <el-table-column align="center" prop="roleName" label="角色名" />
          <el-table-column align="center" label="是否启用" width="120">
            <template #default="{ row }">
              <el-switch
                :model-value="row.enable"
                :active-value="1"
                :inactive-value="0"
                @change="onEnableChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="排序值"
            prop="sort"
            width="120"
          />
          <el-table-column align="center" label="创建时间" width="180">
            <template #default="{ row }">{{
              formatTime(row.createTime)
            }}</template>
          </el-table-column>
          <el-table-column align="center" label="更新时间" width="180">
            <template #default="{ row }">{{
              formatTime(row.updateTime)
            }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160">
            <template #default="{ row }">
              <el-button type="primary" link @click="onAddOrEdit(row)"
                >编辑</el-button
              >
              <el-button type="primary" link @click="onAuth(row)"
                >授权</el-button
              >
              <el-button type="danger" link @click="onDel(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageContainer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table) {
  .active-row {
    --el-table-tr-bg-color: var(--el-color-success-light-5);
  }
}
</style>
