<template>
  <div class="app-container">
    <h2>添加菜谱</h2>
    <el-form
      ref="form"
      label-position="right"
      label-width="80px"
      :model="model"
    >
      <el-form-item label="菜谱名称">
        <el-input
          v-model="model.recipeName"
          placeholder="请输入菜谱名称"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'MeishijieRecipeManagementEditRecipe',
  data() {
    return {
      model: {}
    }
  }
}
</script>
