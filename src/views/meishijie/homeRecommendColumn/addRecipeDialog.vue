<template>
  <el-dialog
    title="添加菜谱"
    :close-on-click-modal="false"
    top="4vh"
    :visible.sync="isDialogVisible"
    @closed="dialogClose"
  >
    <div class="filter-container">
      <el-input v-model="listQuery.recipeName" style="width: 220px" placeholder="请输入菜谱名称" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      height="350"
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
      <el-table-column label="菜谱名称" align="center" prop="recipeName" />
      <el-table-column label="操作" align="center" width="130">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleSelectRecipeItem(scope.row)"
          >选择</el-button>
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
  </el-dialog>
</template>

<script>
import {getRecipeList} from '@/api/meishijie/recipe'

export default {
  name: 'MeishijieHomeRecommendColumnAddRecipeDialog',
  data() {
    return {
      isDialogVisible: false,
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
    show() {
      this.getList()
      this.isDialogVisible = true
    },
    dialogClose() {
      this.isDialogVisible = false
    },
    getList() {
      this.listLoading = true
      getRecipeList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalCount
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleSelectRecipeItem({id, recipeName}) {
      this.$emit('finish', [{id, recipeName, sort: 0}])
      this.dialogClose()
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
