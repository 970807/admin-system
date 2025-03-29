<template>
  <div class="searchs">
    <el-form inline>
      <slot />
      <slot v-if="props.showSearchBtn" name="submit-btn">
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
<script lang="ts">
import { defineComponent, defineProps } from 'vue'
export default defineComponent({ name: 'Searchs' })
</script>
<script lang="ts" setup>
import { defineEmits, useSlots } from 'vue'
import { Search } from '@element-plus/icons-vue'
import SearchsItem from './SearchsItem.vue'

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    showSearchBtn?: boolean
  }>(),
  { showSearchBtn: true }
)

const emits = defineEmits<{
  (e: 'submit'): void
}>()
</script>
