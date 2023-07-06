<script setup lang="ts">
import Blog_comment from "@/components/blog/Blog_comment.vue";
import {inject, onBeforeMount, onMounted, ref, watch} from "vue";
import {ElMessage} from "element-plus";
import {ArticleComment, CommentList} from "@/api/blog";
import type {CommentAdd, CommentItem} from "@/types";

const props = defineProps<{
  id: string
  look_count: number,
  comment_count: number
}>()

const comment_number = inject("comment") as Function
const commentData = ref<CommentAdd>({
  article_id: props.id,
  content: "",
  parent_comment_id: undefined
})
const commentList = ref<CommentItem[]>([])
const isLoading = ref<boolean>(false)

const loadingHandler = async () => {
  isLoading.value = true
  await loadingData()
  setTimeout(() => {
    isLoading.value = false
  }, 500)
}
const loadingData = async () => {
  let res = await CommentList(props.id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  commentList.value = res.data
}
const commentHandler = async () => {
  if (commentData.value.content == "") {
    ElMessage.error("评论内容不能为空")
    return
  }
  let res = await ArticleComment(commentData.value)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  if (!commentData.value.parent_comment_id) {
    comment_number(true)
  }
  await loadingData()
  commentData.value = {
    article_id: props.id,
    content: "",
    parent_comment_id: undefined
  }
}
const commentChange = (parent_id: number, article_id: string) => {
  commentData.value.parent_comment_id = parent_id
  commentData.value.article_id = article_id
  let top = document.getElementById("comment_add")!.offsetTop - 200
  window.scrollTo({
    top: top,
    behavior: 'smooth',
  })
}
const diggChange = (com: CommentItem, add: boolean) => {
  if (add) {
    com.digg_count++
    console.log(com.digg_count)
  } else {
    com.digg_count--
  }
}
watch(() => props.id, () => {
  loadingData()
  commentData.value.article_id = props.id
})
onBeforeMount(() => {
  loadingData()
  commentData.value.article_id = props.id
})
</script>

<template>
  <div class="blog_comment_list">
    <div class="add" id="comment_add">
      <el-input
          class="comment"
          v-model.trim="commentData.content"
          type="textarea"
          :autosize="{minRows: 6}"
          resize="none"
          placeholder="请输入你的想法"
      ></el-input>
      <div class="info">
        <span>{{ props.look_count }}</span> 人浏览，
        <span>{{ props.comment_count }}</span> 人评论
      </div>
      <div class="button_wrapper">
        <el-button size="default" type="primary" @click="commentHandler">提交</el-button>
      </div>
    </div>
    <div class="master_comment" v-loading.fullscreen.lock="isLoading">
      <Blog_comment :comment="item" v-for="item in commentList"
                    :key="item.id"
                    @commentChange="commentChange"
                    @diggChange="diggChange"
                    @loadingHandler="loadingHandler"
      >
        <template v-if="item.sub_comments.length>0">
          <Blog_comment v-for="subItem in item.sub_comments"
                        :comment="subItem"
                        :key="subItem.id"
                        :is_sub="true"
                        :to_name="subItem.parent_comment_model.user.nick_name"
                        @commentChange="commentChange"
                        @diggChange="diggChange"
                        @loadingData="loadingData"
          >
          </Blog_comment>
        </template>
      </Blog_comment>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_comment_list {
  width: 100%;

  .add {
    position: relative;

    .comment {
      font-size: 16px;
    }

    .info {
      margin-top: 10px;
      font-size: 0.875rem;

      span {
        font-weight: bold;
        color: var(--theme);
      }
    }

    .button_wrapper {
      position: absolute;
      right: 10px;
      bottom: 35px;
    }

    :deep(.el-textarea__inner) {
      padding: 10px;
    }
  }

  .master_comment {
    width: 100%;
    margin-top: 40px;

  }
}
</style>