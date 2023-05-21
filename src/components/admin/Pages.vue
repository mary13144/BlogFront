<script setup lang="ts">
import {computed} from "vue";
import type {Page} from "@/types";

const props = defineProps<{
  total: number,
  page: Page,
}>()

const emits = defineEmits(["loadingData"])
const isHidden = computed(() => {
  return props.total / props.page.page_size <= 1
})

const pageChange = (value: number) => {
  props.page.page_num = value
  emits("loadingData")
}
</script>

<template>
  <div class="pages_wrapper">
    <el-pagination
        :current-page="page.page_num"
        :hide-on-single-page="isHidden"
        :page-size="props.page.page_size"
        layout="prev, pager, next"
        :total="props.total"
        @next-click="pageChange"
        @prev-click="pageChange"
        @current-change="pageChange"
    />
  </div>
</template>

<style scoped lang="scss">
.pages_wrapper {
  display: flex;
  justify-content: center;
}
</style>