<template>
  <div class="account-list">
    <AddOrEditAccountDrawer
      ref="addOrEditAccountDrawerRef"
      :roleList="roleList"
      @refresh="fetchData"
    />

    <PageContainer>
      <template #header>
        <Searchs @submit="fetchData({ pageNo: 1 })">
          <SearchsItem label="账号：">
            <el-input
              placeholder="请输入账号"
              v-model="listQuery.username"
              clearable
            />
          </SearchsItem>
          <SearchsItem label="角色：">
            <el-select
              v-model="listQuery.roleId"
              filterable
              clearable
              @clear="listQuery.roleId = undefined"
            >
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :value="item.id"
                :label="item.roleName"
              />
            </el-select>
          </SearchsItem>
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="onAddOrEdit()"
              >添加账号</el-button
            >
            <el-button type="danger" :icon="Delete" @click="onBatchDel"
              >批量删除</el-button
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
          @sort-change="onSortChange"
          @selection-change="val => (selectedRow = val)"
        >
          <el-table-column align="center" type="selection" width="55" />
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
          <el-table-column align="center" label="角色">
            <template #default="{ row }">
              <router-link
                v-if="getRoleInfoByRoleId(row.roleId)?.roleName"
                :to="{
                  path: '/system/role-list',
                  query: { 'active-id': row.roleId }
                }"
              >
                <el-link type="primary" :underline="false">{{
                  getRoleInfoByRoleId(row.roleId)?.roleName
                }}</el-link>
              </router-link>
              <el-tag
                v-if="getRoleInfoByRoleId(row.roleId)?.enable === 0"
                style="margin-left: 6px"
                type="danger"
                >已禁用</el-tag
              >
            </template>
          </el-table-column>
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
            label="创建时间"
            sortable="custom"
            prop="createTime"
            width="180"
            :formatter="row => formatTime(row.createTime)"
          />
          <el-table-column
            align="center"
            label="更新时间"
            sortable="custom"
            prop="updateTime"
            width="180"
            :formatter="row => formatTime(row.updateTime)"
          />
          <el-table-column align="center" label="操作" width="200">
            <template #default="{ row }">
              <el-button type="primary" link @click="onAddOrEdit(row)"
                >编辑</el-button
              >
              <el-button type="primary" link @click="onResetPassword(row.id)"
                >修改密码</el-button
              >
              <el-button type="danger" link @click="onDel(row.id)"
                >删除</el-button
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
import { defineComponent, ref, reactive, toRef, toRefs, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { Searchs, SearchsItem } from '@/components/Searchs/index'
import AddOrEditAccountDrawer from './components/AddOrEditAccountDrawer.vue'
import {
  getList,
  changeStatus,
  batchDel,
  delAccount,
  resetPassword
} from '@/api/system/account'
import { getList as fetchRoleList } from '@/api/system/role'
import { formatTime } from '@/utils/time'
import type {
  listItemType,
  IGetListParams
} from '@/api/system/model/accountModel'
import { useRole } from './hooks/useRole'
import type { listItemType as roleItemType } from '@/api/system/model/role'

export default defineComponent({
  name: 'system_accountList',
  components: { PageContainer, Searchs, SearchsItem, AddOrEditAccountDrawer },
  setup() {
    const addOrEditAccountDrawerRef =
      ref<InstanceType<typeof AddOrEditAccountDrawer>>()

    const state = reactive<{
      listQuery: IGetListParams
      total: number
      listLoading: boolean
      tableData: listItemType[]
      selectedRow: listItemType[]
      roleList: roleItemType[]
    }>({
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        username: '',
        roleId: undefined,
        orderProp: '',
        orderSeq: ''
      },
      total: 0,
      listLoading: false,
      tableData: [],
      selectedRow: [],
      roleList: []
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

    // 获取角色列表
    const getRoleList = async () => {
      const { data } = await fetchRoleList()
      state.roleList = data
    }

    const { getRoleInfoByRoleId } = useRole(toRef(state, 'roleList'))

    // 添加/编辑账号
    const onAddOrEdit = (row?: listItemType) => {
      addOrEditAccountDrawerRef.value.show(row)
    }

    // 表格排序
    const onSortChange = ({ prop, order }) => {
      if (!order) {
        // 取消排序
        state.listQuery.orderProp = ''
        state.listQuery.orderSeq = ''
      }
      if (order === 'ascending') {
        // 升序
        state.listQuery.orderProp = prop
        state.listQuery.orderSeq = 'asc'
      }
      if (order === 'descending') {
        // 降序
        state.listQuery.orderProp = prop
        state.listQuery.orderSeq = 'desc'
      }
      fetchData({ pageNo: 1 })
    }

    const onEnableChange = async (row: listItemType) => {
      const enable = row.enable
      const curEnable = enable ? 0 : 1
      await ElMessageBox.confirm(
        `是否确定${curEnable ? '启用' : '禁用'}该账号？`,
        '提示'
      )
      const { message } = await changeStatus(row.id, curEnable)
      row.enable = curEnable
      ElMessage.success(message)
    }

    // 批量删除
    const onBatchDel = async () => {
      const idList = state.selectedRow.map(item => item.id)
      if (idList.length < 1) {
        ElMessage.error('请先选择要删除的账号！')
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
      const { message } = await delAccount(id)
      ElMessage.success(message)
      fetchData()
    }

    // 修改密码
    const onResetPassword = async (id: listItemType['id']) => {
      const { value: password } = await ElMessageBox.prompt(
        '请输入新密码：',
        '提示',
        {
          inputPattern: /.+/,
          inputErrorMessage: '密码不能为空'
        }
      )
      const { message } = await resetPassword({ id, password })
      ElMessage.success(message)
    }

    onMounted(() => {
      fetchData()
      getRoleList()
    })

    return {
      ...toRefs(state),
      addOrEditAccountDrawerRef,
      fetchData,
      onAddOrEdit,
      getRoleInfoByRoleId,
      formatTime,
      onSortChange,
      onEnableChange,
      onBatchDel,
      onDel,
      onResetPassword,
      Plus,
      Delete
    }
  }
})
</script>
