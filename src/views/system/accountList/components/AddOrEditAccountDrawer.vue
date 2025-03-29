<!-- 添加/编辑账号抽屉 -->
<template>
  <el-drawer
    v-model="visible"
    destroy-on-close
    :title="`${isEdit ? '编辑账号' : '添加账号'}`"
    @closed="onClose"
  >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="auto">
      <el-form-item label="账号" prop="username">
        <el-input
          v-model="formData.username"
          placeholder="请输入账号"
          maxlength="20"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item v-if="!isEdit" label="密码" prop="password">
        <el-input
          v-model="formData.password"
          placeholder="请输入密码"
          maxlength="20"
          show-word-limit
          show-password
          clearable
        />
      </el-form-item>
      <el-form-item label="头像url">
        <el-input
          v-model="formData.avatar"
          placeholder="请输入头像url"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <el-select
          style="width: 100%"
          v-model="formData.roleId"
          filterable
          clearable
          @clear="formData.roleId = undefined"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
            :label="item.roleName"
          />
        </el-select>
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

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  computed,
  toRefs,
  type PropType
} from 'vue'
import { ElMessage } from 'element-plus'
import { addAccount, editAccount, isExistAccount } from '@/api/system/account'
import { debounce } from '@/utils/tools'
import type { FormInstance, FormRules } from 'element-plus'
import type { listItemType } from '@/api/system/model/accountModel'
import type { listItemType as roleItemType } from '@/api/system/model/role'

interface IFormData {
  username: string
  password: string
  avatar: string
  roleId?: number
  enable: 0 | 1
}

export default defineComponent({
  props: {
    roleList: {
      required: true,
      type: Array as PropType<roleItemType[]>
    }
  },
  emits: ['refresh'],
  setup(props, ctx) {
    const formRef = ref<FormInstance>()

    const getDefaultFormData = (): IFormData => ({
      // 账号
      username: '',
      // 密码
      password: '',
      // 头像url
      avatar: '',
      // 角色id
      roleId: undefined,
      // 是否启用
      enable: 1
    })

    const state = reactive<{
      visible: boolean
      id?: number
      formData: IFormData
      btnLoading: boolean
    }>({
      visible: false,
      // 账号id 编辑时才有
      id: undefined,
      formData: getDefaultFormData(),
      btnLoading: false
    })

    // 编辑回显的账号，用于校验账号是否重复
    let echoUsername = ''

    const rules = ref<FormRules>({
      username: [
        {
          required: true,
          trigger: ['blur', 'change'],
          validator: debounce((rule, value, callback) => {
            if (!value) {
              return callback(new Error('请输入账号'))
            }
            if (isEdit.value && value === echoUsername) {
              // 不需要校验角色名是否重复
              callback()
              return
            }
            isExistAccount({ username: value })
              .then(res => {
                const isExist = res.data
                if (isExist) {
                  callback(new Error('账号已存在'))
                } else {
                  callback()
                }
              })
              .catch((err: Error) => {
                console.error(err)
                callback(new Error('账号校验失败'))
              })
          }, 500)
        }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: ['blur', 'change'] }
      ],
      roleId: [
        {
          required: true,
          message: '请选择角色',
          type: 'integer',
          trigger: ['blur', 'change']
        }
      ]
    })

    const isEdit = computed(() => typeof state.id === 'number')

    const show = (row?: listItemType) => {
      state.visible = true
      if (row) {
        // 编辑账号
        Object.keys(state.formData).forEach(key => {
          if (key in row) state.formData[key] = row[key]
        })
        echoUsername = row?.username || ''
        state.id = row.id
      }
    }

    const onClose = () => {
      state.visible = false
      state.id = undefined
      state.formData = getDefaultFormData()
      echoUsername = ''
    }

    const save = async () => {
      state.btnLoading = true
      try {
        await formRef.value.validate()
      } catch {
        state.btnLoading = false
        return
      }
      let res: ReturnType<typeof addAccount> | ReturnType<typeof editAccount>
      if (isEdit.value) {
        // 编辑账号
        res = editAccount(
          state.id,
          state.formData as Omit<Required<IFormData>, 'password'>
        )
      } else {
        // 添加账号
        res = addAccount(state.formData as Required<IFormData>)
      }
      res
        .then(res => {
          ElMessage.success(res.message)
          onClose()
          ctx.emit('refresh', isEdit.value ? null : { pageNo: 1 })
        })
        .finally(() => (state.btnLoading = false))
    }

    return {
      ...toRefs(state),
      formRef,
      rules,
      isEdit,
      show,
      onClose,
      save
    }
  }
})
</script>
