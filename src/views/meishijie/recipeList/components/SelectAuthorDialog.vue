<!-- 选择菜谱作者dialog -->
<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import { getList } from '@/api/meishijie/account'
import type {
  listItemType,
  IGetListParams
} from '@/api/meishijie/model/accountModel'

const emit = defineEmits<{
  (e: 'select-row', row: listItemType): void
}>()

const getInitListQuery = (): IGetListParams => ({
  account: '', // 账号
  nickname: '', // 昵称
  pageNo: 1,
  pageSize: 10
})

const state = reactive<{
  visible: boolean
  listLoading: boolean
  radiov: string
  selectRow: listItemType | null
  tableData: listItemType[]
  listQuery: IGetListParams
  total: number
}>({
  visible: false,
  listLoading: false,
  radiov: '', // radio选中的作者id
  selectRow: null, // radio选中的行
  tableData: [],
  listQuery: getInitListQuery(),
  total: 0
})

const { visible, listLoading, radiov, tableData, listQuery, total } =
  toRefs(state)

/**
 *
 * @param echoAuthorId 作者id，用于回显
 */
const show = (echoAuthorId: string) => {
  visible.value = true
  state.radiov = echoAuthorId
  fetchData()
}

const onClose = () => {
  visible.value = false
  // 重置数据
  state.listQuery = getInitListQuery()
  state.tableData = []
  state.total = 0
  state.radiov = ''
  state.selectRow = null
}

const fetchData = (pageInfo?: { pageNo?: number; pageSize?: number }) => {
  if (pageInfo) {
    pageInfo.pageNo && (listQuery.value.pageNo = pageInfo.pageNo)
    pageInfo.pageSize && (listQuery.value.pageSize = pageInfo.pageSize)
  }
  listLoading.value = true
  getList(listQuery.value)
    .then(res => {
      tableData.value = res.data.list
      total.value = res.data.totalCount
    })
    .finally(() => (listLoading.value = false))
}

const onRadioSelect = val => {
  state.selectRow = state.tableData.find(item => item.id === val) ?? null
}

const onConfirm = () => {
  if (!state.radiov) {
    // 未选择
    ElMessage.error('请先选择作者！')
    return
  }
  if (!state.selectRow) {
    // 选中的值没有变过
    onClose()
    return
  }
  emit('select-row', state.selectRow)
  onClose()
}

defineExpose({ show })
</script>
<template>
  <el-dialog
    title="请选择"
    :close-on-click-modal="false"
    v-model="visible"
    @closed="onClose"
  >
    <template #default>
      <Searchs @submit="fetchData({ pageNo: 1 })">
        <SearchsItem label="账号：">
          <el-input
            placeholder="请输入账号"
            v-model="listQuery.account"
            clearable
          />
        </SearchsItem>
        <SearchsItem label="昵称：">
          <el-input
            placeholder="请输入昵称"
            v-model="listQuery.nickname"
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
        <el-table-column align="center" width="55">
          <template #default="{ row }">
            <el-radio
              v-model="radiov"
              :label="row.id"
              @change="onRadioSelect"
              >{{ '' }}</el-radio
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="序号" width="70">
          <template #default="{ $index }">
            {{ (listQuery.pageNo - 1) * listQuery.pageSize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="account"
          label="账号"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="nickname"
          label="昵称"
          min-width="120"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="phone"
          label="手机号"
          min-width="120"
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
</template>

<style lang="scss" scoped>
.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
