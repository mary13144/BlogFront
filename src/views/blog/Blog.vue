<script setup lang="ts">
import Blog_nav from "@/components/blog/Blog_nav.vue";
import Blog_footer from "@/components/blog/Blog_footer.vue";
import {onMounted, ref} from "vue";
import type {SetInfo} from "@/types";
import {SetInfoQuery} from "@/api/blog";
import {ElMessage} from "element-plus";
import BacktoTop from "@/components/BacktoTop.vue";

const data = ref<SetInfo>({
  bei_an: "",
  github_url: "",
  qq_image: "",
  slogan: "",
  slogan_en: "",
  wechat_image: ""
})

const loadingData = async () => {
  let res = await SetInfoQuery()
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
  <div class="blog">
    <BacktoTop/>
    <div class="nav_wrapper">
      <Blog_nav
          :slogan="data.slogan"
          :en_slogan="data.slogan_en"
      />
    </div>
    <div class="main_wrapper">
      <router-view></router-view>
    </div>
    <div class="footer_wrapper">
      <Blog_footer
          :bei_an="data.bei_an"
          :github_url="data.github_url"
          :qq_image="data.qq_image"
          :wechat_image="data.wechat_image"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.blog {
  width: 100%;
  background-color: var(--main_bg);

  .nav_wrapper {
    width: 100%;
  }

  .main_wrapper {
    width: 100%;
    min-height: 800px;
  }

  .footer_wrapper {
    width: 100%;
  }
}

</style>