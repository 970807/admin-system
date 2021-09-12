<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.recipeName" style="width: 220px" placeholder="请输入菜谱名称" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加菜谱</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="45"
      />
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column label="菜谱名称" align="center" />
      <el-table-column label="操作" align="center" width="130">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="medium"
            @click="handleEdit(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeishijieRecipeManagementIndex',
  data() {
    return {
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        recipeName: ''
      },
      list: [],
      total: 0,
      multiSelection: []
    }
  },
  methods: {
    getList() {

    },
    handleAdd() {
      this.$router.push('/meishijie/edit-recipe')
    },
    handleEdit() {

    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      // 改变每页数量
      this.listQuery.page = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // 改变页码
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multiSelection = val
    }
  }
}
</script>
