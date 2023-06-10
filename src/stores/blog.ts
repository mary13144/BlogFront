import {defineStore} from "pinia";

export const useBlogStore = defineStore('blog', {
	state: () => ({
		tag: "",
		category: "",
		is_show: false,
	}),
})