<script setup lang="ts">
import Calendar_inner from "@/components/echarts/Calendar_inner.vue";
import {onBeforeMount, ref, watch} from "vue";
import type {CalenderDate} from "@/types";
import {ArticleCalendar} from "@/api/home";
import {ElMessage} from "element-plus";
import {useDark} from "@vueuse/core";

const props = defineProps<{
  isTitle: boolean
}>()
const data = ref<CalenderDate[]>([])
const height = ref<number>(190)
const isDark = useDark()
const isShow = ref(true)
const loadingData = async () => {
  let res = await ArticleCalendar()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  data.value = res.data
}

watch(isDark, () => {
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  })
})

onBeforeMount(() => {
  loadingData()
  if (!props.isTitle) {
    height.value = 150
  }
})
</script>

<template>
  <Calendar_inner v-if="isShow&&data.length>0" :data="data" :height="height" :theme="!isDark"
                  :is-title="props.isTitle"/>
</template>

<style scoped lang="scss">

</style>