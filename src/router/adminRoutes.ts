import type {RouteRecordRaw} from "vue-router";


const adminRoutes: Array<RouteRecordRaw> = [
	{
		path: "/admin",
		name: "admin",
		component: () => import("@/views/admin/admin.vue"),
		children: [
			{
				path: "",
				name: "admin_default",
				redirect: "/admin/home",
			},
			{
				path: "home",
				name: "home",
				component: () => import("@/views/admin/home/home.vue")
			},
			{
				path: "user/info",
				name: "user_info",
				component: () => import("@/views/admin/user/UserInfo.vue")
			},
			{
				path: "user/article",
				name: "user_article",
				component: () => import("@/views/admin/user/UserInfo.vue")
			},
		]
	}
]


export default adminRoutes