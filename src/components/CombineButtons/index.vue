<!-- 组合按钮 -->
<template>
  <div class="combine-buttons">
    <!-- 只有一个按钮，使用普通按钮 -->
    <el-button
      v-if="props.btnList.length === 1"
      :disabled="props.btnList[0].disabled"
      @click="props.btnList[0].clickFn()"
      >{{ props.btnList[0].name }}</el-button
    >
    <!-- 有多个按钮，使用组合按钮 -->
    <el-dropdown v-else trigger="click" placement="bottom" :teleported="false">
      <template #default>
        <el-button-group>
          <el-button
            plain
            :disabled="props.btnList[0].disabled"
            @click.stop.prevent="props.btnList[0].clickFn()"
            >{{ props.btnList[0].name }}</el-button
          >
          <!-- 图标 -->
          <el-button
            plain
            class="icon-arrow-down-button"
            :icon="ArrowDown"
          ></el-button>
        </el-button-group>
      </template>
      <template #dropdown>
        <el-dropdown-menu v-for="(btn, idx) of btnList.splice(1)" :key="idx">
          <el-dropdown-item
            class="list-menu-item"
            :disabled="btn.disabled"
            @click="btn.clickFn()"
            >{{ btn.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'CombineButtons' })
</script>
<script lang="ts" setup>
import { ArrowDown } from '@element-plus/icons-vue'

const props = defineProps<{
  btnList: Array<{
    name: string // 按钮的名称
    disabled?: boolean // 是否禁用按钮
    clickFn: () => void // 按钮点击视角
  }>
}>()
</script>

<style lang="scss" scoped>
:deep() {
  .el-popper {
    margin-top: -4px !important;

    .el-popper__arrow {
      display: none;
    }
  }

  .list-menu-item {
    justify-content: center !important;
    min-width: 94px !important;
  }
}

.combine-buttons {
  margin-left: 12px;

  .icon-arrow-down-button {
    padding: 8px;
  }
}
</style>
