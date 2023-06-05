<script setup lang="ts">
import Week_inner from "@/components/echarts/Week_inner.vue";
import {WeekQuery} from "@/api/home";
import {ElMessage} from "element-plus";
import {onBeforeMount, ref, watch} from "vue";
import type {WeekDate} from "@/types";
import {useDark} from "@vueuse/core";

const isDark = useDark()
const isShow = ref(true)
const weekDate = ref<WeekDate>({
  date_list: [],
  login_data: [],
  sign_data: []
})

watch(isDark, () => {
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  })
})
const loadingData = async () => {
  let res = await WeekQuery()
  if (res.code) {
    ElMessage.error(res.msg)
    return
  }
  weekDate.value = res.data
}
onBeforeMount(() => {
  loadingData()
})
</script>

<template>
  <Week_inner v-if="isShow&&weekDate.date_list.length>0" :data="weekDate" :height="190" :theme="!isDark"></Week_inner>
</template>

<style scoped lang="scss">

</style>