<template>
  <el-drawer
    v-model="visible"
    title="管理热搜 - 今日热搜"
    :size="900"
    destroy-on-close
    @closed="onClose"
  >
    <template #default>
      <Searchs @submit="fetchData()">
        <SearchsItem label="关键词：">
          <el-input
            placeholder="请输入关键词"
            v-model="listQuery.keyword"
            clearable
          />
        </SearchsItem>
      </Searchs>

      <el-table
        v-loading="listLoading"
        element-loading-text="加载中..."
        :data="tableData"
        height="100%"
        border
      >
        <el-table-column align="center" label="序号" width="70">
          <template #default="{ row, $index }">
            {{ isAddRow(row) ? '' : String($index + 1) }}
          </template>
        </el-table-column>
        <el-table-column
          label="关键词"
          align="center"
          min-width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-input
              v-if="isAddRow(row)"
              placeholder="请输入"
              v-model="row.keyword"
              clearable
              maxlength="80"
              show-word-limit
            />
            <span v-else>{{ row.keyword }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="超级热搜"
          align="center"
          prop="keyword"
          min-width="140"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <el-switch
              v-if="isAddRow(row)"
              v-model="row.superHot"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
            <span v-else>{{ row.superHot ? '是' : '否' }}</span>
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
              @change="
                isAddRow(row) ? null : handleUpdateSortNo(row.id, $event)
              "
          /></template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="180">
          <template #default="{ row }">
            <el-button
              v-if="isAddRow(row)"
              type="primary"
              @click="onAddHotSearch(row)"
              >添加</el-button
            >
            <el-button v-else link type="danger" @click="onDeleteHotSearch(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #footer>
      <el-button @click="onClose">关闭</el-button>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getTodayHotSearch,
  addTodayHotSearch,
  updateTodayHotSearchSortNo,
  deleteTodayHotSearch
} from '@/api/meishijie/homeColumn'

const getAddRow = () => ({
  _isAdd: true,
  keyword: '',
  superHot: 0,
  sortNo: 0
})

const state = reactive<{
  visible: boolean
  listQuery: {
    keyword: string
  }
  listLoading: boolean
  tableData: any[]
}>({
  visible: false,
  listQuery: {
    keyword: ''
  },
  listLoading: false,
  tableData: [getAddRow()]
})

const { visible, listQuery, listLoading, tableData } = toRefs(state)

// 打开抽屉
const show = () => {
  visible.value = true

  fetchData()
}

// 关闭抽屉
const onClose = () => {
  visible.value = false
  // 重置数据
  listQuery.value.keyword = ''
  tableData.value = [getAddRow()]
}

// 查询列表
const fetchData = () => {
  listLoading.value = true
  getTodayHotSearch(listQuery.value)
    .then(res => {
      state.tableData = [...(res.data ?? []), getAddRow()]
    })
    .finally(() => (listLoading.value = false))
}

// 是否是数据添加行
const isAddRow = row => {
  return !!row._isAdd
}

// 添加热搜
const onAddHotSearch = data => {
  // 校验
  if (!data.keyword) {
    ElMessage.error('请输入关键词')
    return
  }
  if (typeof data.sortNo !== 'number') {
    ElMessage.error('请输入排序值')
    return
  }
  // 添加
  addTodayHotSearch(data).then(() => {
    fetchData()
  })
}

// 删除热搜
const onDeleteHotSearch = async row => {
  await ElMessageBox.confirm(`删除数据后将无法恢复，是否继续？`, '提示')
  deleteTodayHotSearch(row.id).then(res => {
    ElMessage.success(res.message)
    fetchData()
  })
}

// 更新排序值
const handleUpdateSortNo = (id: string, sortNo: number) => {
  updateTodayHotSearchSortNo({ id, sortNo }).then(res => {
    ElMessage.success(res.message)
  })
}

defineExpose({ show })
</script>
