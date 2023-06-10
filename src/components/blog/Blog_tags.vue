<script setup lang="ts">
import Blog_card from "@/components/blog/Blog_card.vue";
import {onMounted, ref} from "vue";
import {useDark} from "@vueuse/core";
import {ArticleTags} from "@/api/imagetext";
import type {Tag} from "@/types";
import {useBlogStore} from "@/stores";

const isDark = useDark()
const data = ref<Tag[]>([])
const blogStore = useBlogStore()
const loadingData = async () => {
  let res = await ArticleTags()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}
const tagHandler = (tag: string) => {
  if (blogStore.tag != tag) {
    blogStore.tag = tag
  } else {
    blogStore.tag = ""
  }
  blogStore.page.page_num = 1
}
onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="blog_tags">
    <Blog_card title="标签" icon="icon-tag">
      <ul class="tags">
        <li @click="tagHandler(item.tag)" v-for="item in data">
          <el-badge :value="item.count" :type="!isDark?'primary':'success'">
            <div class="tag_name">{{ item.tag }}</div>
          </el-badge>
        </li>
      </ul>
    </Blog_card>
  </div>
</template>

<style scoped lang="scss">
@keyframes move_box {
  $base_color: #409EFF;
  0% {
    left: 0;
    top: 0;
    background-color: $base_color;
  }
  25% {
    left: calc(100% - 20px);
    top: 0;
    background-color: lighten($base_color, 10);
  }
  50% {
    top: calc(100% - 20px);
    left: calc(100% - 20px);
    background-color: lighten($base_color, 20);
  }
  75% {
    left: 0;
    top: calc(100% - 20px);
    background-color: lighten($base_color, 30);
  }
  to {
    left: 0;
    top: 0;
    background-color: lighten($base_color, 40);
  }
}

.blog_tags {
  width: 100%;

  :deep(.blog_card .body) {
    position: relative;

    &::before {
      display: block;
      position: absolute;
      content: "";
      width: 20px;
      height: 20px;
      animation-name: move_box;
      animation-duration: 10s;
      animation-iteration-count: infinite;
    }
  }

  .tags {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 5px;
    margin: 0;

    li {
      list-style: none;
      width: 33.3%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 0;
      cursor: pointer;

      .tag_name {
        color: var(--text);
        padding: 5px 10px;
      }

      &:nth-child(6n+1), &:nth-child(6n+2), &:nth-child(6n+3) {
        background-color: var(--li_3);
      }

      &:hover {
        background-color: var(--theme);
      }
    }
  }
}
</style>