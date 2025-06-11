<!--
  选择菜谱dialog
  todo：
    - table滚动条位置不对，在外面了
    - 可以一起选择不同页数的菜谱
-->
<template>
  <div class="select-recipe-dialog">
    <el-dialog
      align-center
      :title="props.dialogTitle"
      :close-on-click-modal="false"
      v-model="visible"
      @closed="onClose"
    >
      <template #default>
        <Searchs @submit="fetchData({ pageNo: 1 })">
          <SearchsItem label="菜谱名称：">
            <el-input
              placeholder="请输入菜谱名称"
              v-model="listQuery.recipeName"
              clearable
            />
          </SearchsItem>
          <template #btns>
            <el-checkbox
              label="仅视频菜谱"
              :disabled="props.onlyVideoRecipe"
              :model-value="listQuery.isVideo === 1"
              @update:model-value="changeIsVideo"
            />
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
          <el-table-column align="center" type="selection" width="55" />
          <el-table-column align="center" label="序号" width="70">
            <template #default="{ $index }">
              {{ (listQuery.pageNo - 1) * listQuery.pageSize + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column
            label="菜谱名称"
            align="center"
            prop="recipeName"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            label="菜谱作者"
            align="center"
            prop="authorName"
            min-width="90"
            show-overflow-tooltip
          />
          <el-table-column
            label="视频菜谱"
            align="center"
            min-width="90"
            show-overflow-tooltip
            :formatter="row => ['否', '是'][row.isVideo]"
          />
          <el-table-column
            label="发布状态"
            align="center"
            min-width="90"
            :formatter="row => ['未发布', '已发布'][row.publish]"
            show-overflow-tooltip
          />
        </el-table>

        <div class="pagination-wrap">
          <el-pagination
            layout="total,sizes,prev,pager,next,jumper"
            v-model:current-page="listQuery.pageNo"
            v-model:page-size="listQuery.pageSize"
            :total="total"
            @size-change="fetchData({ pageSize: $event })"
            @current-change="fetchData({ pageNo: $event })"
          />
        </div>
      </template>
      <template #footer>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" @click="onConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import { getRecipeList } from '@/api/meishijie/recipe'

interface ListQuery {
  recipeName: string // 菜谱名称
  isVideo?: 1 | 0 // 是否是视频菜谱 1:是 0:否
  pageNo: number
  pageSize: number
}

const emits = defineEmits(['select-finish'])

const props = withDefaults(
  defineProps<{
    dialogTitle?: string // 弹窗标题
    onlyVideoRecipe?: boolean // 是否仅能选择视频菜谱 true：是 false：否
  }>(),
  {
    dialogTitle: '请选择',
    onlyVideoRecipe: false
  }
)

const getDefaultListQuery = (): ListQuery => ({
  recipeName: '',
  isVideo: undefined,
  pageNo: 1,
  pageSize: 10
})

const state = reactive<{
  visible: boolean
  listQuery: ListQuery
  listLoading: boolean
  tableData: any[]
  selectedRow: any[]
  total: number
}>({
  visible: false,
  listQuery: getDefaultListQuery(),
  listLoading: false,
  tableData: [],
  selectedRow: [],
  total: 0
})

const { visible, listQuery, listLoading, selectedRow, tableData, total } =
  toRefs(state)

// 打开弹窗
const show = () => {
  visible.value = true

  if (props.onlyVideoRecipe) {
    // 如果是仅能选择视频菜谱，‘仅视频菜谱’查询条件默认勾选上
    listQuery.value.isVideo = 1
  }

  fetchData()
}

// 关闭弹窗
const onClose = () => {
  visible.value = false
  // 重置数据
  listQuery.value = getDefaultListQuery()
  tableData.value = []
  selectedRow.value = []
  total.value = 0
}

// 查询列表
const fetchData = (pageInfo?: { pageNo?: number; pageSize?: number }) => {
  if (pageInfo && typeof pageInfo.pageNo === 'number') {
    listQuery.value.pageNo = pageInfo.pageNo
  }
  if (pageInfo && typeof pageInfo.pageSize === 'number') {
    listQuery.value.pageSize = pageInfo.pageSize
  }
  listLoading.value = true
  getRecipeList(listQuery.value)
    .then(res => {
      tableData.value = res.data?.list ?? []
      total.value = res.data?.totalCount ?? 0
    })
    .finally(() => (listLoading.value = false))
}

// '视频菜谱'选项改变
const changeIsVideo = () => {
  listQuery.value.isVideo = listQuery.value.isVideo === 1 ? undefined : 1
  fetchData({ pageNo: 1 })
}

// 选择完成
const onConfirm = () => {
  if (state.selectedRow.length < 1) {
    ElMessage.error('未选中数据！')
    return
  }
  emits('select-finish', state.selectedRow)
  onClose()
}

defineExpose({ show })
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  padding: {
    top: 10px;
    bottom: 10px;
  }

  .el-table {
    flex: 1;
    overflow: auto;
  }
}

.pagination-wrap {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
