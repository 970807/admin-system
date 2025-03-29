<template>
  <div class="recipe-list">
    <!-- 添加/编辑菜谱 -->
    <AddOrEditRecipeDrawer
      ref="addOrEditRecipeDrawerRef"
      @refresh="fetchData"
    />
    <!-- html导入菜谱 -->
    <ImportFromHTMLDialog ref="importFromHTMLDialogRef" />
    <PageContainer>
      <template #header>
        <Searchs @submit="fetchData({ pageNo: 1 })">
          <SearchsItem label="菜谱名称：">
            <el-input
              placeholder="请输入菜谱名称"
              v-model="listQuery.recipeName"
              clearable
            />
          </SearchsItem>
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="onAddOrEdit()"
              >添加菜谱</el-button
            >
            <el-button
              type="primary"
              :icon="Position"
              @click="importFromHTMLDialogRef.show()"
              >html导入菜谱</el-button
            >
            <el-button type="danger" :icon="Delete" @click="onBatchDelete"
              >批量删除</el-button
            >
            <CombineButtons
              :btnList="[
                { name: '发布', clickFn: () => handlePublish(1) },
                { name: '取消发布', clickFn: () => handlePublish(0) }
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
            label="发布状态"
            align="center"
            min-width="90"
            :formatter="row => ['未发布', '已发布'][row.publish]"
            show-overflow-tooltip
          />
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="180"
          >
            <template #default="{ row }">
              <!-- 编辑菜谱 -->
              <el-button link type="primary" @click="onAddOrEdit(row.id)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #footer>
        <el-pagination
          layout="total,sizes,prev,pager,next,jumper"
          v-model:current-page="listQuery.pageNo"
          v-model:page-size="listQuery.pageSize"
          :total="total"
          @size-change="fetchData({ pageSize: $event })"
          @current-change="fetchData({ pageNo: $event })"
        />
      </template>
    </PageContainer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'meishijie_recipeList' })
</script>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Position, Delete } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import CombineButtons from '@/components/CombineButtons/index.vue'
import AddOrEditRecipeDrawer from './components/AddOrEditRecipeDrawer.vue'
import ImportFromHTMLDialog from './components/ImportFromHTMLDialog.vue'
import {
  getRecipeList,
  batchDeleteRecipe,
  publishRecipe
} from '@/api/meishijie/recipe'
import type { listItemType } from '@/api/meishijie/model/recipeModel'

const addOrEditRecipeDrawerRef =
  ref<InstanceType<typeof AddOrEditRecipeDrawer>>()
const importFromHTMLDialogRef = ref<InstanceType<typeof ImportFromHTMLDialog>>()

const state = reactive<{
  listQuery: {
    recipeName: string
    pageNo: number
    pageSize: number
  }
  selectedRow: listItemType[]
  tableData: listItemType[]
  total: number
  listLoading: boolean
}>({
  listQuery: {
    recipeName: '', // 菜谱名称
    pageNo: 1,
    pageSize: 10
  },
  selectedRow: [],
  tableData: [],
  total: 0,
  listLoading: false
})

const { listQuery, selectedRow, tableData, total, listLoading } = toRefs(state)

const fetchData = (pageInfo?: { pageNo?: number; pageSize?: number }) => {
  if (pageInfo) {
    pageInfo.pageNo && (listQuery.value.pageNo = pageInfo.pageNo)
    pageInfo.pageSize && (listQuery.value.pageSize = pageInfo.pageSize)
  }
  listLoading.value = true
  getRecipeList(listQuery.value)
    .then(res => {
      tableData.value = res.data.list
      total.value = res.data.totalCount
    })
    .finally(() => (listLoading.value = false))
}

// 添加/编辑菜谱
const onAddOrEdit = (id?: listItemType['id']) => {
  addOrEditRecipeDrawerRef.value.show(id)
}

// 批量删除
const onBatchDelete = async () => {
  const idList = state.selectedRow.map(item => item.id)
  if (idList.length < 1) {
    ElMessage.error('请先选择要删除的菜谱！')
    return
  }
  await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
  const { message } = await batchDeleteRecipe({ idList })
  ElMessage.success(message)
  fetchData()
}

/**
 * 发布/取消发布
 * @param publish 是否发布 1:发布 0:取消发布
 */
const handlePublish = async (publish: 1 | 0) => {
  const idList = state.selectedRow.map(item => item.id)
  if (idList.length < 1) {
    ElMessage.error(`请先选择要${publish ? '发布' : '取消发布'}的菜谱！`)
    return
  }
  const { message } = await publishRecipe({ publish, idList })
  ElMessage.success(message)
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>
