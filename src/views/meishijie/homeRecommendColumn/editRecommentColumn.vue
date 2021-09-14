<template>
  <div id="app-container">
    <h2 style="padding-left: 15px">{{ isEdit?'修改':'添加' }}推荐栏目</h2>
    <el-form
      ref="form"
      label-position="right"
      label-width="120px"
      :model="model"
      :rules="rules"
    >
      <el-form-item label="栏目标题" prop="columnTitle">
        <el-input
          v-model="model.columnTitle"
          placeholder="请输入栏目标题"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="菜谱显示个数" prop="showRecipeCount">
        <el-input-number
          v-model="model.showRecipeCount"
          :min="0"
          :max="999"
          :precision="0"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="菜谱列表" prop="recipeList">
        <div style="margin-bottom:10px">
          <el-button type="primary" size="medium" @click="handleAddRecipe">添加菜谱</el-button>
          <el-button type="primary" size="medium" @click="setRecipeRandomSort">随机排序值</el-button>
        </div>
        <el-table
          :data="model.recipeList"
          max-height="500"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="菜谱名称" align="center" prop="recipeName" />
          <el-table-column label="排序值" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.sort"
                :min="0"
                :max="999"
                :precision="0"
                size="medium"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="medium"
                @click="handleDeleteRecipeItem(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
    </footer>
    <AddRecipeDialog ref="addRecipeDialog" @finish="handleSelectRecipeFinish" />
  </div>
</template>

<script>
import {addColumn, editColumn, getColumnDetail} from '@/api/meishijie/homeRecommendColumn'
import AddRecipeDialog from './addRecipeDialog'

export default {
  name: 'MeishijieHomeRecommendColumnEditRecommentColumn',
  components: {
    AddRecipeDialog
  },
  data() {
    return {
      isEdit: false,
      isDialogVisible: false,
      btnLoading: false,
      model: {
        columnTitle: '',
        showRecipeCount: 0,
        recipeList: []
      },
      rules: {
        columnTitle: [
          { required: true, message: '请输入栏目标题', trigger: ['blur', 'change'] }
        ],
        showRecipeCount: [
          { required: true, type: 'integer', message: '请输入栏目显示个数', trigger: ['blur', 'change'] }
        ],
        recipeList: [
          { required: true, message: '请添加菜谱', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    const id = this.$route.query.id
    this.isEdit = !!id
    if (this.isEdit) {
      getColumnDetail({id}).then(res => {
        this.model = res.data
      })
    }
  },
  methods: {
    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.btnLoading = true
        let res
        if (this.isEdit) {
          res = editColumn(this.model)
        } else {
          res = addColumn(this.model)
        }
        res.then(res => {
          this.$message.success(res.message)
          this.btnLoading = false
          this.cancel()
        }).catch(() => {
          this.btnLoading = false
        })
      })
    },
    cancel() {
      this.$router.push('/meishijie/home-recommend-column')
    },
    handleAddRecipe() {
      this.$refs.addRecipeDialog.show()
    },
    handleSelectRecipeFinish(recipeList) {
      recipeList = recipeList.filter(item => {
        if (this.model.recipeList.find(item2 => item2.id === item.id)) {
          this.$message.warning(`菜谱${item.recipeName}已在列表中，不能重复添加`)
          return false
        }
        return true
      })
      this.model.recipeList.push(...recipeList)
    },
    handleDeleteRecipeItem(index) {
      this.model.recipeList.splice(index, 1)
    },
    setRecipeRandomSort() {
      const generateRandomNumber = () => {
        return Math.floor(Math.random() * 1000)
      }

      this.model.recipeList.forEach(item => {
        item.sort = generateRandomNumber()
      })
    }
  }
}
</script>

<style scoped>
  footer {
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
  }
</style>
