<script setup lang="ts">
import Admin_md from "@/components/admin/Admin_md.vue";
import {useRoute, useRouter} from "vue-router";
import {ArticleContent, ArticleUpdate} from "@/api/imagetext";
import {onBeforeMount, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useAdminStore} from "@/stores";
//响应式变量------------------------------------------------------------------
const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()
const content = ref<string>("")
const id = route.params.id as string
//函数-----------------------------------------------------------------------
const loadingArticle = async () => {
  let res = await ArticleContent(id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  content.value = res.data
}

const onSave = async () => {
  if (content.value.trim() == "") {
    ElMessage.error("文章内容不能为空")
    return
  }
  ElMessageBox.confirm(
      '你确定要保存更新吗。',
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        draggable: true,
        buttonSize: "default"
      })
      .then(async () => {
        let res = await ArticleUpdate({id: id, content: content.value})
        if (res.code) {
          ElMessage.error(res.msg)
          return
        }
        ElMessage.success(res.msg)
        await router.push({
          name: "article_manage"
        })
        adminStore.addTab({title: "文章管理", name: "article_manage"})
        adminStore.removeTab({title: "编辑文章", name: "article_editor"})
        return
      })
      .catch(() => {
      })

}
//生命周期钩子函数---------------------------------------------------------------
onBeforeMount(() => {
  loadingArticle()
})
</script>

<template>
  <Admin_md v-model:md-content="content" @onSave="onSave"></Admin_md>
</template>

<style scoped lang="scss">

</style>