<script setup lang="ts">
import {ArticleQuery} from "@/api/imagetext";
import {onMounted, ref, watch} from "vue";
import type {Article, Page} from "@/types";
import {ElMessage} from "element-plus";
import {getFormatDate} from "@/utils/date";
import {debounce} from "@/utils/debounce";
import {useBlogStore} from "@/stores";

const blogStore = useBlogStore()
const page = ref<Page>({
  page_num: 1,
  page_size: 4,
})
const lock = ref<boolean>(false)
const data = ref<Article[]>([])
const isloading = ref<boolean>(false)
const loadingData = async (reset: boolean) => {
  let res = await ArticleQuery(page.value, blogStore.tag, blogStore.category, false)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  if (!reset) {
    data.value.push(...res.data.list)
    if (res.data.list.length < page.value.page_size) {
      lock.value = true
    }
    return
  }
  data.value = res.data.list
}
const lay = (index) => {
  return index % 2 == 0 ? 'even' : 'odd';
}

watch(() => blogStore.tag, () => {
  loadingData(true)
})

window.addEventListener("scroll", debounce(async (numberMillis: number) => {
  // 可见区的高度
  let clientHeight = document.documentElement.clientHeight
  // 滚动的高度
  let scrollTop = document.documentElement.scrollTop
  // 整个文档的高度
  let scrollHeight = document.documentElement.scrollHeight
  if (clientHeight + scrollTop >= scrollHeight - 200) {
    if (!lock.value) {
      isloading.value = true
      setTimeout(async () => {
        page.value.page_num += 1
        await loadingData(false)
        isloading.value = false
      }, 500)
    }
  }
}, 100))
onMounted(() => {
  loadingData(false)
})
</script>

<template>
  <div class="blog_articles">
    <TransitionGroup
        enter-active-class="animate__animated animate__fadeInUp"
    >
      <div :class="'article '+lay(index)" v-for="(item,index) in data" :key="item.id+index">
        <div class="img_container">
          <el-image
              style="width: 100%;height: 100%"
              loading="lazy"
              fit="fill"
              :src="item.banner_url"
          />
        </div>
        <div class="info">
          <div class="title">
            {{ item.title }}
          </div>
          <div class="record">
            <div class="time">
              <i class="iconfont icon-date"></i>
              <span>{{ getFormatDate(item.created_at) }}</span>
            </div>
            <div class="data">
              <div class="like">
                <i class="iconfont icon-dianzan"></i>
                <span>{{ item.digg_count }}</span>
              </div>
              <div class="look">
                <i class="iconfont icon-yueduliang"></i>
                <span>{{ item.look_count }}</span>
              </div>
              <div class="comment">
                <i class="iconfont icon-pinglun"></i>
                <span>{{ item.comment_count }}</span>
              </div>
              <div class="collection">
                <i class="iconfont icon-shoucang"></i>
                <span>{{ item.collects_count }}</span>
              </div>
            </div>
          </div>
          <div class="brief">
            {{ item.abstract }}
          </div>
          <div class="category">
            <div class="classify">
              <i class="iconfont icon-a-wenjianjiawenjian"></i>
              <span>{{ item.category }}</span>
            </div>
            <div class="tag">
              <template v-for="tag_name in item.tags">
                <el-tag>{{ tag_name }}</el-tag>
              </template>
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
    <div class="loading"
         v-show="isloading"
         v-loading="isloading"
         element-loading-text="Loading..."
         element-loading-background="rgba(122, 122, 122, 0.4)"
    >
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog_articles {
  width: 100%;

  .even {
    flex-direction: row;
  }

  .odd {
    flex-direction: row-reverse;
  }

  .article {
    width: 100%;
    height: 200px;
    background-color: var(--bg);
    display: flex;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;

    .img_container {
      width: 40%;
      height: 100%;
      overflow: hidden;
      cursor: pointer;

      .el-image {
        transition: all .3s;

        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .info {
      width: 60%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      color: var(--text);
      padding: 20px;


      .title {
        font-size: 25px;
        font-weight: bold;
        cursor: pointer;
      }

      .record {
        width: 100%;
        display: flex;
        justify-content: space-between;

        i {
          margin-right: 5px;
        }

        .time {
          cursor: pointer;
        }

        .data {
          display: flex;

          > div {
            margin-right: 10px;
            cursor: pointer;

            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }

      .category {
        width: 100%;
        display: flex;
        justify-content: space-between;

        i {
          margin-right: 5px;
        }

        .classify {
          cursor: pointer;
        }

        .tag {
          display: flex;
          cursor: pointer;

          .el-tag {
            margin-right: 5px;

            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }
    }
  }

  .loading {
    width: 100%;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;
  }
}
</style>