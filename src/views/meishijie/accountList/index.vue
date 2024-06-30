<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'meishijie_accountList' })
</script>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Plus, Edit, Unlock, Delete } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import {
  getList,
  editAccountPassword,
  deleteAccount
} from '@/api/meishijie/account'
import AddOrEditAccountDrawer from './components/AddOrEditAccountDrawer.vue'
import type {
  listItemType,
  IGetListParams
} from '@/api/meishijie/model/accountModel'

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
    pageNo: 1,
    pageSize: 10,
    account: '',
    nickname: ''
  },
  listLoading: false,
  total: 0
})

const { tableData, listQuery, listLoading, total } = toRefs(state)

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

// 添加/编辑账号
const onAddOrEdit = (row?: listItemType) => {
  addOrEditAccountDrawerRef.value.show(row)
}

// 修改密码
const onEditPassword = (id: listItemType['id']) => {
  ElMessageBox.prompt('请输入新密码', '修改密码', {
    inputPattern: /^.+$/,
    inputErrorMessage: '密码不能为空'
  })
    .then(async ({ value: password }) => {
      const res = await editAccountPassword({ id, password })
      ElMessage.success(res.message)
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

// 删除账号
const onDeleteAccount = async (id: listItemType['id']) => {
  ElMessageBox.confirm('删除后将无法恢复，是否继续？', '提示', {
    type: 'warning'
  })
    .then(() => {
      deleteAccount({ id }).then(res => {
        ElMessage.success(res.message)
        fetchData()
      })
    })
    .catch(() => {
      ElMessage.info('已取消')
    })
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="account-list">
    <!-- 添加/编辑账号drawer -->
    <AddOrEditAccountDrawer
      ref="addOrEditAccountDrawerRef"
      @refresh="fetchData"
    />

    <PageContainer>
      <template #header>
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
          <el-table-column
            align="center"
            prop="account"
            label="账号"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="phone"
            label="手机号"
            min-width="120"
          />
          <el-table-column
            align="center"
            prop="nickname"
            label="昵称"
            min-width="120"
          />
          <el-table-column align="center" label="头像" min-width="120">
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
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="220"
          >
            <template #default="{ row }">
              <!-- 修改密码 -->
              <el-button
                type="success"
                :icon="Unlock"
                circle
                @click="onEditPassword(row.id)"
              />
              <!-- 编辑账号 -->
              <el-button
                type="primary"
                :icon="Edit"
                circle
                @click="onAddOrEdit(row)"
              />
              <!-- 删除账号 -->
              <el-button
                type="danger"
                :icon="Delete"
                circle
                @click="onDeleteAccount(row.id)"
              />
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
