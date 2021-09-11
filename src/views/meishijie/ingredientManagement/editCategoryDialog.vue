<template>
  <el-dialog
    :title="`${isEdit?'修改':'添加'}食材分类`"
    :visible.sync="isDialogVisible"
    @closed="dialogClose"
  >
    <el-form
      ref="form"
      label-position="right"
      label-width="80px"
      :model="model"
      :rules="rules"
    >
      <el-form-item label="分类名称" prop="categoryName">
        <el-input
          v-model="model.categoryName"
          placeholder="请输入分类名称"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>
    <footer>
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { addCategory, editCategory } from '@/api/meishijie/ingredient'

export default {
  name: 'MeishijieIngredientManagementEditCategoryDialog',
  data() {
    return {
      isEdit: false,
      isDialogVisible: false,
      btnLoading: false,
      model: this.getDefaultModel(),
      rules: {
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    getDefaultModel() {
      return {
        categoryName: ''
      }
    },
    show(info) {
      this.isEdit = typeof info === 'object'
      if (this.isEdit) {
        this.model = info
      }
      this.$refs.form && this.$refs.form.clearValidate()
      this.isDialogVisible = true
    },
    dialogClose() {
      this.isDialogVisible = false
      this.model = this.getDefaultModel()
      this.isEdit = false
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.btnLoading = true
        let res
        if (this.isEdit) {
          res = editCategory(this.model)
        } else {
          res = addCategory(this.model)
        }
        res.then(res => {
          this.$message.success(res.message)
          this.$emit('finish')
          this.btnLoading = false
          this.dialogClose()
        }).catch(() => {
          this.btnLoading = false
        })
      })
    }
  }
}
</script>

<style scoped>
  footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
