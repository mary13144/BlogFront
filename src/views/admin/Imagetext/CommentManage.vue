<script setup lang="ts">
import Admin_table from "@/components/admin/Admin_table.vue";
import type {Comment, Page, TableColumn} from "@/types";
import {onMounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {CommentQuery, CommentRemove} from "@/api/imagetext";
import Admin_search from "@/components/admin/Admin_search.vue";
import Admin_pages from "@/components/admin/Admin_pages.vue";
//固定参数---------------------------------------------------------------------
const columns: TableColumn[] = [
  {
    title: "ID",
    prop: "id",
  },
  {
    title: "文章标题",
    prop: "article_title",
  },
  {
    title: "文章封面",
    prop: "img",
  },
  {
    title: "评论内容",
    prop: "content",
  },
  {
    title: "点赞数",
    prop: "digg_count",
  },
  {
    title: "评论人昵称",
    prop: "user_nick_name",
  },
  {
    title: "评论时间",
    prop: "date",
  },
  {
    title: "操作",
    prop: "delete",
  },
]
//响应式变量-------------------------------------------------------------------
const page = reactive<Page>({
  page_num: 1,
  page_size: 6,
})
const commentData = ref<Comment[]>([])
const total = ref<number>(0)
const srcList = ref<string[]>([])
const isLoading = ref<boolean>(false)
//函数------------------------------------------------------------------------
//加载评论
const loadingData = async () => {
  let res = await CommentQuery(page)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  commentData.value = res.data.list
  total.value = res.data.count
  srcList.value = []
  for (const comment of commentData.value) {
    srcList.value.push(comment.banner_url)
  }
}
//删除评论
const deleteData = async (id: number) => {
  let isDelete = await ElMessageBox.confirm(
      "你确认要删除所选图片吗？",
      "Warning",
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  )
  if (isDelete.action == 'close' || isDelete.action == 'cancel') {
    return
  }
  let res = await CommentRemove(id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  page.page_num = 1
  await loadingData()
}
//控制是否显示加载动画
const changeIsLoading = () => {
  isLoading.value = !isLoading.value
}


//生命周期钩子函数---------------------------------------------------------------
onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="bg">
    <div class="search_wrapper">
      <Admin_search :page="page" @loading-data="loadingData" @change-is-loading="changeIsLoading"/>
    </div>
    <div class="table_wrapper">
      <Admin_table
          :columns="columns"
          :data="commentData"
          :is-loading="isLoading"
          :src-list="srcList"
          @deleteData="deleteData"
      >
      </Admin_table>
    </div>
    <div class="page_wrapper">
      <Admin_pages :total="total" :page="page" @loading-data="loadingData"></Admin_pages>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background-color: var(--bg);
  padding: 30px;
  border-radius: 15px;
  overflow-y: auto;

  .table_wrapper {
    margin: 20px 0;
  }

}
</style>