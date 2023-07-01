import {defineStore} from "pinia";

export const useBlogStore = defineStore('blog', {
	state: () => ({
		tag: "",
		category: "",
		is_show: false,
		digg: [] as string[],
		comment_digg: [] as number[]
	}),
	persist: {
		paths: ['digg', 'comment_digg']
	}
})