<script lang="ts">
import { defineComponent, ref, reactive, computed, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { existRoleName } from '@/api/system/role'
import { debounce } from '@/utils/tools'
import { addRole, editRole } from '@/api/system/role'
import type { FormInstance, FormRules } from 'element-plus'

interface IFormData {
  roleName: string
  enable: 0 | 1
}

export default defineComponent({
  emits: ['refresh'],
  setup(props, ctx) {
    const getDefaultFormData = (): IFormData => ({
      roleName: '',
      enable: 1
    })

    // 编辑回显的角色名，用于校验角色名是否重复
    let echoRoleName = ''

    const state = reactive<{
      id?: number
      visible: boolean
      formData: IFormData
      btnLoading: boolean
    }>({
      id: undefined,
      visible: false,
      formData: getDefaultFormData(),
      btnLoading: false
    })

    const isEdit = computed(() => typeof state.id === 'number')

    const formRef = ref<FormInstance>()
    const formRules = reactive<FormRules>({
      roleName: [
        {
          required: true,
          message: '请输入角色名',
          trigger: ['change', 'blur']
        },
        {
          trigger: ['change', 'blur'],
          validator: debounce((rule, value, callback) => {
            if (isEdit.value && state.formData.roleName === echoRoleName) {
              // 不需要校验角色名是否重复
              callback()
              return
            }
            existRoleName({ roleName: value })
              .then(res => {
                const isExist = res.data
                if (isExist) {
                  callback(new Error('角色名已存在'))
                } else {
                  callback()
                }
              })
              .catch((err: Error) => {
                console.error(err)
                callback(new Error('角色名校验失败'))
              })
          }, 500)
        }
      ]
    })

    const show = (data?: Partial<IFormData & { id: number }>) => {
      if (data) {
        // 数据回显
        Object.keys(state.formData).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(data, key))
            state.formData[key] = data[key]
        })
        if (typeof data.id == 'number') state.id = data.id
      }
      echoRoleName = data?.roleName || ''
      state.visible = true
    }

    const onClose = () => {
      state.id = undefined
      state.visible = false
      state.formData = getDefaultFormData()
      echoRoleName = ''
    }

    const save = async () => {
      state.btnLoading = true
      try {
        await formRef.value.validate()
      } catch {
        state.btnLoading = false
        return
      }
      let res: ReturnType<typeof addRole> | ReturnType<typeof editRole>
      if (isEdit.value) {
        // 编辑角色
        res = editRole(state.id, state.formData)
      } else {
        // 添加角色
        res = addRole(state.formData)
      }
      res
        .then(res => {
          ElMessage.success(res.message)
          onClose()
          ctx.emit('refresh')
        })
        .finally(() => (state.btnLoading = false))
    }

    return {
      ...toRefs(state),
      formRef,
      formRules,
      isEdit,
      show,
      onClose,
      save
    }
  }
})
</script>

<template>
  <el-drawer
    v-model="visible"
    destroy-on-close
    :title="`${isEdit ? '编辑角色' : '添加角色'}`"
  >
    <el-form
      :model="formData"
      :rules="formRules"
      ref="formRef"
      label-width="auto"
    >
      <el-form-item label="角色名" prop="roleName">
        <el-input
          v-model="formData.roleName"
          placeholder="请输入角色名"
          maxlength="10"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="是否启用" required>
        <el-switch
          v-model="formData.enable"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="save"
        >保存</el-button
      >
    </template>
  </el-drawer>
</template>
