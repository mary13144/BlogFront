<script setup lang="ts">
import {useDark, useToggle} from "@vueuse/core";

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <i v-if="isDark" class="iconfont icon-yueliang" @click="toggleDark()"></i>
  <i v-else class="iconfont icon-taiyang" @click="toggleDark()"></i>
</template>

<style scoped lang="scss">
i {
  cursor: pointer;
  color: var(--icon);

  &:hover {
    color: var(--theme);
  }
}
</style>