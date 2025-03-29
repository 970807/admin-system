<template>
  <el-form-item>
    <slot />
  </el-form-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'SearchsItem' })
</script>
<script lang="ts" setup></script>

<style lang="scss" scoped>
:deep() {
  .el-input {
    width: 200px;
  }
}
</style>
