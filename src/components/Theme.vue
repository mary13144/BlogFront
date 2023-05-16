<script setup lang="ts">
import {inject} from "vue";

const isDark = inject("theme").isDark
const toggleDark = inject("theme").toggleDark
</script>

<template>
	<i v-if="isDark" class="iconfont icon-yueliang" @click="toggleDark()"></i>
	<i v-else class="iconfont icon-taiyang" @click="toggleDark()"></i>
</template>

<style scoped lang="scss">
i {
	cursor: pointer;

	&:hover {
		color: $mainColor;
	}
}
</style>