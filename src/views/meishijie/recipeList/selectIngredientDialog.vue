<template>
  <el-dialog
    title="选择食材"
    top="3vh"
    :close-on-click-modal="false"
    :visible.sync="isDialogVisible"
    @closed="dialogClose"
  >
    <div class="filter-container">
      <el-input v-model="listQuery.ingredientName" style="width: 220px" placeholder="请输入食材名称" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      height="60vh"
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
      <el-table-column label="食材名称" align="center" prop="ingredientName" />
      <el-table-column label="食材分类" align="center" :formatter="categoryFormatter" />
      <el-table-column label="操作" align="center" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="confirm(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        :current-page="listQuery.page"
        layout="total, prev, pager, next"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getIngredientList, getAllCategoryList } from '@/api/meishijie/ingredient'
export default {
  name: 'MeishijieRecipeListSelectIngredientDialog',
  data() {
    return {
      isDialogVisible: false,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        ingredientName: ''
      },
      list: [],
      total: 0,
      allCategoryList: [],
      callback: undefined
    }
  },
  created() {
    this.getAllCategoryList()
    this.getList()
  },
  methods: {
    show(callback) {
      this.callback = callback
      this.isDialogVisible = true
    },
    dialogClose() {
      this.isDialogVisible = false
    },
    // 选择食材完成
    confirm({id, ingredientName}) {
      this.callback && this.callback({id, ingredientName})
      this.dialogClose()
    },
    getList() {
      this.listLoading = true
      getIngredientList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalCount
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getAllCategoryList() {
      getAllCategoryList().then(res => {
        this.allCategoryList = res.data.list
      })
    },
    categoryFormatter({categoryId}) {
      let categoryName = ''
      const res = this.allCategoryList.find(item => item.id === categoryId)
      if (res) {
        categoryName = res.categoryName
      }
      return categoryName
    },
    handleFilter() {
      this.listQuery.page = 1
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
