<script setup lang="ts">
import {ElMessage} from "element-plus";
import {onActivated, onBeforeMount, ref} from "vue";
import type {Article_Add, ImageBriefData, Select} from "@/types";
import {ArticleCreate, ArticleQueryCategory, TagArticle} from "@/api/imagetext";
import {useRouter} from "vue-router";
import {useAdminStore} from "@/stores";
import Admin_drawer from "@/components/admin/Admin_drawer.vue";
import {MenuBanner} from "@/api/system";
import Admin_md from "@/components/admin/Admin_md.vue";
//响应式变量-------------------------------------------------------

const article = ref<Article_Add>({
  id: "",
  title: "",
  abstract: "",
  banner_id: undefined,
  category: "",
  content: "",
  tags: [],
})
const tagSelect = ref<Select[]>([])
const categorySelect = ref<Select[]>([])
const imageBrief = ref<ImageBriefData[]>([])
const isShow = ref<boolean>(false)
const router = useRouter()
const adminStore = useAdminStore()


//保存
const onSave = () => {
  if (article.value.content == "") {
    ElMessage.error("文章内容不能为空")
    return
  }
  isShow.value = true
};
const confirmClick = async () => {
  let res = await ArticleCreate(article.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  isShow.value = false
  await router.push({
    name: "user_article"
  })
  article.value = {
    id: "",
    title: "",
    abstract: "",
    banner_id: undefined,
    category: "",
    content: "",
    tags: [],
  }
  adminStore.addTab({title: "我的文章", name: "user_article"})
  adminStore.removeTab({title: "添加文章", name: "add_article"})
  return
}
const loadingImageBrief = async () => {
  let res = await MenuBanner()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  imageBrief.value = res.data
}
const loadingTag = async () => {
  let res = await TagArticle()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  tagSelect.value = res.data
}
//加载文章类别
const loadingCategory = async () => {
  let res = await ArticleQueryCategory()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  categorySelect.value = res.data
}
//关闭
const handlerClose = () => {
  isShow.value = false
}

onBeforeMount(() => {
  loadingTag()
  loadingCategory()
  loadingImageBrief()
})
onActivated(() => {
  loadingTag()
  loadingCategory()
  loadingImageBrief()
})

</script>

<template>
  <div class="container">
    <Admin_md v-model:mdContent="article.content as string" @onSave="onSave"></Admin_md>
    <Admin_drawer
        v-if="isShow"
        @confirmClick="confirmClick"
        @handlerClose="handlerClose"
        :article="article"
        :category-select="categorySelect"
        :image-brief="imageBrief"
        :tag-select="tagSelect"
        :is-show="isShow"
    ></Admin_drawer>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>