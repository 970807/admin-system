<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.account" style="width: 220px" placeholder="请输入账号" clearable />
      <el-button type="primary" icon="el-icon-search" style="margin-left: 10px" @click="handleFilter">搜索</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="handleAdd">添加账号</el-button>
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
      <el-table-column label="账号" align="center" prop="account" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="头像" align="center" width="140">
        <template v-if="scope.row.avatar" slot-scope="scope">
          <el-image
            style="width:60px;height:60px;"
            :src="scope.row.avatar"
            fit="contain"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="165">
        <template slot-scope="scope">
          <el-button
            type="success"
            icon="el-icon-unlock"
            circle
            size="medium"
            @click="handleEditPassword(scope.row.id)"
          />
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="medium"
            @click="handleEdit(scope.row)"
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
    <EditAccountDialog ref="editAccountDialog" @finish="getList" />
  </div>
</template>

<script>
import { getList, editAccountPassword, deleteAccountById } from '@/api/meishijie/account'
import EditAccountDialog from './editAccountDialog'

export default {
  name: 'MeishijieAccountList',
  components: {
    EditAccountDialog
  },
  data() {
    return {
      listQuery: {
        page: 1,
        pageSize: 10,
        account: ''
      },
      total: 0,
      list: [],
      listLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalCount
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
        console.error(err)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleAdd() {
      this.$refs.editAccountDialog.show()
    },
    handleEdit({ id, account, phone, avatar }) {
      this.$refs.editAccountDialog.show({ id, account, phone, avatar })
    },
    // 修改密码
    handleEditPassword(id) {
      this.$prompt('请输入新密码', '修改密码', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        if (!value) {
          this.$message.error('修改失败，密码不能为空')
          return
        }
        editAccountPassword({ id, password: value }).then(res => {
          this.$message.success(res)
        }).catch(() => {})
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    handleDelete(id) {
      this.$confirm('删除后将无法恢复，是否继续？', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          deleteAccountById({ id }).then(res => {
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

