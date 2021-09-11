<template>
  <el-dialog
    :title="isEdit ? '编辑账号' : '添加账号'"
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
      <el-form-item label="账号" prop="accountAndPhone">
        <el-input
          v-model="model.account"
          placeholder="请输入账号"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="手机号" prop="accountAndPhone">
        <el-input
          v-model="model.phone"
          placeholder="请输入手机号"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input
          v-model="model.password"
          placeholder="请输入密码"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="头像链接">
        <el-input
          v-model="model.avatar"
          placeholder="请输入头像链接"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <footer>
        <el-button @click="dialogClose">取消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
      </footer>
    </el-form>
  </el-dialog>
</template>

<script>
import { addAccount, editAccount } from '@/api/meishijie/account'
export default {
  name: 'MeishijieEditAccountDialog',
  data() {
    const accountAndPhoneValidator = (rule, value, callback) => {
      if (!this.model.account && !this.model.phone) {
        callback(new Error('账号和手机号必须填写一个'))
        return
      }
      callback()
    }

    const passwordValidator = (rule, value, callback) => {
      if (!this.isEdit && !value) {
        callback(new Error('请输入密码'))
        return
      }
      callback()
    }

    return {
      isEdit: false,
      isDialogVisible: false,
      model: this.getDefaultModel(),
      rules: {
        accountAndPhone: [
          { validator: accountAndPhoneValidator, trigger: ['blur', 'change'] }
        ],
        password: [
          { validator: passwordValidator, trigger: ['blur', 'change'] }
        ]
      },
      btnLoading: false
    }
  },
  methods: {
    getDefaultModel() {
      return {
        account: '',
        phone: '',
        password: '',
        avatar: ''
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
      this.model = this.getDefaultModel()
      this.isDialogVisible = false
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        let res
        if (this.isEdit) {
          // 编辑账号
          res = editAccount(this.model)
        } else {
          // 添加账号
          res = addAccount(this.model)
        }
        this.btnLoading = true
        res.then(result => {
          this.$message.success(result.message)
          this.btnLoading = false
          this.$emit('finish')
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
