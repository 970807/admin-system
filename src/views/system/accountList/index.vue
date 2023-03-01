<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import { getList } from '@/api/system/account'
import type {
  listItemType,
  IGetListParams
} from '@/api/system/model/accountModel'

export default defineComponent({
  name: 'system_accountList',
  components: { PageContainer, Searchs, SearchsItem },
  setup() {
    const state = reactive<{
      listQuery: IGetListParams
      total: number
      listLoading: boolean
      tableData: listItemType[]
    }>({
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        username: ''
      },
      total: 0,
      listLoading: false,
      tableData: []
    })

    const fetchData = (pageInfo?: { pageNo?: number; pageSize?: number }) => {
      if (pageInfo) {
        pageInfo.pageNo && (state.listQuery.pageNo = pageInfo.pageNo)
        pageInfo.pageSize && (state.listQuery.pageSize = pageInfo.pageSize)
      }
      state.listLoading = true
      getList(state.listQuery)
        .then(res => {
          state.tableData = res.data.list
          state.total = res.data.totalCount
        })
        .finally(() => (state.listLoading = false))
    }

    // 添加/编辑账号
    const onAddOrEdit = () => {}

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state),
      fetchData,
      onAddOrEdit,
      Plus
    }
  }
})
</script>

<template>
  <div class="account-list">
    <PageContainer>
      <template #header>
        <Searchs @submit="fetchData({ pageNo: 1 })">
          <SearchsItem>
            <el-input
              placeholder="请输入账号"
              v-model="listQuery.username"
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
          <el-table-column align="center" prop="username" label="账号" />
          <el-table-column align="center" label="头像">
            <template #default="{ row }">
              <el-image
                v-if="row.avatar"
                style="width: 60px; height: 60px"
                :src="row.avatar"
                :preview-src-list="[row.avatar]"
                preview-teleported
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="roleId" label="角色" />
          <el-table-column align="center" label="操作" />
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
