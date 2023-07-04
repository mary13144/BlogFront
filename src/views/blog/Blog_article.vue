<script setup lang="ts">
import Blog_banner from "@/components/blog/Blog_banner.vue";
import {useRoute} from "vue-router";
import {onMounted, provide, ref} from "vue";
import type {Article} from "@/types";
import {ArticleCollection, ArticleDetail, ArticleDigg} from "@/api/blog";
//@ts-ignore
import {ElMessage} from "element-plus";
import Blog_user from "@/components/blog/Blog_user.vue";
import {getFormatDate} from "@/utils/date";
import {MdCatalog, MdPreview} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {useDark} from "@vueuse/core";
import Blog_card from "@/components/blog/Blog_card.vue";
import {useBlogStore} from "@/stores";
import Blog_commentlist from "@/components/blog/Blog_commentlist.vue";

const route = useRoute()
const id = route.params.id
const data = ref<Article>({
  updated_at: "",
  abstract: "",
  banner_id: 0,
  banner_url: "",
  category: "",
  collects_count: 0,
  comment_count: 0,
  content: "",
  created_at: "",
  digg_count: 0,
  id: "",
  keyword: "",
  look_count: 0,
  tags: [],
  title: "",
  user_avatar: "",
  user_id: 0,
  user_nick_name: "",
  is_collection: false
})

const isDark = useDark()
const scrollElement = document.documentElement;
const blogStore = useBlogStore()
const loadingData = async () => {
  let res = await ArticleDetail(id as string)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}
const skipHandler = (location: string, gap: number) => {
  let top = document.getElementById(location)!.offsetTop - gap
  window.scrollTo({
    top: top,
    behavior: 'smooth',
  })
}
const diggHandler = async () => {
  let is_digg = !blogStore.digg.includes(data.value.id);
  let res = await ArticleDigg(data.value.id, is_digg)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  if (is_digg) {
    blogStore.digg.push(data.value.id)
    data.value.digg_count++
  } else {
    blogStore.digg.splice(blogStore.digg.indexOf(data.value.id), 1)
    data.value.digg_count--
  }
}
const collectionHandler = async () => {
  let res = await ArticleCollection(data.value.id)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  ElMessage.success(res.msg)
  if (data.value.is_collection) {
    data.value.collects_count--
  } else {
    data.value.collects_count++
  }
  data.value.is_collection = !data.value.is_collection
}

const comment_number = (add: boolean) => {
  if (add) {
    data.value.comment_count++
  } else {
    data.value.comment_count--
  }
}
provide("comment", comment_number)
onMounted(async () => {
  await loadingData()
  if (route.hash) {
    setTimeout(() => {
      let location = route.hash.substring(1)
      skipHandler(location, -800)
    }, 500)
  }
})

</script>

