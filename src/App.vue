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
  font-family: Bitter, "Noto Serif SC", SimSun, Times New Roman, Times, serif, Segoe UI Emoji, Segoe UI Symbol, Apple Color Emoji, "Noto Serif CJK SC";

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #b6b1b2;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
}
</style>
