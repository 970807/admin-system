<template>
  <el-drawer
    v-model="visible"
    :title="`管理菜谱 - ${columnData.columnName}`"
    :size="900"
    destroy-on-close
    @closed="onClose"
  >
    <template #default>
      <Searchs @submit="fetchData()">
        <SearchsItem label="菜谱名称：">
          <el-input
            placeholder="请输入菜谱名称"
            v-model="listQuery.recipeName"
            clearable
          />
        </SearchsItem>
        <template #btns>
          <el-button type="primary" :icon="Plus" @click="onAddRecipe()"
            >添加菜谱</el-button
          >
          <el-button type="danger" :icon="Delete" @click="onDeleteRecipe()"
            >删除菜谱</el-button
          >
        </template>
      </Searchs>

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
        <el-table-column align="center" label="序号" width="70">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          label="菜谱名称"
          align="center"
          prop="recipeName"
          min-width="140"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          min-width="140"
          show-overflow-tooltip
          :formatter="row => ['未发布', '已发布'][row.publish]"
        >
          <template #header>
            <div class="question-table-column">
              <span>发布状态</span>
              <el-tooltip
                content="菜谱资源的发布状态，如需发布/取消发布，请前往菜谱列表操作"
                placement="top"
              >
                <el-icon class="icon-question"><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
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
      </el-table>
    </template>
    <template #footer>
      <el-button @click="onClose">关闭</el-button>
    </template>
  </el-drawer>

  <!-- 选择菜谱弹窗 -->
  <SelectRecipeDialog
    ref="selectRecipeDialogRef"
    @select-finish="onSelectRecipeFinish"
  />
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, QuestionFilled } from '@element-plus/icons-vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import SelectRecipeDialog from '../../components/SelectRecipeDialog.vue'
import {
  getColumnRecipeList,
  addColumnRecipe,
  updateColumnRecipeSortNo,
  deleteColumnRecipe
} from '@/api/meishijie/homeColumn'

const selectRecipeDialogRef = ref<InstanceType<typeof SelectRecipeDialog>>()

const state = reactive<{
  visible: boolean
  listQuery: {
    recipeName: string // 菜谱名称
  }
  listLoading: boolean
  tableData: any[]
  selectedRow: any[]
  columnData: {
    id: string // 栏位id
    columnName: string // 栏位mc
  }
}>({
  visible: false,
  listQuery: {
    recipeName: ''
  },
  listLoading: false,
  tableData: [],
  selectedRow: [],
  columnData: {
    id: '',
    columnName: ''
  }
})

const { visible, listQuery, listLoading, tableData, selectedRow, columnData } =
  toRefs(state)

/**
 * 打开抽屉
 * @param id 栏位id
 * @param columnName 栏位名称
 */
const show = (id: string, columnName: string) => {
  columnData.value.id = id
  columnData.value.columnName = columnName
  visible.value = true
  fetchData()
}

// 关闭抽屉
const onClose = () => {
  visible.value = false
  // 重置数据
  listQuery.value.recipeName = ''
  tableData.value = []
  selectedRow.value = []
  columnData.value.id = ''
  columnData.value.columnName = ''
}

// 查询列表
const fetchData = () => {
  listLoading.value = true
  getColumnRecipeList(columnData.value.id, listQuery.value)
    .then(res => {
      tableData.value = res.data ?? []
    })
    .finally(() => (listLoading.value = false))
}

// 添加菜谱
const onAddRecipe = () => {
  // 打开'选择菜谱'弹窗
  selectRecipeDialogRef.value.show()
}

// 删除菜谱
const onDeleteRecipe = async () => {
  const idList = state.selectedRow.map(item => item.id)
  if (idList.length < 1) {
    ElMessage.error('请先选择要删除的菜谱！')
    return
  }
  await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
  const { message } = await deleteColumnRecipe({ idList })
  ElMessage.success(message)
  fetchData()
}

// 选择菜谱完成
const onSelectRecipeFinish = (selectRows: any[]) => {
  addColumnRecipe({
    columnId: columnData.value.id,
    recipeIdList: selectRows.map(item => item.id)
  }).then(res => {
    ElMessage.success(res.message)
    fetchData()
  })
}

// 更新排序值
const handleUpdateSortNo = async (row: any) => {
  const { message } = await updateColumnRecipeSortNo({
    id: row.id,
    sortNo: row.sortNo
  })
  ElMessage.success(message)
}

defineExpose({ show })
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
