<script setup lang="ts">
import type {FormRules} from 'element-plus'
import {ElMessageBox} from "element-plus";
import {onActivated, onBeforeMount, reactive, ref} from "vue";
import type {Article_Add, ImageBriefData, Select} from "@/types";
//响应式变量---------------------------------------------------------------------

const imgPath = ref<string>("")
const imgIndex = ref<number>(0)
const props = defineProps<{
  article: Article_Add,
  tagSelect: Select[],
  categorySelect: Select[],
  imageBrief: ImageBriefData[],
  isShow: boolean
}>()
const emits = defineEmits(["confirmClick", "handlerClose"])
// form表单验证规则
const rules = reactive<FormRules>({
  title: [
    {required: true, message: 'Please input title', trigger: 'change'},
  ],
  banner_id: [
    {required: true, message: 'Please input banner_id', trigger: 'blur'},
  ],
  category: [
    {required: true, message: 'Please input category', trigger: 'blur'},
  ],
  tags: [
    {required: true, message: 'Please select tags', trigger: 'blur'},
  ]
})
//函数-----------------------------------------------------------
//加载封面数据

const changeImage = () => {
  props.article.banner_id = props.imageBrief[imgIndex.value].id
  imgPath.value = props.imageBrief[imgIndex.value].path
}
const handleClose = () => {
  ElMessageBox.confirm(
      '你确定要关闭吗?关闭不会保存已编辑部分。',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true,
        buttonSize: "default"
      })
      .then(() => {
        emits('handlerClose')
      })
      .catch(() => {
      })
}


//生命周期钩子函数------------------------------------------------------------------------------
onBeforeMount(async () => {
  imgIndex.value = Math.floor(Math.random() * props.imageBrief.length)
  if (props.article.banner_id) {
    for (let i = 0; i < props.imageBrief.length; i++) {
      if (props.article.banner_id == props.imageBrief[i].id) {
        imgIndex.value = i
        break
      }
    }
  }
  await changeImage()
})
onActivated(async () => {
  imgIndex.value = Math.floor(Math.random() * props.imageBrief.length)
  if (props.article.banner_id) {
    for (let i = 0; i < props.imageBrief.length; i++) {
      if (props.article.banner_id == props.imageBrief[i].id) {
        imgIndex.value = i
        break
      }
    }
  }
  await changeImage()
})
</script>

<template>
  <div class="drawer_wrapper">
    <el-drawer
        v-model="props.isShow"
        :before-close="handleClose"
    >
      <template #header>
        <h2>完善文章信息</h2>
      </template>
      <template #default>
        <el-form
            :model="props.article"
            :rules="rules"
            class="drawer_main"
            size="default"
            label-width="120px"
            status-icon
        >
          <el-form-item label="文章标题：" prop="title">
            <el-input v-model.trim="props.article.title" size="large" clearable placeholder="请输入文章标题"/>
          </el-form-item>
          <el-form-item label="文章简介：">
            <el-input type="textarea" :autosize="{minRows: 4, maxRows: 6}" resize="none" clearable
                      v-model.lazy.trim="props.article.abstract"
                      placeholder="请输入文章简介。。。"/>
          </el-form-item>
          <el-form-item label="文章分类：" prop="category">
            <el-select
                v-model="props.article.category"
                clearable
                filterable
                allow-create
                default-first-option
                size="large"
                style="width: 100%">
              <el-option
                  v-for="item in props.categorySelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="文章封面：" prop="banner_id">
            <el-select v-model="imgIndex" @change="changeImage" style="width: 100%" clearable size="large">
              <el-option v-for="(data,index) in props.imageBrief" :key="data.id" :label="data.name" :value="index">
                <div class="content" style="display:flex;align-items: center;justify-content: space-between">
                  <el-image :src="data.path" style="height: 30px;border-radius: 5px;"/>
                  <el-text type="primary">{{ data.name }}</el-text>
                </div>
              </el-option>
            </el-select>
            <el-image :src="imgPath" style="height: 100px;margin-top: 10px;margin-left: 10px"
                      fit="fill" :lazy="true"/>
          </el-form-item>
          <el-form-item label="文章标签：" prop="tags">
            <el-select v-model="props.article.tags"
                       style="width: 100%"
                       default-first-option
                       clearable
                       filterable
                       allow-create
                       multiple
                       collapse-tags
                       collapse-tags-tooltip
                       :max-collapse-tags="3"
                       size="large">
              <el-option
                  v-for="item in props.tagSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="emits('handlerClose')" size="default">cancel</el-button>
          <el-button type="primary" @click="emits('confirmClick')" size="default">confirm</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style scoped lang="scss">
.drawer_wrapper {
  :deep(.el-drawer__body) {
    padding: 30px;

    .drawer_main {
      width: 90%;
      height: 70%;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      label {
        font-size: 16px;
      }

    }
  }

}
</style>