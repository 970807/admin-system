<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑栏位' : '添加栏位'"
    :size="700"
    destroy-on-close
    @closed="onClose"
  >
    <template #default>
      <el-form
        ref="formRef"
        :model="inputForm"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item label="栏位名称：" prop="columnName">
          <el-input
            v-model="inputForm.columnName"
            placeholder="请输入栏位名称"
            clearable
            show-word-limit
            maxlength="80"
          />
        </el-form-item>
        <el-form-item label="排序值：" prop="sortNo">
          <el-input-number v-model="inputForm.sortNo" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="立即启用：" prop="available">
          <el-switch
            v-model="inputForm.available"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="onSave"
        >保存</el-button
      >
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  getHomeColumnDetail,
  addHomeColumn,
  editHomeColumn
} from '@/api/meishijie/homeColumn'

const emit = defineEmits(['refresh'])

const formRef = ref<FormInstance>()

interface InputForm {
  id?: string // 主键id
  columnName: string // 栏位名称
  available: 1 | 0 // 立即启用 1:是 0:否
  sortNo: number // 排序值
}

const getDefaultInputForm = (): InputForm => ({
  columnName: '',
  available: 1,
  sortNo: 0
})

const state = reactive<{
  visible: boolean
  inputForm: InputForm
  btnLoading: boolean
}>({
  visible: false,
  inputForm: getDefaultInputForm(),
  btnLoading: false
})

const { visible, inputForm, btnLoading } = toRefs(state)

const rules = reactive<FormRules>({
  columnName: [
    { required: true, message: '请输入栏位名称', trigger: ['blur', 'change'] }
  ],
  sortNo: [
    {
      required: true,
      type: 'integer',
      message: '请输入排序值',
      trigger: ['blur', 'change']
    }
  ]
})

// 是否编辑操作 true: 编辑 false: 新增
const isEdit = computed(() => typeof inputForm.value.id !== 'undefined')

/**
 * 打开抽屉
 * @param id 栏位id，编辑栏位时需要传
 */
const show = (id?: string) => {
  visible.value = true

  if (id) {
    inputForm.value.id = id
    getDetail(id)
  }
}

/**
 * 数据回显
 * @param id 栏位id
 */
const getDetail = (id: string) => {
  getHomeColumnDetail(id).then(res => {
    console.log('de', res)
    inputForm.value = res.data
  })
}

// 关闭抽屉
const onClose = () => {
  visible.value = false
  // 重置数据
  inputForm.value = getDefaultInputForm()
}

// 保存
const onSave = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    btnLoading.value = true
    ;(isEdit.value ? editHomeColumn : addHomeColumn)(
      inputForm.value as Required<InputForm>
    )
      .then(res => {
        ElMessage.success(res.message)
        emit('refresh')
        onClose()
      })
      .finally(() => (btnLoading.value = false))
  })
}

defineExpose({ show })
</script>
