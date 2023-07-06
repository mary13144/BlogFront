import {createRouter, createWebHistory} from 'vue-router'
import AdminRoutes from "@/router/adminRoutes";
// @ts-ignore
import {ElMessage} from "element-plus";
import {useLoginStore} from "@/stores";
import BlogRoutes from "@/router/blogRoutes";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/login",
			name: "login",
			meta: {
				is_login: false
			},
			component: () => import("@/views/Login.vue")
		},
		...BlogRoutes,
		...AdminRoutes
	]
})

export default router
router.beforeEach((to, form, next) => {
	const loginStore = useLoginStore()
	if (to.meta.is_login && loginStore.token.user.role === 0) {
		ElMessage.warning("请登录后重新操作")
		router.push({
			name: "login"
		})
		return
	}
	if (to.meta.role == 1 && loginStore.token.user.role != 1) {
		ElMessage.warning("权限不足")
		return
	}
	next()
})