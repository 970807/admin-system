<script lang="ts" setup>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { importFromHtmlStr } from '@/api/meishijie/recipe'

const emit = defineEmits(['refresh'])

const state = reactive<{
  visible: boolean
  htmlStr: string
  btnLoading: boolean
}>({
  visible: false,
  htmlStr: '',
  btnLoading: false
})

const { visible, htmlStr, btnLoading } = toRefs(state)

const show = () => {
  visible.value = true
}

const onClose = () => {
  visible.value = false
}

const onConfirm = () => {
  btnLoading.value = true
  importFromHtmlStr({ htmlStr: htmlStr.value })
    .then(res => {
      ElMessage.success(res.message)
      emit('refresh')
      onClose()
    })
    .finally(() => (btnLoading.value = false))
}

defineExpose({ show })
</script>

<template>
  <el-dialog
    title="html导入菜谱"
    :close-on-click-modal="false"
    v-model="visible"
    @closed="onClose"
  >
    <template #default>
      <el-input
        v-model="htmlStr"
        type="textarea"
        :rows="10"
        placeholder="请输入html字符串"
      />
    </template>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="onConfirm"
        >确定</el-button
      >
    </template>
  </el-dialog>
</template>
