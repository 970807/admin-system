<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch
        v-model="dataTheme"
        inline-prompt
        :active-icon="dayIcon"
        :inactive-icon="darkIcon"
        @change="dataThemeChange"
      />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <Motion :delay="100">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: ['blur', 'change']
                  }
                ]"
                prop="username"
              >
                <el-input
                  clearable
                  v-model="ruleForm.username"
                  placeholder="账号"
                  :prefix-icon="useRenderIcon(User)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input
                  clearable
                  show-password
                  v-model="ruleForm.password"
                  placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)"
                />
              </el-form-item>
            </Motion>

            <Motion :delay="200">
              <el-form-item
                :rules="[
                  {
                    required: true,
                    message: '请输入验证码',
                    trigger: ['blur', 'change']
                  }
                ]"
                prop="captchaText"
              >
                <div style="display: flex; align-items: flex-end">
                  <el-input
                    v-model="ruleForm.captchaText"
                    maxlength="4"
                    clearable
                    placeholder="验证码"
                  />
                  <div
                    @click="fetchCaptcha"
                    ref="captchaRef"
                    style="
                      margin-left: 20px;
                      width: 150px;
                      height: 50px;
                      cursor: pointer;
                    "
                  />
                </div>
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button
                class="w-full mt-4"
                size="default"
                type="primary"
                :loading="loading"
                @click="onLogin(ruleFormRef)"
              >
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Motion from './utils/motion'
import { useRouter } from 'vue-router'
import { message } from '@/utils/message'
import { loginRules } from './utils/rule'
import { initRouter } from '@/router/utils'
import { useNav } from '@/layout/hooks/useNav'
import type { FormInstance } from 'element-plus'
import { useLayout } from '@/layout/hooks/useLayout'
import { useUserStoreHook } from '@/store/modules/user'
import { bg, avatar, illustration } from './utils/static'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from 'vue'
import { useDataThemeChange } from '@/layout/hooks/useDataThemeChange'
import { getRsaPublicKey, encrypt } from '@/utils/encrypt'
import { getCaptcha } from '@/api/system/common'
import dayIcon from '@/assets/svg/day.svg?component'
import darkIcon from '@/assets/svg/dark.svg?component'
import Lock from '@iconify-icons/ri/lock-fill'
import User from '@iconify-icons/ri/user-3-fill'

defineOptions({
  name: 'Login'
})
const router = useRouter()
const loading = ref(false)
const ruleFormRef = ref<FormInstance>()

const { initStorage } = useLayout()
initStorage()

const { dataTheme, dataThemeChange } = useDataThemeChange()
dataThemeChange()
const { title } = useNav()

// 验证码ref
const captchaRef = ref<HTMLDivElement>()

const ruleForm = reactive({
  username: import.meta.env.DEV ? 'admin' : '',
  password: import.meta.env.DEV ? '123456' : '',
  captchaText: '',
  // 接收的服务器captchaCode字段，再回传给服务器即可
  captchaCode: ''
})

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate()

  const params = { ...ruleForm }
  // 密码使用rsa加密
  params.password = await encrypt(params.password)

  loading.value = true
  useUserStoreHook()
    .loginByUsername(params)
    .then(() => {
      // 获取后端路由
      initRouter().then(() => {
        router.push('/')
        message('登录成功', { type: 'success' })
      })
    })
    .finally(() => (loading.value = false))
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === 'Enter') {
    onLogin(ruleFormRef.value)
  }
}

// 获取验证码
const fetchCaptcha = async () => {
  const {
    data: { captchaSvg, captchaCode }
  } = await getCaptcha()
  captchaRef.value.innerHTML = captchaSvg
  ruleForm.captchaCode = captchaCode
}

onMounted(() => {
  fetchCaptcha()
  getRsaPublicKey()
  window.document.addEventListener('keypress', onkeypress)
})

onBeforeUnmount(() => {
  window.document.removeEventListener('keypress', onkeypress)
})
</script>

<style scoped>
@import url('@/style/login.css');
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
