<script setup lang="ts">
import {computed, inject} from "vue";

const isDark = inject("theme").isDark
const backgroundColor = computed(() => {
	return isDark.value ? "#292E33" : "#ffffff"
})
const color = computed(() => {
	return isDark.value ? "" : "#409EFF"
})

const props = defineProps({
	icon: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	data: {
		type: Number,
		default: 0
	},
})
</script>

<template>
	<div class="dataShow">
		<div class="icon">
			<i :class="'iconfont '+icon"></i>
		</div>
		<div class="text">
			<h3 class="dataTitle">
				{{ title }}
			</h3>
			<span class="dataNumber">
          {{ data }}
      </span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.dataShow {
	width: 300px;
	height: 120px;
	background-color: v-bind(backgroundColor);
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30px;

	.icon {
		.iconfont {
			color: v-bind(color);
			font-size: 60px;
			font-weight: bold;
		}
	}

	.text {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;

		.dataTitle {
			margin: 0;
			font-size: 23px;
		}

		.dataNumber {
			font-size: 20px;
			font-weight: bold;
		}
	}
}
</style>