<script setup lang="ts">
import path from 'path'
import { getConfig } from '@/config'
import { childrenType } from '../../types'
import { useNav } from '@/layout/hooks/useNav'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'
import { ref, toRaw, PropType, nextTick, computed, CSSProperties } from 'vue'

import ArrowUp from '@iconify-icons/ep/arrow-up'
import EpArrowDown from '@iconify-icons/ep/arrow-down'
import ArrowLeft from '@iconify-icons/ep/arrow-left'
import ArrowRight from '@iconify-icons/ep/arrow-right'

// 仅有一个子菜单时也展示父级
const SHOW_PARENT_ONLY_HAS_ONE_CHILD = true

const { layout, isCollapse, tooltipEffect } = useNav()

const props = defineProps({
  item: {
    type: Object as PropType<childrenType>
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const getExtraIconStyle = computed((): CSSProperties => {
  if (!isCollapse.value) {
    return {
      position: 'absolute',
      right: '10px'
    }
  } else {
    return {
      position: 'static'
    }
  }
})

const getNoDropdownStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    alignItems: 'center'
  }
})

const getDivStyle = computed((): CSSProperties => {
  return {
    width: !isCollapse.value ? '' : '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'
  }
})

const getMenuTextStyle = computed(() => {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    outline: 'none'
  }
})

const getSubTextStyle = computed((): CSSProperties => {
  return {
    width: !isCollapse.value ? '210px' : '',
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

const getSpanStyle = computed(() => {
  return {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
})

const expandCloseIcon = computed(() => {
  if (!getConfig()?.MenuArrowIconNoTransition) return ''
  return {
    'expand-close-icon': useRenderIcon(EpArrowDown),
    'expand-open-icon': useRenderIcon(ArrowUp),
    'collapse-close-icon': useRenderIcon(ArrowRight),
    'collapse-open-icon': useRenderIcon(ArrowLeft)
  }
})

const onlyOneChild: childrenType = ref(null)
// 存放菜单是否存在showTooltip属性标识
const hoverMenuMap = new WeakMap()
// 存储菜单文本dom元素
const menuTextRef = ref(null)

function hoverMenu(key) {
  // 如果当前菜单showTooltip属性已存在，退出计算
  if (hoverMenuMap.get(key)) return

  nextTick(() => {
    // 如果文本内容的整体宽度大于其可视宽度，则文本溢出
    menuTextRef.value?.scrollWidth > menuTextRef.value?.clientWidth
      ? Object.assign(key, {
          showTooltip: true
        })
      : Object.assign(key, {
          showTooltip: false
        })
    hoverMenuMap.set(key, true)
  })
}

function hasOneShowingChild(
  children: childrenType[] = [],
  parent: childrenType
) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item
    return true
  })

  if (showingChildren[0]?.meta?.showParent) {
    return false
  }

  if (showingChildren.length === 1 && !SHOW_PARENT_ONLY_HAS_ONE_CHILD) {
    return true
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath
  } else {
    // 使用path.posix.resolve替代path.resolve 避免windows环境下使用electron出现盘符问题
    return path.posix.resolve(props.basePath, routePath)
  }
}
</script>

<template>
  <template
    v-if="
      hasOneShowingChild(props.item.children, props.item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
  >
    <el-menu-item
      :index="resolvePath(onlyOneChild.path)"
      :class="{ 'submenu-title-noDropdown': !isNest }"
      :style="getNoDropdownStyle"
    >
      <div class="sub-menu-icon" v-if="toRaw(props.item.meta.icon)">
        <component
          :is="
            useRenderIcon(
              toRaw(onlyOneChild.meta.icon) ||
                (props.item.meta && toRaw(props.item.meta.icon))
            )
          "
        />
      </div>
      <div
        v-if="
          isCollapse &&
          layout === 'vertical' &&
          props.item?.pathList?.length === 1
        "
        :style="getDivStyle"
      >
        <span :style="getMenuTextStyle">
          {{ onlyOneChild.meta.title }}
        </span>
      </div>
      <div
        v-if="
          isCollapse && layout === 'mix' && props.item?.pathList?.length === 2
        "
        :style="getDivStyle"
      >
        <span :style="getMenuTextStyle">
          {{ onlyOneChild.meta.title }}
        </span>
      </div>
      <template #title>
        <div :style="getDivStyle">
          <span v-if="layout === 'horizontal'">
            {{ onlyOneChild.meta.title }}
          </span>
          <el-tooltip
            v-else
            placement="top"
            :effect="tooltipEffect"
            :offset="-10"
            :disabled="!onlyOneChild.showTooltip"
          >
            <template #content>
              {{ onlyOneChild.meta.title }}
            </template>
            <span
              ref="menuTextRef"
              :style="getMenuTextStyle"
              @mouseover="hoverMenu(onlyOneChild)"
            >
              {{ onlyOneChild.meta.title }}
            </span>
          </el-tooltip>
          <FontIcon
            v-if="onlyOneChild.meta.extraIcon"
            width="30px"
            height="30px"
            :style="getExtraIconStyle"
            :icon="onlyOneChild.meta.extraIcon.name"
            :svg="onlyOneChild.meta.extraIcon.svg ? true : false"
          />
        </div>
      </template>
    </el-menu-item>
  </template>

  <el-sub-menu
    v-else
    ref="subMenu"
    v-bind="expandCloseIcon"
    :index="resolvePath(props.item.path)"
  >
    <template #title>
      <div v-if="toRaw(props.item.meta.icon)" class="sub-menu-icon">
        <component
          :is="useRenderIcon(props.item.meta && toRaw(props.item.meta.icon))"
        />
      </div>
      <span v-if="layout === 'horizontal'">
        {{ props.item.meta.title }}
      </span>
      <el-tooltip
        v-else
        placement="top"
        :effect="tooltipEffect"
        :offset="-10"
        :disabled="!props.item.showTooltip"
      >
        <template #content>
          {{ props.item.meta.title }}
        </template>
        <div
          ref="menuTextRef"
          :style="getSubTextStyle"
          @mouseover="hoverMenu(props.item)"
        >
          <span :style="getSpanStyle">
            {{ props.item.meta.title }}
          </span>
        </div>
      </el-tooltip>
      <FontIcon
        v-if="props.item.meta.extraIcon"
        width="30px"
        height="30px"
        style="position: absolute; right: 10px"
        :icon="props.item.meta.extraIcon.name"
        :svg="props.item.meta.extraIcon.svg ? true : false"
      />
    </template>
    <sidebar-item
      v-for="child in props.item.children.filter(item => !item.menuHidden)"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>
