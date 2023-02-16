<!--
  el-image-viewer
  https://element-plus.gitee.io/zh-CN/component/image.html#imageviewer-%E5%B1%9E%E6%80%A7
-->

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({ name: 'ImageViewer' })
</script>

<script lang="ts" setup>
import {
  ref,
  withDefaults,
  defineExpose,
  defineEmits,
  defineProps,
  computed
} from 'vue'

const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'update:visible', isVisible: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    visible?: boolean
    urlList?: string[]
    zIndex?: number
    initialIndex?: number
    infinite?: boolean
    hideOnClickModal?: boolean
    teleported?: boolean
    zoomRate?: number
  }>(),
  {
    visible: undefined
  }
)

const _visible = ref(false)
const visible = computed({
  get() {
    return isBoolean(props.visible) ? props.visible : _visible.value
  },
  set(val: boolean) {
    if (isBoolean(props.visible)) {
      emits('update:visible', val)
    } else {
      _visible.value = val
    }
    if (val === false) emits('close')
  }
})

type ElImageViewProps = Partial<{
  urlList: string[]
  zIndex: number
  initialIndex: number
  infinite: boolean
  hideOnClickModal: boolean
  teleported: boolean
  zoomRate: number
}>
// show方法传进来的props
const showFnProps = ref<ElImageViewProps>({})

const show = (options?: ElImageViewProps) => {
  if (options) showFnProps.value = options
  visible.value = true
}

const onClose = () => {
  visible.value = false
}

defineExpose({ show })
</script>

<template>
  <el-image-viewer
    v-if="visible"
    :url-list="showFnProps.urlList ?? props.urlList"
    :z-index="showFnProps.zIndex ?? props.zIndex"
    :initial-index="showFnProps.initialIndex ?? props.initialIndex"
    :infinite="showFnProps.infinite ?? props.infinite"
    :hide-on-click-modal="
      showFnProps.hideOnClickModal ?? props.hideOnClickModal
    "
    :teleported="showFnProps.teleported ?? props.teleported"
    :zoom-rate="showFnProps.zoomRate ?? props.zoomRate"
    @close="onClose"
  />
</template>
