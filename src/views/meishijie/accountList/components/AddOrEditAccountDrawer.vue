<script lang="ts" setup>
import { ref, reactive, toRefs, computed, defineExpose } from 'vue'
import { Picture } from '@element-plus/icons-vue'
import ImageViewer from '@/components/ImageViewer/index.vue'
import type { FormInstance, FormItemInstance, FormRules } from 'element-plus'
import type { listItemType } from '@/api/meishijie/model/accountListModel'

const formRef = ref<FormInstance>()
const accountRef = ref<FormItemInstance>()
const phoneRef = ref<FormItemInstance>()
const avatarViewRef = ref<any>()

const getDefaultFormData = () => ({
  id: undefined,
  account: '',
  phone: '',
  password: '',
  nickname: '',
  avatar: ''
})

const state = reactive({
  visible: false,
  formData: getDefaultFormData()
})

const { visible, formData } = toRefs(state)

const accountAndPhoneValidator = (rule, value, callback) => {
  if (!formData.value.account && !formData.value.phone) {
    callback(new Error('账号和手机号必须填写一个'))
    return
  }
  if (rule.field !== 'account') accountRef.value.clearValidate()
  if (rule.field !== 'phone') phoneRef.value.clearValidate()
  callback()
}
const rules = reactive<FormRules>({
  account: [
    {
      trigger: ['blur', 'change'],
      validator: accountAndPhoneValidator
    }
  ],
  phone: [
    {
      trigger: ['blur', 'change'],
      validator: accountAndPhoneValidator
    }
  ],
  password: [
    {
      trigger: ['blur', 'change'],
      validator(rule, value, callback) {
        if (!value) return callback(new Error('请输入密码'))
        callback()
      }
    }
  ]
})

// 是否编辑操作 true: 编辑 false: 新增
const isEdit = computed(() => typeof formData.value.id !== 'undefined')

const show = (row?: listItemType) => {
  if (row) {
    // 数据回显
    Object.keys(formData.value).forEach((key: string) => {
      if (key in row) formData.value[key] = row[key]
    })
  }

  visible.value = true
}

const onClose = () => {
  visible.value = false
  // 重置数据
  formData.value = getDefaultFormData()
}

// 保存
const save = async () => {
  await formRef.value.validate()
}

defineExpose({ show })
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑账号' : '添加账号'"
    :size="500"
    destroy-on-close
    @closed="onClose"
  >
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="70px">
      <el-form-item ref="accountRef" label="账号" prop="account">
        <el-input
          v-model="formData.account"
          clearable
          show-word-limit
          maxlength="255"
        />
      </el-form-item>
      <el-form-item ref="phoneRef" label="手机号" prop="phone">
        <el-input
          v-model="formData.phone"
          clearable
          show-word-limit
          maxlength="255"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="formData.password"
          clearable
          show-word-limit
          maxlength="255"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="formData.nickname"
          clearable
          show-word-limit
          maxlength="255"
        />
      </el-form-item>
      <el-form-item label="头像链接" prop="avatar">
        <ImageViewer ref="avatarViewRef" :url-list="[formData.avatar]" />
        <el-input
          v-model="formData.avatar"
          clearable
          show-word-limit
          maxlength="255"
        >
          <template #append>
            <div
              v-show="formData.avatar"
              class="icon-wrap"
              @click="avatarViewRef.show()"
            >
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
:deep() {
  .el-input-group__append {
    padding: 0;

    .icon-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      cursor: pointer;
    }
  }
}
</style>
