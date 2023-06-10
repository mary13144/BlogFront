<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useBlogStore} from "@/stores";
import Blog_user from "@/components/blog/Blog_user.vue";
import type {Article, Page, Select} from "@/types";
import {ArticleQuery, ArticleQueryCategory} from "@/api/imagetext";
import {ElMessage} from "element-plus";
import {getFormatDate} from "@/utils/date";
//响应式变量----------------------------------------------------------------------------
const page = ref<Page>({
  page_num: 1,
  page_size: 8,
})
const total = ref<number>(0)
const key = ref<string>("")
const data = ref<Article[]>([])
const categorys = ref<Select[]>([])
const categoryIndex = ref<number>(-1)
const actions = [
  {
    label: "最新发布",
    value: "created_at desc"
  },
  {
    label: "最早发布",
    value: "created_at asc"
  },
  {
    label: "最多浏览",
    value: "look_count desc"
  },
  {
    label: "最多点赞",
    value: "digg_count desc"
  },
  {
    label: "最多评论",
    value: "comment_count desc"
  },
  {
    label: "最多收藏",
    value: "collects_count desc"
  },
]
const actionIndex = ref<number>(0)
const blogStore = useBlogStore()
//函数----------------------------------------------------------------------------
const loadingData = async () => {
  let res = await ArticleQuery(page.value, blogStore.tag, blogStore.category, false)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data.list
  total.value = res.data.count
}
const loadingCategory = async () => {
  let res = await ArticleQueryCategory()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  categorys.value = res.data
}

const actionHandler = (sort: string, index: number) => {
  page.value.sort = sort
  actionIndex.value = index
}
const categoryHandler = (category: string, index: number) => {
  blogStore.category = category
  categoryIndex.value = index
}
watch(page.value, () => {
  loadingData()
})
watch(() => blogStore.category, () => {
  loadingData()
})
onMounted(() => {
  blogStore.is_show = true
  loadingData()
  loadingCategory()
})
onUnmounted(() => {
  blogStore.is_show = false
})
</script>

