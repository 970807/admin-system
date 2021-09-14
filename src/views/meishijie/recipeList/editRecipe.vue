<template>
  <div class="app-container">
    <h2>添加菜谱</h2>
    <el-form
      ref="form"
      label-position="right"
      label-width="90px"
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
      <el-form-item label="菜谱二维码">
        <el-input
          v-model="model.recipeQrcode"
          placeholder="请输入二维码链接"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="视频菜谱">
        <el-switch
          v-model="model.isVideo"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item v-show="!model.isVideo" label="封面图链接">
        <el-image
          v-if="model.coverUrl"
          :src="model.coverUrl"
          :preview-src-list="[model.coverUrl]"
          style="width:100px;height: 100px;"
          fit="contain"
        />
        <el-input
          v-model="model.coverUrl"
          placeholder="请输入封面图链接"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item v-show="model.isVideo" label="视频链接">
        <el-input
          v-model="model.videoUrl"
          placeholder="请输入视频链接"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-row>
        <el-col :md="6" :sm="12">
          <el-form-item label="工艺">
            <el-input
              v-model="model.simpleIntroductionTechnology"
              placeholder="请输入工艺"
              maxlength="6"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="口味">
            <el-input
              v-model="model.simpleIntroductionTaste"
              placeholder="请输入口味"
              maxlength="6"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="时间">
            <el-input
              v-model="model.simpleIntroductionTime"
              placeholder="请输入时间"
              maxlength="6"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item label="难度">
            <el-input
              v-model="model.simpleIntroductionDifficulty"
              placeholder="请输入难度"
              maxlength="6"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="主料">
        <el-input
          v-model="model.mainIngredientsStr"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          placeholder="格式为食材:用量;食材:用量;食材:用量;"
        />
      </el-form-item>
      <el-form-item label="辅料">
        <el-input
          v-model="model.subIngredientsStr"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          placeholder="格式为食材:用量;食材:用量;食材:用量;"
        />
      </el-form-item>
      <el-row>
        <el-col :md="8" :sm="24">
          <el-form-item label="份数">
            <el-input-number
              v-model="model.peopleCount"
              :min="1"
              :max="999"
              :precision="0"
              size="medium"
            />
            <span>&nbsp;人份</span>
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12">
          <el-form-item label="收藏数">
            <el-input-number
              v-model="model.favCount"
              :min="0"
              :precision="0"
              size="medium"
            />
          </el-form-item>
        </el-col>
        <el-col :md="8" :sm="12">
          <el-form-item label="浏览数">
            <el-input-number
              v-model="model.browerCount"
              :min="0"
              :precision="0"
              size="medium"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="菜谱作者">
        <el-select
          v-model="model.authorId"
          placeholder="请输入作者昵称"
          filterable
          remote
          :remote-method="searchAuthorRemoteMethod"
          :loading="authorSearchLoading"
          clearable
        >
          <el-option
            v-for="item in authorSearchList"
            :key="item.id"
            :label="item.nickname"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="作者推荐语">
        <el-input
          v-model="model.authorWords"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入作者推荐语"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="做法步骤">
        <el-button type="primary" size="mini" @click="handleAddStep">添加</el-button>
        <section
          v-for="(item, index) in model.stepList"
          :key="index"
          class="step-box"
        >
          <div class="title">
            <span>step {{ index+1 }}</span>
            <i
              class="icon-close el-icon-circle-close"
              @click="handleDeleteStep(index)"
            />
          </div>
          <el-image
            v-if="item.imgUrl"
            :src="item.imgUrl"
            :preview-src-list="[item.imgUrl]"
            style="width:100px;height: 100px;"
            fit="contain"
          />
          <el-input
            v-model="item.imgUrl"
            placeholder="请输入步骤图片链接"
            maxlength="255"
            show-word-limit
            style="margin-bottom: 12px;"
            clearable
          />
          <el-input
            v-model="item.content"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入步骤内容"
            maxlength="255"
            show-word-limit
          />
        </section>
      </el-form-item>
      <el-form-item label="成品图">
        <el-button type="primary" size="mini" @click="handleAddFinishImg">添加</el-button>
        <el-row :gutter="20">
          <el-col
            v-for="(item, index) in model.finishFoodImgUrlList"
            :key="index"
            :md="8"
            :sm="12"
          >
            <el-image
              :src="model.finishFoodImgUrlList[index]"
              :preview-src-list="[model.finishFoodImgUrlList[index]]"
              style="width:120px;height: 120px;"
              fit="contain"
            />
            <el-input
              v-model="model.finishFoodImgUrlList[index]"
              placeholder="请输入成品图链接"
              maxlength="255"
              show-word-limit
              style="margin-bottom: 12px;"
              clearable
              @change="handleFinishGoodsImgUrlChange(index)"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="烹饪技巧">
        <el-input
          v-model="model.recipeTips"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入烹饪技巧"
          maxlength="255"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="官方链接">
        <el-input
          v-model="model.originWebLink"
          placeholder="请输入官方链接"
          maxlength="255"
          show-word-limit
          clearable
        />
      </el-form-item>
    </el-form>
    <footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="confirm">确定</el-button>
    </footer>
  </div>
