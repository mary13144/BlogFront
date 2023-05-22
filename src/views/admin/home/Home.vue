<script setup lang="ts">
import DataSum from "@/components/admin/Admin_dataSum.vue";
import type {Home_dataSum} from "@/types";

const icons = [
  "icon-wenzhangguanli",
  "icon-yonghuliebiao",
  "icon-yonghudenglutongjigongju",
  "icon-zhucehuise"
]
const data_sum: Home_dataSum[] = [
  {
    title: "文章总数",
    data: 0
  },
  {
    title: "用户总数",
    data: 0
  },
  {
    title: "今日登陆",
    data: 0
  },
  {
    title: "今日注册",
    data: 0
  },
]
</script>

<template>
  <div class="data_display">
    <DataSum :title="item.title" :icon="icons[index]" :data="item.data" v-for="(item,index) in data_sum"></DataSum>
  </div>
</template>

<style scoped lang="scss">
.data_display {
  display: flex;
  justify-content: space-around;
}
</style>