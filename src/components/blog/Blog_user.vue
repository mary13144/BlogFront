<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import type {ArticleDatas, UserPersonalInfo} from "@/types";
import {ArticleData, UserOwner} from "@/api/blog";
import {ElMessage} from "element-plus";

const props = defineProps<{
  is_article: boolean
  user_id?: number
  look_count?: number
  digg_count?: number
  comment_count?: number
  collection_count?: number
}>()

const data = ref<UserPersonalInfo>({
  addr: "",
  avatar: "",
  email: "",
  link: "",
  nick_name: "",
  role: "",
  sign: "",
  sign_status: ""
})

const articleData = ref<ArticleDatas>({
  category: 0,
  count: 0
})
const loadingData = async () => {
  let id: number
  if (props.is_article) {
    id = props.user_id as number
  } else {
    id = 1
  }
  let res = await UserOwner(id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}
const loadingArticleData = async () => {
  let res = await ArticleData()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  articleData.value = res.data
}
onBeforeMount(() => {
  loadingData()
  loadingArticleData()
})
</script>

<template>
  <div class="blog_user">
    <div class="avatar">
      <el-avatar
          :size="120"
          fit="fill"
          :src="data.avatar"/>
    </div>
    <div class="user">
      <div class="name">
        {{ data.nick_name }}
      </div>
      <div class="sign">
        {{ data.sign }}
      </div>
    </div>
    <div class="link">
      <div class="github">
        <a :href="data.link" target="_blank">
          <i class="iconfont icon-github"/>
        </a>
      </div>
    </div>
    <div class="other_info">
      <div class="user_info" v-if="!props.is_article">
        <div class="count_data">
          <div class="title">
            文章
          </div>
          <div class="count">
            {{ articleData.count }}
          </div>
        </div>
        <div class="count_data">
          <div class="title">
            分类
          </div>
          <div class="count">
            {{ articleData.category }}
          </div>
        </div>
      </div>
      <div class="article_info" v-else>
        <div class="look">
          <span>浏览量</span>
          <span>{{ props.look_count }}</span>
        </div>
        <div class="digg">
          <span>点赞数</span>
          <span>{{ props.digg_count }}</span>
        </div>
        <div class="comment">
          <span>评论数</span>
          <span>{{ props.comment_count }}</span>
        </div>
        <div class="collection">
          <span>收藏数</span>
          <span>{{ props.collection_count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_user {
  width: 100%;
  height: 400px;
  background-color: var(--bg);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text);

  .avatar {
    display: flex;
    align-items: center;
    height: 35%;
  }

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 35%;
    justify-content: space-evenly;

    .name {
      font-size: 25px;
      font-weight: bold;
    }

    .sign {
      text-align: center;
      line-height: 26px;
    }
  }

  .link {
    width: 100%;
    height: 10%;
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      text-decoration: none;

      i {
        font-size: 30px;
        color: var(--theme);
      }
    }

  }

  .other_info {
    width: 100%;
    height: 20%;

    .user_info {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      .count_data {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        font-weight: bold;

        .title {
          font-size: 20px;
        }

        .count {
          font-size: 18px;
        }
      }

    }

    .article_info {
      width: 100%;
      height: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;

      > div {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
        font-size: 0.875rem;

        span:last-of-type {
          font-size: 1.1rem;
          font-weight: bold;
          color: var(--theme);
        }
      }
    }
  }
}
</style>