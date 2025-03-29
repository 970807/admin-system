<template>
  <div class="home-column">
    <PageContainer>
      <template #header>
        <Searchs @submit="fetchData()">
          <SearchsItem label="栏位名称：">
            <el-input
              placeholder="请输入栏位名称"
              v-model="listQuery.columnName"
              clearable
            />
          </SearchsItem>
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="onAddOrEdit()"
              >添加栏位</el-button
            >
            <el-button type="danger" :icon="Delete" @click="onBatchDelete"
              >批量删除</el-button
            >
            <CombineButtons
              :btnList="[
                { name: '启用', clickFn: () => handleAvailable(1) },
                { name: '禁用', clickFn: () => handleAvailable(0) }
              ]"
            />
          </template>
        </Searchs>
      </template>
      <template #default>
        <el-table
          v-loading="listLoading"
          element-loading-text="加载中..."
          :data="tableData"
          height="100%"
          border
          @selection-change="val => (selectedRow = val)"
        >
          <el-table-column
            align="center"
            type="selection"
            width="55"
          ></el-table-column>
          />
          <el-table-column align="center" label="序号" width="70">
            <template #default="{ $index }">
              {{ $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="栏位名称"
            align="center"
            prop="columnName"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            align="center"
            min-width="120"
            show-overflow-tooltip
            :formatter="row => ['否', '是'][row.system]"
          >
            <template #header>
              <div class="question-table-column">
                <span>系统栏位</span>
                <el-tooltip content="系统预设的栏位，不可删除" placement="top">
                  <el-icon class="icon-question"><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="栏位菜谱数"
            align="center"
            prop="recipeCount"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            label="是否启用"
            align="center"
            min-width="120"
            show-overflow-tooltip
            :formatter="row => ['否', '是'][row.available]"
          />
          <el-table-column
            align="center"
            label="排序值"
            show-overflow-tooltip
            min-width="140"
          >
            <template #default="{ row }">
              <el-input-number
                style="width: 130px"
                v-model="row.sortNo"
                :min="0"
                :max="999"
                @change="handleUpdateSortNo(row)"
            /></template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="180"
          >
            <template #default="{ row }">
              <el-button link type="primary" @click="onAddOrEdit(row.id)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageContainer>

    <!-- 添加/编辑栏位 -->
    <AddOrEditColumnDrawer
      ref="addOrEditColumnDrawerRef"
      @refresh="fetchData"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'MeishijieHomeColumn' })
</script>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, QuestionFilled } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import CombineButtons from '@/components/CombineButtons/index.vue'
import AddOrEditColumnDrawer from './components/AddOrEditColumnDrawer.vue'
import {
  getHomeColumnList,
  updateHomeColumnSortNo,
  batchDeleteHomeColumn,
  availableHomeColumn
} from '@/api/meishijie/homeColumn'

const addOrEditColumnDrawerRef =
  ref<InstanceType<typeof AddOrEditColumnDrawer>>()

const state = reactive<{
  listQuery: {
    columnName: string // 栏位名称
  }
  listLoading: boolean
  tableData: any[]
  selectedRow: any[]
}>({
  listQuery: {
    columnName: ''
  },
  listLoading: false,
  tableData: [],
  selectedRow: []
})

const { listQuery, listLoading, tableData, selectedRow } = toRefs(state)

/**
 * 查询列表
 */
const fetchData = () => {
  listLoading.value = true
  getHomeColumnList(listQuery.value)
    .then(res => {
      tableData.value = res.data ?? []
    })
    .finally(() => (listLoading.value = false))
}

/**
 * 添加/编辑栏位
 */
const onAddOrEdit = (id?: string) => {
  addOrEditColumnDrawerRef.value.show(id)
}

/**
 * 更新排序值
 */
const handleUpdateSortNo = async (row: any) => {
  const { message } = await updateHomeColumnSortNo({
    id: row.id,
    sortNo: row.sortNo
  })
  ElMessage.success(message)
}

/**
 * 批量删除
 */
const onBatchDelete = async () => {
  const idList = state.selectedRow.map(item => item.id)
  if (idList.length < 1) {
    ElMessage.error('请先选择要删除的栏位！')
    return
  }
  await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
  const { message } = await batchDeleteHomeColumn({ idList })
  if (state.selectedRow.some(item => item.system !== 0)) {
    ElMessage.success(`当前选择了'系统栏位'的数据，删除时已自动忽略`)
  }
  ElMessage.success(message)
  fetchData()
}

/**
 * 启用/禁用
 * @param isAvailable 1：启用 0:禁用
 */
const handleAvailable = async (isAvailable: 1 | 0) => {
  const idList = state.selectedRow.map(item => item.id)
  if (idList.length < 1) {
    ElMessage.error(`请先选择要${isAvailable ? '启用' : '禁用'}的栏位！`)
    return
  }
  const { message } = await availableHomeColumn({
    available: isAvailable,
    idList
  })
  ElMessage.success(message)
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.question-table-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-question {
  margin-left: 6px;
  cursor: pointer;
}
</style>
