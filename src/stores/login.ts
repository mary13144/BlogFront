import {defineStore} from "pinia";
import type {Token, UserToken} from "@/types";
// @ts-ignore
import {ElMessage} from "element-plus";
import AES from "@/utils/AES";
import {useAdminStore} from "@/stores/admin";


export const useLoginStore = defineStore('login', {
	state: () => ({
		token: {
			user: {
				user_id: 0,
				nick_name: "",
				avatar: "",
				role: 0, //0 为未登录
			} as UserToken,
			exp: 0,
			iss: "",
		} as Token
	}),
	actions: {
		setting(token: Token) {
			this.token = token
			localStorage.setItem("tokenInfo", AES.encrypt(JSON.stringify(token), ""))
		},
		loading() {
			let info = localStorage.getItem("tokenInfo")
			if (info == null) {
				return
			}
			let tokenInfo: Token = JSON.parse(AES.decrypt(info, ""))
			//计算token是否过期
			if (tokenInfo.exp - Date.now() <= 0) {
				ElMessage.warning("token已失效")
				localStorage.removeItem("tokenInfo")
				localStorage.removeItem("token")
				return
			}
			this.token = tokenInfo
			return
		},
		clear() {
			const adminStore = useAdminStore()
			this.token = {
				user: {
					user_id: 0,
					nick_name: "",
					avatar: "",
					role: 0,
				} as UserToken,
				exp: 0,
				iss: "",
			}
			adminStore.removeAll()
			adminStore.setCrumbs([])
			localStorage.removeItem("token")
			localStorage.removeItem("tokenInfo")
		}
	}
})