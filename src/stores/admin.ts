import {defineStore} from "pinia";
import type {Tab} from "@/types";


export const useAdminStore = defineStore("admin", {
	state: () => ({
		tabList: <Tab[]>[
			{
				title: "首页",
				name: 'home'
			},
		]
	}),
	getters: {},
	actions: {
		addTab(tab: Tab) {
			if (this.tabList.findIndex((item: Tab) => (item.name == tab.name)) != -1) {
				return
			}
			this.tabList.push(tab)
		},
		removeTab(tab: Tab) {
			let index: number = this.tabList.findIndex((item: Tab) => {
				return item.name == tab.name;
			})
			this.tabList.splice(index, 1)
			return index
		},
		removeAll() {
			this.tabList = [{
				title: "首页",
				name: 'home'
			}]
		}
	},
	persist: {
		storage: sessionStorage
	}
})