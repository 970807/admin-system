<!-- 授权弹窗 -->
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { transformAuthListToTree } from '@/utils/auth'
import { ElTree, ElMessage } from 'element-plus'
import { getList } from '@/api/system/auth'
import { roleAuth, getAuthIdsByRoleId } from '@/api/system/role'
import type { listItemType } from '@/api/system/model/role'
import type { IAuthTreeItem } from '@/utils/auth'

export default defineComponent({
  setup() {
    const treeRef = ref<InstanceType<typeof ElTree>>()

    const state = reactive<{
      visible: boolean
      roleId?: listItemType['id']
      listLoading: boolean
      btnLoading: boolean
      authTree: IAuthTreeItem[]
    }>({
      visible: false,
      roleId: undefined,
      listLoading: false,
      btnLoading: false,
      authTree: []
    })

    const show = async (roleId: listItemType['id']) => {
      state.visible = true
      state.roleId = roleId
      getAuthTree()
      checkedAuthByRoleId(roleId)
    }

    const onClose = () => {
      state.visible = false
      state.roleId = undefined
    }

    // 查询该角色拥有的权限，并勾选
    const checkedAuthByRoleId = async (roleId: listItemType['id']) => {
      const { data: authIds } = await getAuthIdsByRoleId(roleId)
      treeRef.value.setCheckedKeys(authIds)
    }

    const getAuthTree = async () => {
      state.listLoading = true
      try {
        const res = await getList()
        state.authTree = transformAuthListToTree(res.data)
      } finally {
        state.listLoading = false
      }
    }

    // 全选/取消全选
    const handleCheckedOrUncheckedAll = (
      treeDataList: IAuthTreeItem[],
      isChecked: boolean
    ) => {
      treeDataList.forEach(treeData => {
        treeRef.value.setChecked(treeData, isChecked, false)
        // 递归设置子节点
        if (treeData?.children?.length)
          handleCheckedOrUncheckedAll(treeData.children, isChecked)
      })
    }

    const save = () => {
      const authIds = treeRef.value.getCheckedKeys() as any
      state.btnLoading = true
      roleAuth(state.roleId, { authIds })
        .then(res => {
          console.log(res)

          ElMessage.success(res.message)
          onClose()
        })
        .finally(() => (state.btnLoading = false))
    }

    return {
      ...toRefs(state),
      treeRef,
      show,
      onClose,
      save,
      handleCheckedOrUncheckedAll
    }
  }
})
</script>

<template>
  <div>
    <el-dialog
      v-model="visible"
      align-center
      title="授权"
      width="600px"
      class="auth-dialog"
      destroy-on-close
      @closed="onClose"
    >
      <template #default>
        <el-tree
          ref="treeRef"
          v-loading="listLoading"
          element-loading-text="加载中..."
          :data="authTree"
          show-checkbox
          node-key="id"
          check-on-click-node
          check-strictly
        >
          <template #default="{ data }">
            <div class="tree-content">
              <div class="left">
                <span class="auth-name">{{ data.name }}</span>
                <el-tag
                  style="margin-left: 4px; transform: scale(0.9)"
                  v-if="data.authType === 0"
                  size="small"
                  >菜单</el-tag
                >
                <el-tag
                  style="margin-left: 4px; transform: scale(0.9)"
                  v-if="data.authType === 1"
                  type="success"
                  >按钮</el-tag
                >
              </div>
              <div class="right">
                <el-button
                  type="primary"
                  link
                  @click.stop="handleCheckedOrUncheckedAll([data], true)"
                  >全选</el-button
                >
                <el-button
                  type="primary"
                  link
                  @click.stop="handleCheckedOrUncheckedAll([data], false)"
                  >取消全选</el-button
                >
              </div>
            </div>
          </template>
        </el-tree>
      </template>
      <template #footer>
        <el-button @click="onClose">取消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="save"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-tree) {
  min-height: 26vh;
  max-height: 52vh;
  overflow-y: auto;

  .el-tree-node__content {
    display: flex;

    &:hover .tree-content .right {
      display: flex;
    }

    .tree-content {
      flex: 1;
      display: flex;
      justify-content: space-between;
      overflow: hidden;

      .left {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        margin-right: 6px;

        .auth-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .right {
        display: none;
        align-items: center;

        .el-button + .el-button {
          margin-left: 6px;
        }
      }
    }
  }
}
</style>
