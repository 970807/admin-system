<template>
  <div class="page-container">
    <header v-if="slots.header">
      <slot name="header" />
    </header>
    <main v-if="slots.default || slots.main">
      <slot v-if="slots.default" />
      <slot name="main" v-else />
    </main>
    <footer v-if="slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'PageContainer' })
</script>
<script lang="ts" setup>
import { useSlots } from 'vue'

const slots = useSlots()
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);
  padding: 16px;
  background: #fff;

  main {
    flex: 1;
    overflow: hidden;
  }

  footer {
    margin-top: 10px;

    :slotted(.el-pagination) {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
