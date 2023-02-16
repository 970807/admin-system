<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'meishijie_accountList' })
</script>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { Plus, Edit } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import { getList } from '@/api/meishijie/accountList'
import AddOrEditAccountDrawer from './components/AddOrEditAccountDrawer.vue'
import type {
  listItemType,
  IGetListParams
} from '@/api/meishijie/model/accountListModel'

const addOrEditAccountDrawerRef =
  ref<InstanceType<typeof AddOrEditAccountDrawer>>()

const state = reactive<{
  tableData: listItemType[]
  listQuery: IGetListParams
  listLoading: boolean
  total: number
}>({
  tableData: [],
  listQuery: {
    page: 1,
    pageSize: 10,
    account: '',
    nickname: ''
  },
  listLoading: false,
  total: 0
})

const { tableData, listQuery, listLoading, total } = toRefs(state)

const fetchData = (pageInfo?: { page?: number; pageSize?: number }) => {
  if (pageInfo) {
    pageInfo.page && (listQuery.value.page = pageInfo.page)
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

// 添加/编辑账号
const onAddOrEdit = (row?: listItemType) => {
  addOrEditAccountDrawerRef.value.show(row)
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="account-list">
    <!-- 添加/编辑账号drawer -->
    <AddOrEditAccountDrawer ref="addOrEditAccountDrawerRef" />

    <PageContainer>
      <template #header>
        <Searchs @submit="fetchData({ page: 1 })">
          <SearchsItem>
            <el-input
              placeholder="请输入账号"
              v-model="listQuery.account"
              clearable
            />
          </SearchsItem>
          <SearchsItem>
            <el-input
              placeholder="请输入昵称"
              v-model="listQuery.nickname"
              clearable
            />
          </SearchsItem>
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="onAddOrEdit()"
              >添加账号</el-button
            >
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
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="70"
          />
          <el-table-column align="center" prop="account" label="账号" />
          <el-table-column align="center" prop="phone" label="手机号" />
          <el-table-column align="center" prop="nickname" label="昵称" />
          <el-table-column align="center" label="头像">
            <template #default="{ row }">
              <el-image
                v-if="row.avatar"
                fit="contain"
                style="width: 60px; height: 60px"
                :src="row.avatar"
                preview-teleported
                :preview-src-list="[row.avatar]"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="{ row }">
              <el-button
                type="primary"
                :icon="Edit"
                circle
                @click="onAddOrEdit(row)"
              />
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #footer>
        <el-pagination
          layout="total,sizes,prev,pager,next,jumper"
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.pageSize"
          :total="total"
          @size-change="fetchData({ pageSize: $event })"
          @current-change="fetchData({ page: $event })"
        />
      </template>
    </PageContainer>
  </div>
</template>
