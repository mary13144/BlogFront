<script setup lang="ts">
import Blog_card from "@/components/blog/Blog_card.vue";
import {ref} from 'vue'

const data = ref([
  {
    id: 1,
    path: "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.23&manage_type=myprojects&projectId=4066497",
    img: "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F179362e0-6104-4a5e-a423-e4bf670f04a9%2F01863-3890217792-analog_style_chromav5_nvinkpunkextremely_detaile.jpg?table=block&id=6f06c286-fb33-4fb7-8c53-25cfdc68503a"
  },
  {
    id: 2,
    path: "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.23&manage_type=myprojects&projectId=4066497",
    img: "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F179362e0-6104-4a5e-a423-e4bf670f04a9%2F01863-3890217792-analog_style_chromav5_nvinkpunkextremely_detaile.jpg?table=block&id=6f06c286-fb33-4fb7-8c53-25cfdc68503a"
  },
  {
    id: 3,
    path: "https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.23&manage_type=myprojects&projectId=4066497",
    img: "https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F179362e0-6104-4a5e-a423-e4bf670f04a9%2F01863-3890217792-analog_style_chromav5_nvinkpunkextremely_detaile.jpg?table=block&id=6f06c286-fb33-4fb7-8c53-25cfdc68503a"
  }
])
</script>

<template>
  <Blog_card title="影视推荐" icon="icon-tuijian">
    <el-carousel trigger="click" :interval="3000" height="200px">
      <el-carousel-item v-for="item in data">
        <a :href="item.path" target="_blank" style="width: 100%;height: 100%">
          <el-image style="width: 100%;height: 100%"
                    :src="item.img"
                    :key="item.id"
                    :fit="fit"/>
        </a>

      </el-carousel-item>
    </el-carousel>
  </Blog_card>
</template>

<style scoped lang="scss">

</style>