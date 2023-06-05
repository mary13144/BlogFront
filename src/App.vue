<script setup lang="ts">
import {ElConfigProvider} from 'element-plus'
import {useLoginStore} from "@/stores";

const zIndex = 3000
const size = 'small'
let loginStore = useLoginStore()
loginStore.loading()

</script>

<template>
  <el-config-provider :size="size" :z-index="zIndex">
    <router-view/>
  </el-config-provider>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
</style>
