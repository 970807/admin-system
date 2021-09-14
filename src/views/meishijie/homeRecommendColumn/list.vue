<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.columnTitle" style="width: 220px" placeholder="请输入栏目名称" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="getList">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加推荐栏目</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="栏目标题" align="center" prop="columnTitle" />
      <el-table-column label="栏目菜谱数" align="center" prop="columnRecipeCount" />
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="medium"
            @click="handleEdit(scope.row.id)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="medium"
            @click="handleDelete(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {getColumnList, deleteColumn} from '@/api/meishijie/homeRecommendColumn'

export default {
  name: 'MeishijieHomeRecommendList',
  data() {
    return {
      listLoading: false,
      listQuery: {
        columnTitle: ''
      },
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getColumnList(this.listQuery).then(res => {
        this.list = res.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$router.push('/meishijie/edit-recommend-column')
    },
    handleEdit(id) {
      this.$router.push({path: '/meishijie/edit-recommend-column', query: {id}})
    },
    handleDelete(id) {
      this.$confirm('删除后将无法恢复，是否继续？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          deleteColumn({ id }).then(res => {
            this.$message.success(res.message)
            this.getList()
          }).catch(() => {
            this.listLoading = false
          })
        })
        .catch(() => {
          this.$message.info('已取消!')
        })
    }
  }
}
</script>