</template>

<script>
import { addRecipe, editRecipe, getRecipeDetailById } from '@/api/meishijie/recipe'
import { getList as getAuthorList } from '@/api/meishijie/account'

export default {
  name: 'MeishijieRecipeManagementEditRecipe',
  data() {
    return {
      isEdit: false,
      model: {
        recipeName: '',
        recipeQrcode: '',
        isVideo: 0,
        coverUrl: '',
        videoUrl: '',
        simpleIntroductionTechnology: '',
        simpleIntroductionTaste: '',
        simpleIntroductionTime: '',
        simpleIntroductionDifficulty: '',
        mainIngredientsStr: '',
        subIngredientsStr: '',
        peopleCount: 1,
        favCount: 0,
        browerCount: 0,
        authorWords: '',
        stepList: [],
        finishFoodImgUrlList: [],
        recipeTips: '',
        originWebLink: '',
        authorId: undefined
      },
      authorSearchLoading: false,
      authorSearchList: [],
      btnLoading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const id = this.$route.query.id
      if (id) {
        this.isEdit = true
        getRecipeDetailById({id}).then(res => {
          this.model = res.data
        })
      }
    },
    confirm() {
      this.btnLoading = true
      let res
      if (this.isEdit) {
        res = editRecipe(this.model)
      } else {
        res = addRecipe(this.model)
      }
      res.then(res => {
        this.$message.success(res.message)
        this.btnLoading = false
        this.cancel()
      }).catch(() => {
        this.btnLoading = false
      })
    },
    cancel() {
      this.$router.push('/meishijie/recipe-list')
    },
    searchAuthorRemoteMethod(authorNickname) {
      this.authorSearchLoading = true
      getAuthorList({ page: 1, pageSize: 10, nickname: authorNickname })
        .then(res => {
          this.authorSearchList = res.data.list
          this.authorSearchLoading = false
        })
        .catch(() => {
          this.authorSearchLoading = false
        })
    },
    // 添加成品图
    handleAddFinishImg() {
      this.model.finishFoodImgUrlList.push('')
    },
    handleFinishGoodsImgUrlChange(index) {
      if (this.model.finishFoodImgUrlList[index]) {
        return
      }
      this.model.finishFoodImgUrlList.splice(index, 1)
    },
    // 添加做法步骤
    handleAddStep() {
      this.model.stepList.push({ imgUrl: '', content: '' })
    },
    // 删除做法步骤
    handleDeleteStep(index) {
      this.model.stepList.splice(index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .step-box {
    $title-color: rgba(235, 77, 75,.9);
    margin-top: 26px;

    &:first-of-type {
      margin-top: 10px;
    }

    .title {
      position: relative;
      color: $title-color;
      background: rgba(189, 195, 199,.2);
      font-size: 18px;
      font-weight: 600;
      padding: 0 20px;
      margin-bottom: 10px;
      box-sizing: border-box;

      &:hover {
        background: rgba(189, 195, 199,.25);
      }

      &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 6px;
        bottom: 6px;
        width: 8px;
        background: $title-color;
      }

      .icon-close {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        font-size: 20px;
        cursor: pointer;
      }
    }
  }

  footer {
    display: flex;
    justify-content: flex-end;
  }
</style>
