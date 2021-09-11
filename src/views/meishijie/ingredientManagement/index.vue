<template>
  <div class="app-container">
    <el-tabs>
      <el-tab-pane label="食材分类">
        <CategoryList />
      </el-tab-pane>
      <el-tab-pane label="食材列表">
        <IngredientList />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CategoryList from './categoryList'
import IngredientList from './ingredientList'

export default {
  name: 'MeishijieIngredientManagementIndex',
  components: {
    CategoryList,
    IngredientList
  }

}
</script>
