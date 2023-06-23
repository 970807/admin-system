<script lang="ts" setup>
import {
  ref,
  reactive,
  toRefs,
  defineEmits,
  defineExpose,
  watch,
  computed
} from 'vue'
import { ElMessageBox } from 'element-plus'
import { addOrEditAuth } from '@/api/system/auth'
import { AUTH_TYPE_EM, AUTH_TYPE_ARR } from '../dataDict'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { ValueOf } from 'type-fest'

interface FormData {
  id?: number
  parentId: number | null
  name: string
  authMarker: string
  menuName: string
  menuPath: string
  menuIcon: string
  redirect: string
  cpnPath: string
  authType: 0 | 1
  sortNo: number
  remark: string
}

interface Options {
  drawerTitle: string
  disableMenuAuthType: boolean
  disableButtonAuthType: boolean
  buttonAuthTypeSelectTip?: string
  readMode?: boolean
}

const emit = defineEmits<{
  (e: 'refresh')
}>()

const formRef = ref<FormInstance>()

const getDefaultFormData = (): FormData => ({
  id: undefined,
  parentId: null,
  // 名称
  name: '',
  // 权限标识
  authMarker: '',
  // 菜单name
  menuName: '',
  // 菜单路径
  menuPath: '',
  // 菜单icon
  menuIcon: '',
  // 重定向路径
  redirect: '',
  // 组件路径
  cpnPath: '',
  // 权限类型
  authType: AUTH_TYPE_EM.MENU.value,
  // 排序值
  sortNo: 0,
  // 备注
  remark: ''
})

const getDefaultOptions = (): Options => ({
  // 抽屉标题
  drawerTitle: '',
  // 是否禁用菜单类型
  disableMenuAuthType: false,
  // 是否禁用按钮类型
  disableButtonAuthType: false,
  // 选择按钮权限类型弹出的提示
  buttonAuthTypeSelectTip: '',
  // true：查看(只能看，不能修改) fale：编辑
  readMode: false
})

const state = reactive<{
  visible: boolean
  formData: FormData
  btnLoading: boolean
  options: Options
}>({
  visible: false,
  formData: getDefaultFormData(),
  btnLoading: false,
  options: getDefaultOptions()
})

const { visible, formData, btnLoading, options } = toRefs(state)

const rules = computed<FormRules>(() => ({
  name: [
    { required: true, message: '请输入名称', trigger: ['blur', 'change'] }
  ],
  authMarker: [
    { required: true, message: '请输入权限标识', trigger: ['blur', 'change'] }
  ],
  authType: [
    { required: true, message: '请选择权限标识', trigger: ['bulr', 'change'] }
  ],
  menuPath: [
    { required: true, message: '请输入菜单路径', trigger: ['blur', 'change'] }
  ],
  cpnPath: [
    {
      required: !!state.formData.parentId,
      message: '请输入组件路径',
      trigger: ['blur', 'change']
    }
  ],
  sortNo: [
    { required: true, message: '请输入排序值', trigger: ['blur', 'change'] }
  ]
}))

const setOptions = (options: Partial<Options>) => {
  Object.keys(options).forEach(key => {
    if (key in state.options) state.options[key] = options[key]
  })
}

const show = (row?: any, options?: Partial<Options>) => {
  if (row)
    Object.keys(state.formData).forEach(key => {
      if (key in row) state.formData[key] = row[key]
    })
  state.visible = true
  if (options) setOptions(options)
}

const onClose = () => {
  state.visible = false
  state.formData = getDefaultFormData()
  state.options = getDefaultOptions()
}

const save = async () => {
  state.btnLoading = true
  try {
    await formRef.value.validate()
    const { message } = await addOrEditAuth(state.formData)
    ElMessage.success(message)
    onClose()
    emit('refresh')
  } finally {
    state.btnLoading = false
  }
}

const handleAuthTypeDisabled = (
  authTypeValue: ValueOf<typeof AUTH_TYPE_EM>['value']
) => {
  if (
    state.options.disableMenuAuthType &&
    authTypeValue === AUTH_TYPE_EM.MENU.value
  )
    return true
  if (
    state.options.disableButtonAuthType &&
    authTypeValue === AUTH_TYPE_EM.BUTTON.value
  )
    return true
  return false
}

watch(
  () => state.formData.authType,
  (newVal, oldVal) => {
    const buttonAuthTypeSelectTip = options.value.buttonAuthTypeSelectTip
    if (buttonAuthTypeSelectTip && newVal === AUTH_TYPE_EM.BUTTON.value) {
      ElMessageBox.confirm(buttonAuthTypeSelectTip, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        state.formData.authType = oldVal
      })
    }
  }
)

defineExpose({ show })
</script>

<template>
  <el-drawer v-model="visible" destroy-on-close :title="options.drawerTitle">
    <template #default>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="auto"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="formData.name"
            maxlength="10"
            show-word-limit
            placeholder="请输入名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="权限标识" prop="authMarker">
          <el-input
            v-model="formData.authMarker"
            maxlength="30"
            show-word-limit
            placeholder="请输入权限标识"
            clearable
          />
        </el-form-item>
        <el-form-item label="权限类型" prop="authType">
          <el-radio-group v-model="formData.authType">
            <el-radio-button
              v-for="item in AUTH_TYPE_ARR"
              :key="item.value"
              :label="item.value"
              :disabled="handleAuthTypeDisabled(item.value)"
              >{{ item.name }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.authType === AUTH_TYPE_EM.MENU.value">
          <el-form-item label="菜单name">
            <el-input
              v-model="formData.menuName"
              maxlength="50"
              show-word-limit
              placeholder="请输入菜单name"
              clearable
            />
          </el-form-item>
          <el-form-item label="菜单路径" prop="menuPath">
            <el-input
              v-model="formData.menuPath"
              maxlength="50"
              show-word-limit
              placeholder="请输入菜单路径"
              clearable
            />
          </el-form-item>
          <el-form-item label="菜单icon" prop="menuIcon">
            <el-input
              v-model="formData.menuIcon"
              maxlength="20"
              show-word-limit
              placeholder="请输入菜单icon"
              clearable
            />
          </el-form-item>
          <el-form-item label="重定向" prop="redirect">
            <el-input
              v-model="formData.redirect"
              maxlength="50"
              show-word-limit
              placeholder="请输入重定向路径"
              clearable
            />
          </el-form-item>
          <el-form-item label="组件路径" prop="cpnPath">
            <el-input
              v-model="formData.cpnPath"
              maxlength="50"
              show-word-limit
              placeholder="请输入组件路径"
              clearable
            />
          </el-form-item>
        </template>
        <el-form-item label="排序值" prop="sortNo">
          <el-input-number v-model="formData.sortNo" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            clearable
            maxlength="50"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <template v-if="options.readMode">
        <el-button @click="onClose">关闭</el-button>
      </template>
      <template v-else>
        <el-button @click="onClose">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="save"
          >保存</el-button
        >
      </template>
    </template>
  </el-drawer>
</template>
