<script lang="ts">
import { defineComponent, ref, reactive, toRefs, onMounted } from 'vue'
import { Searchs } from '@/components/Searchs/index'
import { Plus } from '@element-plus/icons-vue'
import PageContainer from '@/components/PageContainer/index.vue'
import { getList } from '@/api/system/role'
import { formatTime } from '@/utils/time'
import AddOrEditRoleDrawer from './components/AddOrEditRoleDrawer.vue'
import type { listItemType } from '@/api/system/model/role'

export default defineComponent({
  name: 'system_roleList',
  components: { PageContainer, Searchs, AddOrEditRoleDrawer },
  setup() {
    const addOrEditRoleDrawerRef =
      ref<InstanceType<typeof AddOrEditRoleDrawer>>()

    const state = reactive<{
      listLoading: boolean
      tableData: listItemType[]
    }>({
      listLoading: false,
      tableData: []
    })

    const fetchData = () => {
      state.listLoading = true
      getList()
        .then(res => {
          state.tableData = res.data
        })
        .finally(() => (state.listLoading = false))
    }

    // 添加/编辑角色
    const onAddOrEdit = (data?: listItemType) => {
      addOrEditRoleDrawerRef.value.show(data)
    }

    onMounted(() => {
      fetchData()
    })

    return {
      ...toRefs(state),
      fetchData,
      addOrEditRoleDrawerRef,
      onAddOrEdit,
      formatTime,
      Plus
    }
  }
})
</script>

<template>
  <div class="role-list">
    <AddOrEditRoleDrawer ref="addOrEditRoleDrawerRef" @refresh="fetchData" />
    <PageContainer>
      <template #header>
        <Searchs :showSearchBtn="false">
          <template #btns>
            <el-button type="primary" :icon="Plus" @click="onAddOrEdit()"
              >添加角色</el-button
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
          <el-table-column align="center" prop="roleName" label="角色名" />
          <el-table-column align="center" label="是否启用">
            <template #default="{ row }">
              <el-switch
                :model-value="row.enable"
                :active-value="1"
                :inactive-value="0"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template #default="{ row }">{{
              formatTime(row.createTime)
            }}</template>
          </el-table-column>
          <el-table-column align="center" label="更新时间">
            <template #default="{ row }">{{
              formatTime(row.updateTime)
            }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="{ row }">
              <el-button type="primary" link @click="onAddOrEdit(row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
    </PageContainer>
  </div>
</template>