<template>
  <div class="blog_article">
    <div class="banner_wrapper">
      <Blog_banner
          :title="data.title"
          :slogan="data.abstract"
          :banner_url="data.banner_url"
          :is_article="true"
      />
    </div>
    <div class="article_main">
      <div class="left">
        <div class="article_head" id="head">
          <div class="title">
            <h2>{{ data.title }}</h2>
          </div>
          <div class="time">
            <span>发布于: {{ getFormatDate((data.created_at)) }}</span>
            <span>最后更新: {{ getFormatDate((data.updated_at)) }}</span>
            <span>作者: {{ data.user_nick_name }}</span>
          </div>
          <div class="tags">
            <i class="iconfont icon-tag"></i>
            <el-tag :type="index%2==0?'':'success'" v-for="(item,index) in data.tags">{{ item }}</el-tag>
          </div>
        </div>
        <el-divider border-style="dashed"/>
        <div class="article_content">
          <MdPreview
              v-model="data.content"
              :editor-id="data.id"
              :theme="isDark ? 'dark' : 'light'"
              show-code-row-number
              preview-theme="vuepress"
              code-theme="github"
          />
        </div>
        <div class="pre_next">

        </div>
        <el-divider border-style="dashed"/>
        <div class="article_comment" id="comment">
          <Blog_commentlist :id="data.id"
                            :comment_count="data.comment_count"
                            :look_count="data.look_count"
          />
        </div>
      </div>
      <div class="right">
        <div class="article_user">
          <Blog_user
              v-if="data.user_id"
              :is_article="true"
              :user_id="data.user_id"
              :look_count="data.look_count"
              :digg_count="data.digg_count"
              :comment_count="data.comment_count"
              :collection_count="data.collects_count"
          />
        </div>
        <div class="article_catalog">
          <div class="card_wrapper">
            <Blog_card title="文章目录" icon="icon-caidan">
              <MdCatalog
                  :editor-id="data.id"
                  :scrollElement="scrollElement"
                  :theme="isDark ? 'dark' : 'light'"
                  :scroll-element-offset-top="80"
                  :offset-top="100"
              />
            </Blog_card>
          </div>
          <div class="actions">
            <div :class="{'digg':true,'active':blogStore.digg.includes(data.id)}" @click="diggHandler">
              <i class="iconfont icon-dianzan1"></i>
            </div>
            <div :class="{'collection':true,'active':data.is_collection}" @click="collectionHandler">
              <i class="iconfont icon-shoucang1"></i>
            </div>
            <div class="top" @click="skipHandler('head',200)">
              <i class="iconfont icon-fanhuidingbu"></i>
            </div>
            <div class="comment" @click="skipHandler('comment',200)">
              <i class="iconfont icon-pinglun1"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_article {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .banner_wrapper {
    width: 100%;
  }

  .article_main {
    margin: 40px 0;
    width: 70%;
    display: flex;
    color: var(--text);

    .left {
      width: calc(100% - 320px);
      margin-right: 20px;
      padding: 20px;
      border-radius: 10px;
      background-color: var(--bg);
      color: var(--text);

      .article_head {
        display: flex;
        flex-direction: column;
        align-items: center;

        .time {
          font-size: 0.875rem;

          & > span {
            margin-right: 10px;

            &:last-of-type {
              margin-right: 0;
            }
          }
        }

        .tags {
          margin-top: 10px;
          display: flex;
          align-items: center;

          .el-tag {
            margin-left: 10px;
          }
        }
      }

      .article_content {
        width: 100%;
      }

      .article_comment {
        width: 100%;
      }
    }

    .right {
      width: 300px;

      .article_catalog {
        width: 100%;
        margin-top: 20px;
        position: sticky;
        top: 100px;

        .card_wrapper {
          width: 100%;
          height: 250px;
          font-weight: bold;

          :deep(.md-editor-catalog-link) {
            display: flex;
            flex-direction: column;
            justify-content: center;

            > span:hover {
              color: var(--theme);
            }
          }


        }

        .actions {
          width: 100%;
          margin-top: 20px;
          display: flex;
          justify-content: space-between;

          .active {
            color: #67C23A;
          }

          > div {
            padding: 10px 15px;
            border-radius: 5px;
            color: var(--theme);
            background-color: var(--bg);
            cursor: pointer;

            i {
              font-size: 25px;
            }
          }
        }
      }
    }
  }

  @include respond-to('notebook') {
    .article_main {
      margin-top: 40px;
      width: 85%;
      height: 100%;
      display: flex;

      .left {
        width: 70%;
        min-width: 600px;
        margin-right: 20px;
      }

      .right {
        width: 300px;
      }
    }
  }
  @include respond-to('pad') {
    .article_main {
      margin-top: 40px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;

      .left {
        width: 100%;
        min-width: 600px;
      }

      .right {
        display: none;
      }
    }
  }
  @include respond-to('phone') {
    .article_main {
      margin-top: 40px;
      width: 90%;

      .left {
        width: 100%;
        margin: 0;

        .article_head {
          .time {
            display: flex;
            flex-direction: column;

            > span {
              margin-bottom: 5px;
            }
          }
        }

        .article_content {
          width: 100%;
        }

        .article_comment {
          display: none;
        }
      }

      .right {
        display: none;
      }
    }
  }
}
</style>