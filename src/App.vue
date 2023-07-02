<script setup lang="ts">
//@ts-ignore
import {ElConfigProvider} from 'element-plus'
import {useLoginStore} from "@/stores";

let loginStore = useLoginStore()
loginStore.loading()

</script>

<template>
  <ElConfigProvider :size="'small'" :z-index="3000">
    <router-view/>
  </ElConfigProvider>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  font-family: Bitter, "Noto Serif SC", SimSun, Times New Roman, Times, serif, Segoe UI Emoji, Segoe UI Symbol, Apple Color Emoji, "Noto Serif CJK SC";

  em {
    color: red;
    font-weight: bold;
    font-style: normal;
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #b6b1b2;
  }

  &::-webkit-scrollbar-button {
    background-color: transparent;
  }
}
</style>
