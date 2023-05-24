import type {RouteRecordRaw} from "vue-router";


const adminRoutes: Array<RouteRecordRaw> = [
	{
		path: "/admin",
		name: "admin",
		component: () => import("@/views/admin/Admin.vue"),
		children: [
			{
				path: "",
				name: "admin_default",
				redirect: "/admin/home",
			},
			{
				path: "home",
				name: "home",
				meta: {
					index: 1
				},
				component: () => import("@/views/admin/home/Home.vue")
			},
			{
				path: "user/info",
				name: "user_info",
				meta: {
					index: 2
				},
				component: () => import("@/views/admin/user/UserInfo.vue")
			},
			{
				path: "user/article",
				name: "user_article",
				meta: {
					index: 2
				},
				component: () => import("@/views/admin/user/UserArticle.vue")
			},
			{
				path: "user/add_article",
				name: "add_article",
				meta: {
					index: 2
				},
				component: () => import("@/views/admin/user/AddArticle.vue")
			},
			{
				path: "user/collection",
				name: "user_collection",
				meta: {
					index: 2
				},
				component: () => import("@/views/admin/user/UserCollection.vue")
			},
			{
				path: "user/news",
				name: "user_news",
				meta: {
					index: 2
				},
				component: () => import("@/views/admin/user/UserNews.vue")
			},
			{
				path: "article/manage",
				name: "article_manage",
				meta: {
					index: 3
				},
				component: () => import("@/views/admin/Imagetext/ArticleManage.vue")
			},
			{
				path: "picture/manage",
				name: "picture_manage",
				meta: {
					index: 3
				},
				component: () => import("@/views/admin/Imagetext/PictureManage.vue")
			},
			{
				path: "comment/manage",
				name: "comment_manage",
				meta: {
					index: 3
				},
				component: () => import("@/views/admin/Imagetext/CommentManage.vue")
			},
			{
				path: "consumer/list",
				name: "consumer_list",
				meta: {
					index: 4
				},
				component: () => import("@/views/admin/consumer/ConsumerList.vue")
			},
			{
				path: "consumer/news",
				name: "consumer_news",
				meta: {
					index: 4
				},
				component: () => import("@/views/admin/consumer/CnsumerNews.vue")
			},
			{
				path: "system/menu",
				name: "system_menu",
				meta: {
					index: 5
				},
				component: () => import("@/views/admin/system/SystemMenu.vue")
			},
			{
				path: "video/recommend",
				name: "video_recommend",
				meta: {
					index: 5
				},
				component: () => import("@/views/admin/system/VideoRecommend.vue")
			},
			{
				path: "system/log",
				name: "system_log",
				meta: {
					index: 5
				},
				component: () => import("@/views/admin/system/SystemLog.vue")
			},
			{
				path: "system/setting",
				name: "system_setting",
				meta: {
					index: 5
				},
				component: () => import("@/views/admin/system/SystemSetting.vue")
			},
		]
	}
]


export default adminRoutes