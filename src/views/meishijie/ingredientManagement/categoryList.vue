<template>
  <div>
    <div class="filter-container">
      <el-input v-model="listQuery.categoryName" style="width: 220px" placeholder="请输入分类名称" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加分类</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete">批量删除</el-button>
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
      <el-table-column label="分类名称" align="center" prop="categoryName" />
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
    <EditCategoryDialog ref="editCategoryDialog" @finish="getList" />
  </div>
</template>

<script>
import { getCategoryList, batchDeleteCategory } from '@/api/meishijie/ingredient'
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
      total: 0,
      multiSelection: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCategoryList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalCount
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAdd() {
      this.$refs.editCategoryDialog.show()
    },
    handleEdit({id, categoryName}) {
      this.$refs.editCategoryDialog.show({id, categoryName})
    },
    handleBatchDelete() {
      if (this.multiSelection.length === 0) {
        this.$message('请选择要删除的分类')
        return
      }
      this.$confirm('是否批量删除?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const idList = this.multiSelection.map((item) => item.id)
          this.listLoading = true
          batchDeleteCategory({idList}).then(res => {
            this.$message.success(res.message)
            this.getList()
          }).catch(() => {
            this.listLoading = false
          })
        })
        .catch(() => {
          this.$message.info('已取消!')
        })
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
