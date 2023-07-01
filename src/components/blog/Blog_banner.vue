<script setup lang="ts">
import {GetMenuDetail} from "@/api/blog";
import {onMounted, reactive} from "vue";
import type {Banner} from "@/types";
import VueTyped from 'vue3typed/libs/typed/index.vue';
import {ElMessage} from "element-plus";

const props = defineProps<{
  height: string,
  is_article: boolean,
  id?: number,
  title?: string,
  slogan?: string,
  banner_url?: string
}>()

const data = reactive({
  title: "",
  slogan: [] as string[],
  banners_url: [] as Banner[],
  banner_time: 6,
})
const loadingData = async () => {
  let res = await GetMenuDetail(props.id as number)
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.title = res.data.slogan
  data.slogan = res.data.abstract
  data.banners_url = res.data.banners
  data.banner_time = res.data.banner_time
}

onMounted(() => {
  if (!props.is_article) {
    loadingData()
  }
})
</script>

<template>
  <div class="banner_container">
    <div class="title">
      <h1>{{ props.is_article ? props.title : data.title }}</h1>
      <div class="slogan">
        <template v-if="props.is_article">
          <p>{{ props.slogan }}</p>
        </template>
        <template v-else>
          <VueTyped
              v-if="data.slogan.length"
              :strings="data.slogan"
              :loop="true"
              :startDelay="300"
              :typeSpeed="100"
              :backSpeed="50"
          >
            <div class="typing"></div>
          </VueTyped>
        </template>
      </div>
    </div>
    <el-carousel indicator-position="none" :interval="data.banner_time*1000" :height="props.height" arrow="never">
      <template v-if="!props.is_article">
        <el-carousel-item v-for="item in data.banners_url">
          <el-image style="width: 100%;height: 100%"
                    :src="item.path"
                    :key="item.banner_id"
                    fit="fill"/>
        </el-carousel-item>
      </template>
      <template v-else>
        <el-carousel-item>
          <el-image style="width: 100%;height: 100%"
                    :src="props.banner_url"
                    fit="fill"/>
        </el-carousel-item>
      </template>
    </el-carousel>
  </div>
</template>

<style scoped lang="scss">
.banner_container {
  width: 100%;
  height: 100%;
  position: relative;

  .title {
    position: absolute;
    z-index: 99;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #FFFFFF;

    h1 {
      font-size: 30px;
      font-weight: bold;
      text-align: center;
    }

    .slogan {
      font-size: 18px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>