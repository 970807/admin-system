<template>
  <el-dialog
    title="html导入菜谱"
    :close-on-click-modal="false"
    :visible.sync="isDialogVisible"
    @closed="dialogClose"
  >
    <el-input
      v-model="htmlStr"
      type="textarea"
      :rows="10"
      placeholder="请输入html字符串"
    />
    <footer>
      <el-button @click="dialogClose">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
    </footer>
  </el-dialog>
</template>

<script>
import {importFromHtmlStr} from '@/api/meishijie/recipe'

export default {
  data() {
    return {
      isDialogVisible: false,
      btnLoading: false,
      htmlStr: ''
    }
  },
  methods: {
    confirm() {
      this.btnLoading = true
      importFromHtmlStr({htmlStr: this.htmlStr}).then(res => {
        this.$message.success(res.message)
        this.btnLoading = false
        this.$emit('finish')
        this.dialogClose()
      }).catch(() => {
        this.btnLoading = false
      })
    },
    show() {
      this.isDialogVisible = true
    },
    dialogClose() {
      this.isDialogVisible = false
      this.htmlStr = ''
    }
  }
}
</script>

<style scoped>
  footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
  }
</style>
