<template>
  <el-space direction="vertical" size="large">
    <el-tag :style="elStyle" size="large" effect="dark">
      模拟后台根据不同角色返回对应路由（具体参考完整版pure-admin代码）
    </el-tag>
    <el-card shadow="never" :style="elStyle">
      <template #header>
        <div class="card-header">
          <span>当前角色：{{ username }}</span>
        </div>
      </template>
      <el-select v-model="username" @change="onChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-card>
  </el-space>
</template>

<script setup lang="ts">
import { initRouter } from '@/router/utils'
import { storageSession } from '@pureadmin/utils'
import { type CSSProperties, ref, computed } from 'vue'
import { useUserStoreHook } from '@/store/modules/user'
import { usePermissionStoreHook } from '@/store/modules/permission'

defineOptions({
  name: 'PermissionPage'
})

const elStyle = computed((): CSSProperties => {
  return {
    width: '85vw',
    justifyContent: 'start'
  }
})

const username = ref(useUserStoreHook()?.username)

const options = [
  {
    value: 'admin',
    label: '管理员角色'
  },
  {
    value: 'common',
    label: '普通角色'
  }
]

function onChange() {
  useUserStoreHook()
    .loginByUsername({ username: username.value, password: 'admin123' })
    .then(res => {
      if (res.success) {
        storageSession().removeItem('async-routes')
        usePermissionStoreHook().clearAllCachePage()
        initRouter()
      }
    })
}
</script>
