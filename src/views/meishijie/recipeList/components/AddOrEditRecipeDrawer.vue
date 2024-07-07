<script lang="ts" setup>
import { ref, reactive, computed, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import SelectAuthorDialog from './SelectAuthorDialog.vue'
import {
  getRecipeDetailById,
  addRecipe,
  editRecipe
} from '@/api/meishijie/recipe'

const emit = defineEmits(['refresh'])

const formRef = ref<FormInstance>()
const selectAuthorDialogRef = ref<InstanceType<typeof SelectAuthorDialog>>()

interface IFormData {
  id?: string
  recipeName: string
  recipeQrcode: string
  isVideo: 0 | 1
  coverUrl: string
  videoUrl: string
  simpleIntroductionTechnology: string
  simpleIntroductionTaste: string
  simpleIntroductionTime: string
  simpleIntroductionDifficulty: string
  mainIngredientsStr: string
  subIngredientsStr: string
  peopleCount: number
  favCount: number
  browerCount: number
  authorId: string
  authorName?: string
  authorWords: string
  stepList: Array<{ imgUrl: string; content: string }>
  finishFoodImgUrlList: string[]
  recipeTips: string
  originWebLink: string
}

const getDefaultFormData = (): IFormData => ({
  id: undefined,
  recipeName: '', // 菜谱名称
  recipeQrcode: '', // 菜谱二维码链接
  isVideo: 0, // 是否是视频菜谱
  coverUrl: '', // 封面图链接
  videoUrl: '', // 视频链接
  simpleIntroductionTechnology: '', // 工艺
  simpleIntroductionTaste: '', // 口味
  simpleIntroductionTime: '', // 时间
  simpleIntroductionDifficulty: '', // 难度
  mainIngredientsStr: '', // 主料
  subIngredientsStr: '', // 辅料
  peopleCount: 0, // 份数
  favCount: 0, // 收藏数
  browerCount: 0, // 浏览数
  authorId: '', // 菜谱作者id
  authorName: '', // 菜谱作者
  authorWords: '', // 作者推荐语
  stepList: [], // 做法步骤
  finishFoodImgUrlList: [], // 成品图
  recipeTips: '', // 烹饪技巧
  originWebLink: '' // 官方链接
})

const state = reactive<{
  visible: boolean
  formData: IFormData
  btnLoading: boolean
}>({
  visible: false,
  formData: getDefaultFormData(),
  btnLoading: false
})

const { visible, formData, btnLoading } = toRefs(state)

// 是否编辑操作 true: 编辑 false: 新增
const isEdit = computed(() => typeof formData.value.id !== 'undefined')

const rules = reactive<FormRules>({
  recipeName: [
    { required: true, message: '请输入菜谱名称', trigger: ['blur', 'change'] }
  ],
  recipeQrcode: [
    { required: true, message: '请输入二维码链接', trigger: ['blur', 'change'] }
  ],
  isVideo: [
    {
      required: true,
      type: 'integer',
      message: '请选择是否为视频菜谱',
      trigger: ['blur', 'change']
    }
  ],
  videoUrl: [
    { required: true, message: '请输入视频链接', trigger: ['blur', 'change'] }
  ],
  coverUrl: [
    { required: true, message: '请输入封面图链接', trigger: ['blur', 'change'] }
  ],
  simpleIntroductionTechnology: [
    { required: true, message: '请输入工艺', trigger: ['blur', 'change'] }
  ],
  simpleIntroductionTaste: [
    { required: true, message: '请输入口味', trigger: ['blur', 'change'] }
  ],
  simpleIntroductionTime: [
    { required: true, message: '请输入时间', trigger: ['blur', 'change'] }
  ],
  simpleIntroductionDifficulty: [
    { required: true, message: '请输入难度', trigger: ['blur', 'change'] }
  ],
  mainIngredientsStr: [
    { required: true, message: '请输入主料', trigger: ['blur', 'change'] }
  ],
  subIngredientsStr: [
    { required: true, message: '请输入辅料', trigger: ['blur', 'change'] }
  ],
  peopleCount: [
    {
      required: true,
      type: 'integer',
      message: '请输入份数',
      trigger: ['blur', 'change']
    }
  ],
  favCount: [
    {
      required: true,
      type: 'integer',
      message: '请输入收藏数',
      trigger: ['blur', 'change']
    }
  ],
  browerCount: [
    {
      required: true,
      type: 'integer',
      message: '请输入浏览数',
      trigger: ['blur', 'change']
    }
  ],
  authorId: [
    {
      required: true,
      message: '请选择菜谱作者',
      trigger: ['blur', 'change']
    }
  ],
  authorWords: [
    { required: true, message: '请输入作者推荐语', trigger: ['blur', 'change'] }
  ],
  stepList: [
    {
      required: true,
      trigger: ['blur', 'change'],
      validator(rule, value, callback) {
        if (!Array.isArray(value) || value.length < 1) {
          return callback(new Error('请添加做法步骤'))
        }
        for (let i = 0; i < value.length; i++) {
          if (!value[i].imgUrl) {
            return callback(new Error(`step ${i + 1}图片链接不能为空`))
          }
          if (!value[i].content) {
            return callback(new Error(`step ${i + 1}内容不能为空`))
          }
        }
        callback()
      }
    }
  ],
  finishFoodImgUrlList: [
    {
      required: true,
      trigger: ['blur', 'change'],
      validator(rule, value, callback) {
        if (!Array.isArray(value) || value.length < 1) {
          return callback(new Error('请添加成品图'))
        }
        for (let i = 0; i < value.length; i++) {
          if (!value[i]) {
            return callback(new Error(`成品图${i + 1}链接不能为空`))
          }
        }
        callback()
      }
    }
  ]
})

const show = (id?: string) => {
  visible.value = true
  if (id) getDetail(id)
}

const onClose = () => {
  visible.value = false
  formData.value = getDefaultFormData()
}

// 获取详情
const getDetail = (id: string) => {
  getRecipeDetailById({ id }).then(res => {
    formData.value = res.data
  })
}

// 添加做法步骤
const handleAddStep = () => {
  formData.value.stepList.push({ imgUrl: '', content: '' })
}

// 删除做法步骤
const handleDeleteStep = (index: number) => {
  formData.value.stepList.splice(index)
}

// 添加成品图
const handleAddFinishImg = () => {
  formData.value.finishFoodImgUrlList.push('')
}

const handleFinishGoodsImgUrlChange = (index: number) => {
  if (formData.value.finishFoodImgUrlList[index]) {
    return
  }
  formData.value.finishFoodImgUrlList.splice(index, 1)
}

const onSave = () => {
  formRef.value.validate(valid => {
    if (!valid) return
    btnLoading.value = true
    ;(isEdit.value ? editRecipe : addRecipe)(
      formData.value as Required<IFormData>
    )
      .then(res => {
        ElMessage.success(res.message)
        emit('refresh')
        onClose()
      })
      .finally(() => (btnLoading.value = false))
  })
}

const onAuthorSelect = (row: any) => {
  state.formData.authorName = row.nickname
  state.formData.authorId = row.id
}

defineExpose({ show })
</script>

<template>
  <el-drawer
    v-model="visible"
    :title="isEdit ? '编辑菜谱' : '添加菜谱'"
    :size="1000"
    destroy-on-close
    @closed="onClose"
  >
    <template #default>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
      >
        <el-form-item label="菜谱名称：" prop="recipeName">
          <el-input
            v-model="formData.recipeName"
            placeholder="请输入菜谱名称"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
        <el-form-item label="菜谱二维码：" prop="recipeQrcode">
          <el-input
            v-model="formData.recipeQrcode"
            placeholder="请输入二维码链接"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
        <el-form-item label="视频菜谱：" prop="isVideo">
          <el-switch
            v-model="formData.isVideo"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item
          v-show="formData.isVideo"
          label="视频链接："
          :prop="formData.isVideo ? 'videoUrl' : ''"
        >
          <el-input
            v-model="formData.videoUrl"
            placeholder="请输入视频链接"
            clearable
            show-word-limit
            maxlength="1500"
          />
        </el-form-item>
        <el-form-item label="封面图链接：" prop="coverUrl">
          <el-input
            v-model="formData.coverUrl"
            placeholder="请输入封面图链接"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
        <el-row>
          <el-col :span="6">
            <el-form-item label="工艺：" prop="simpleIntroductionTechnology">
              <el-input
                v-model="formData.simpleIntroductionTechnology"
                placeholder="请输入工艺"
                clearable
                show-word-limit
                maxlength="6"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="口味：" prop="simpleIntroductionTaste">
              <el-input
                v-model="formData.simpleIntroductionTaste"
                placeholder="请输入口味"
                clearable
                show-word-limit
                maxlength="6"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="时间：" prop="simpleIntroductionTime">
              <el-input
                v-model="formData.simpleIntroductionTime"
                placeholder="请输入时间"
                clearable
                show-word-limit
                maxlength="6"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="难度：" prop="simpleIntroductionDifficulty">
              <el-input
                v-model="formData.simpleIntroductionDifficulty"
                placeholder="请输入难度"
                clearable
                show-word-limit
                maxlength="6"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主料：" prop="mainIngredientsStr">
          <el-input
            v-model="formData.mainIngredientsStr"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="格式为食材:用量;食材:用量;食材:用量;"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
        <el-form-item label="辅料：" prop="subIngredientsStr">
          <el-input
            v-model="formData.subIngredientsStr"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="格式为食材:用量;食材:用量;食材:用量;"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="份数：" prop="peopleCount">
              <el-input-number
                v-model="formData.peopleCount"
                :min="0"
                :max="999999"
                :precision="0"
              />
              <span>&nbsp;人份</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="收藏数：" prop="favCount">
              <el-input-number
                v-model="formData.favCount"
                :min="0"
                :max="999999"
                :precision="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="浏览数：" prop="browerCount">
              <el-input-number
                v-model="formData.browerCount"
                :min="0"
                :max="999999"
                :precision="0"
              /> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="菜谱作者：" prop="authorId">
          <el-input
            :model-value="formData.authorName"
            clearable
            @click="selectAuthorDialogRef.show(formData.authorId)"
          />
        </el-form-item>
        <el-form-item label="作者推荐语：" prop="authorWords">
          <el-input
            v-model="formData.authorWords"
            type="textarea"
            :rows="5"
            placeholder="请输入作者推荐语"
            clearable
            show-word-limit
            maxlength="1000"
          />
        </el-form-item>
        <el-form-item label="做法步骤：" prop="stepList" class="step-list-wrap">
          <section
            v-for="(item, index) in formData.stepList"
            :key="index"
            class="step-box"
          >
            <div class="title">
              <span>step {{ index + 1 }}</span>
              <el-icon class="icon-close" @click="handleDeleteStep(index)">
                <CircleClose />
              </el-icon>
            </div>
            <el-input
              v-model="item.imgUrl"
              placeholder="请输入步骤图片链接"
              maxlength="255"
              show-word-limit
              style="margin-bottom: 12px"
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
          <el-button class="opearte-btn" type="primary" @click="handleAddStep"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item
          label="成品图："
          prop="finishFoodImgUrlList"
          class="finish-food-img-list"
        >
          <el-row :gutter="20">
            <el-col
              v-for="(item, index) in formData.finishFoodImgUrlList"
              :key="index"
              :span="8"
            >
              <el-input
                v-model="formData.finishFoodImgUrlList[index]"
                placeholder="请输入成品图链接"
                maxlength="255"
                show-word-limit
                style="margin-bottom: 12px"
                clearable
                @change="handleFinishGoodsImgUrlChange(index)"
              />
            </el-col>
          </el-row>
          <div class="opearte-btn-wrap">
            <el-button type="primary" @click="handleAddFinishImg"
              >添加</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="烹饪技巧：" prop="recipeTips">
          <el-input
            v-model="formData.recipeTips"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入烹饪技巧"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
        <el-form-item label="官方链接：" prop="originWebLink">
          <el-input
            v-model="formData.originWebLink"
            placeholder="请输入官方链接"
            clearable
            show-word-limit
            maxlength="255"
          />
        </el-form-item>
      </el-form>
      <!-- 选择菜谱作者dialog -->
      <SelectAuthorDialog
        ref="selectAuthorDialogRef"
        @select-row="onAuthorSelect"
      />
    </template>
    <template #footer>
      <el-button @click="onClose">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="onSave"
        >保存</el-button
      >
    </template>
  </el-drawer>
</template>

<style lang="scss" scoped>
:deep() {
  .el-form-item__label {
    font-weight: 700;
  }
}

/* 做法步骤 */
.step-list-wrap {
  .step-box {
    margin-top: 26px;
    width: 100%;

    &:first-of-type {
      margin-top: 6px;
    }

    .title {
      position: relative;
      color: rgba(235, 77, 75, 0.9);
      background: rgba(189, 195, 199, 0.2);
      font-size: 18px;
      font-weight: 600;
      padding: 0 20px;
      margin-bottom: 10px;
      box-sizing: border-box;

      &:hover {
        background: rgba(189, 195, 199, 0.25);
      }

      &::before {
        content: '';
        position: absolute;
        left: 6px;
        top: 6px;
        bottom: 6px;
        width: 8px;
        background: rgba(235, 77, 75, 0.9);
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

  .opearte-btn:not(:first-child) {
    margin-top: 8px;
  }
}

/* 成品图 */
.finish-food-img-list {
  .el-row {
    width: 100%;
  }

  .opearte-btn-wrap {
    width: 100%;
  }
}
</style>
