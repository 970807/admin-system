<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.categoryName" style="width: 220px" placeholder="请输入分类名称" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加分类</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center"
      />
      <el-table-column label="分类名称" align="center" />
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
    <EditCategoryDialog ref="editCategoryDialog" />
  </div>
</template>

<script>
import EditCategoryDialog from './editCategoryDialog'

export default {
  name: 'MeishijieIngredientManagementCategoryList',
  components: {
    EditCategoryDialog
  },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 10,
        categoryName: ''
      },
      listLoading: false,
      list: [],
      total: 0
    }
  },
  methods: {
    getList() {

    },
    handleAdd() {
      this.$refs.editCategoryDialog.show()
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
    }
  }
}
</script>
