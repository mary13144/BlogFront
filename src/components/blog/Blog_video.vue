<script setup lang="ts">
import Blog_card from "@/components/blog/Blog_card.vue";
import {onMounted, ref} from 'vue'
import {VideoRecommend} from "@/api/blog";
import type {Video} from "@/types";
//@ts-ignore
import {ElMessage} from "element-plus";

const data = ref<Video[]>([])
const loadingData = async () => {
  let res = await VideoRecommend()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}

onMounted(() => {
  loadingData()
})
</script>

<template>
  <div class="blog_video">
    <Blog_card title="影视推荐" icon="icon-tuijian">
      <template v-if="data.length>0">
        <el-carousel trigger="click" :interval="3000" height="200px">
          <el-carousel-item v-for="item in data">
            <a :href="item.href" target="_blank" style="width: 100%;height: 100%">
              <el-image style="width: 100%;height: 100%"
                        :src="item.path"
                        :key="item.id"
                        fit="fill"
              />
            </a>
          </el-carousel-item>
        </el-carousel>
      </template>
      <template v-else>
        <el-empty/>
      </template>
    </Blog_card>
  </div>

</template>

<style scoped lang="scss">
.blog_video {
  width: 100%;

  :deep(.el-empty) {
    padding: 0;
  }
}
</style>