<template>
  <div class="blog_search">
    <div class="search_main">
      <div class="left">
        <div class="search">
          <input placeholder="搜索文章" v-model="key" @keydown.enter="page.keyword = key" class="search_input"
                 type="text">
          <div class="icon" @click="page.keyword = key">
            <i class="iconfont icon-sousuo"></i>
          </div>
        </div>
        <el-divider border-style="dashed"/>
        <div class="action">
          <span :class="{active:index == actionIndex}"
                v-for="(item,index) in actions"
                @click="actionHandler(item.value,index)"
          >{{ item.label }}</span>
        </div>
        <div class="category">
          <span :class="{active:categoryIndex == -1}" @click="categoryHandler('',-1)">全部分类</span>
          <span
              :class="{active:index == categoryIndex}"
              v-for="(item,index) in categorys"
              @click="categoryHandler(item.value,index)"
          >{{ item.label }}</span>
        </div>
        <el-divider border-style="dashed"/>
        <template v-if="data.length!=0">
          <div class="result">
            <div class="result_item" v-for="item in data" :key="item.id">
              <div class="img_container">
                <img :src="item.banner_url" loading="lazy" alt="封面">
              </div>
              <div class="article_info">
                <span class="title" v-html="item.title"></span>
                <div class="info">
                  <div class="look">
                    <span v-if="page.sort=='digg_count desc'">
                      <i class="iconfont icon-dianzan"></i>
                      {{ item.digg_count }}
                    </span>
                    <span v-else-if="page.sort=='comment_count desc'">
                      <i class="iconfont icon-pinglun"></i>
                      {{ item.comment_count }}
                    </span>
                    <span v-else-if="page.sort=='collects_count desc'">
                      <i class="iconfont icon-shoucang"></i>
                      {{ item.collects_count }}
                    </span>
                    <span v-else>
                      <i class="iconfont icon-yueduliang"></i>
                      {{ item.look_count }}
                    </span>
                  </div>
                  <div class="time">
                    {{ getFormatDate(item.created_at) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <el-empty/>
        </template>
        <div class="page_wrapper">
          <el-pagination
              hide-on-single-page
              :page-size="page.page_size"
              :current-page="page.page_num"
              @current-change="(value: number) => page.page_num = value"
              layout="total,prev, pager, next"
              :total="total"
          />
        </div>
      </div>
      <div class="right">
        <div class="right_item">
          <Blog_user :is_article="false"/>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.blog_search {
  width: 100%;
  height: 100%;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .search_main {
    margin-top: 40px;
    width: 70%;
    height: 100%;
    display: flex;
    color: var(--text);

    .left {
      width: calc(100% - 370px);
      min-width: 700px;
      height: 100%;
      margin-right: 20px;
      padding: 20px;
      color: var(--text);

      & > div {
        margin-bottom: 20px;
      }

      .search {
        width: 100%;
        position: relative;

        .search_input {
          width: 100%;
          border: none;
          border-radius: 5px;
          outline: 2px solid transparent;
          outline-offset: 2px;
          padding: 0 1.5rem;
          font-size: 0.875rem;
          font-weight: 300;
          line-height: 2.5rem;
          background-color: var(--main_bg);
          color: var(--text);

          &:focus, &:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
          }
        }

        .icon {
          position: absolute;
          right: 3%;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;

          &:hover {
            color: var(--theme);
          }

          i {
            font-size: 20px;
            font-weight: bold;
          }
        }
      }

      .action {
        width: 100%;
        font-size: 0.875rem;
        font-weight: bold;
        color: var(--text_light);

        & > span {
          height: 25px;
          padding: 3px 6px;
          margin-right: 20px;
          border-radius: 5px;
          cursor: pointer;

          &:last-of-type {
            margin-right: 0;
          }

          &.active {
            color: #FFFFFF;
            background-color: var(--theme);
          }
        }

      }

      .category {
        width: 100%;
        font-size: 0.875rem;
        font-weight: bold;
        color: var(--text_light);

        & > span {
          height: 25px;
          padding: 3px 6px;
          margin-right: 20px;
          border-radius: 5px;
          cursor: pointer;

          &:last-of-type {
            margin-right: 0;
          }

          &.active {
            color: #FFFFFF;
            background-color: var(--theme);
          }
        }
      }

      .result {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-row-gap: 20px;
        grid-column-gap: 20px;

        .result_item {
          height: 185px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 5px;
          cursor: pointer;
          transition: all .5s;

          &:hover {
            transform: translateY(-10px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.5);

            img {
              transform: scale(1.1);
            }
          }

          .img_container {
            width: 100%;
            height: 100px;
            overflow: hidden;

            img {
              object-fit: fill;
              width: 100%;
              height: 100%;
              transition: all .5s;
            }
          }

          .article_info {
            height: 85px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            background-color: var(--bg);
            color: var(--text);

            .title {
              font-size: 0.95rem;
              font-weight: bold;

              :deep(em) {
                color: red;
                margin-right: 3px;
              }
            }

            .info {
              font-size: 0.85rem;
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
          }
        }
      }

      .page_wrapper {
        display: flex;
        justify-content: center;
      }
    }

    .right {
      width: 300px;
      height: 100%;
    }
  }

  @include respond-to('notebook') {
    .search_main {
      margin-top: 40px;
      width: 85%;
      height: 100%;
      display: flex;

      .left {
        width: 70%;
        min-width: 600px;
        height: 100%;
        margin-right: 20px;

        .result {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-row-gap: 20px;
          grid-column-gap: 20px;
        }
      }

      .right {
        width: 300px;
        height: 100%;

        .right_item {
          width: 100%;
          margin-bottom: 20px;
        }
      }
    }
  }
  @include respond-to('pad') {
    .search_main {
      margin-top: 40px;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;

      .left {
        width: 100%;
        min-width: 600px;

        .result {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-row-gap: 20px;
          grid-column-gap: 20px;
        }
      }

      .right {
        display: none;
      }
    }
  }
  @include respond-to('phone') {
    .right {
      display: none;
    }
  }
}
</style>