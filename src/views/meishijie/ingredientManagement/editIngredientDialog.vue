<template>
  <el-dialog
    :title="`${isEdit?'修改':'添加'}食材`"
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
      <el-form-item label="食材名称" prop="ingredientName">
        <el-input
          v-model="model.ingredientName"
          placeholder="请输入食材名称"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="食材分类" prop="categoryId">
        <el-select v-model="model.categoryId" filterable clearable>
          <el-option
            v-for="item in allCategoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <footer>
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import { addIngredient, editIngredient } from '@/api/meishijie/ingredient'

export default {
  name: 'MeishijieIngredientManagementEditCategoryDialog',
  props: {
    allCategoryList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isEdit: false,
      isDialogVisible: false,
      btnLoading: false,
      model: this.getDefaultModel(),
      rules: {
        ingredientName: [
          { required: true, message: '请输入食材名称', trigger: ['blur', 'change'] }
        ],
        categoryId: [
          { required: true, message: '请选择食材分类', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    getDefaultModel() {
      return {
        ingredientName: '',
        categoryId: undefined
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
          res = editIngredient(this.model)
        } else {
          res = addIngredient(this.model)
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
