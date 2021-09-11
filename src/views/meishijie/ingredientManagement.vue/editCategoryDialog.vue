<template>
  <el-dialog
    title="添加食材分类"
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
export default {
  name: 'MeishijieIngredientManagementEditCategoryDialog',
  data() {
    return {
      isDialogVisible: false,
      btnLoading: false,
      model: {
        categoryName: ''
      },
      rules: {
        categoryName: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    show() {
      this.$refs.form && this.$refs.form.clearValidate()
      this.isDialogVisible = true
    },
    dialogClose() {
      this.isDialogVisible = false
      this.model.categoryName = ''
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
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
