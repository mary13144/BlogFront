import {defineStore} from "pinia";
import type {Tab} from "@/types";


export const useAdminStore = defineStore("admin", {
	state: () => ({
		tabList: <Tab[]>[
			{
				title: "首页",
				name: 'home'
			},
		],
		crumbList: <string[]>[]
	}),
	getters: {},
	actions: {
		addTab(tab: Tab) {
			if (tab.title == "首页") {
				this.crumbList = []
				return;
			}
			let crumb: string[] = []
			if (tab.upper_parent) {
				crumb.push(tab.upper_parent)
			}
			if (tab.parent) {
				crumb.push(tab.parent)
			}
			crumb.push(tab.title)
			this.setCrumbs(crumb)
			if (this.tabList.findIndex((item: Tab) => (item.name == tab.name)) != -1) {
				return
			}
			if (this.tabList.length >= 10) {
				this.tabList.splice(1, 1)
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
				name: 'home',
			}]
			this.setCrumbs([])
		},
		setCrumbs(data: string[]) {
			this.crumbList = data
		}
	},
	persist: {
		storage: sessionStorage
	}
})