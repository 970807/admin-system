<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({ name: 'Searchs' })
</script>

<script lang="ts" setup>
import { defineEmits, useSlots } from 'vue'
import { Search } from '@element-plus/icons-vue'
import SearchsItem from './SearchsItem.vue'

const slots = useSlots()

const emits = defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <div class="searchs">
    <el-form inline>
      <slot />
      <slot name="submit-btn">
        <SearchsItem>
          <el-button type="primary" :icon="Search" @click="emits('submit')"
            >搜索</el-button
          >
        </SearchsItem>
      </slot>

      <SearchsItem v-if="slots.btns">
        <slot name="btns" />
      </SearchsItem>
    </el-form>
  </div>
</template>
