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
				component: () => import("@/views/admin/home/Home.vue")
			},
			{
				path: "user/info",
				name: "user_info",
				component: () => import("@/views/admin/user/UserInfo.vue")
			},
			{
				path: "user/article",
				name: "user_article",
				component: () => import("@/views/admin/user/UserArticle.vue")
			},
			{
				path: "user/add_article",
				name: "add_article",
				component: () => import("@/views/admin/user/AddArticle.vue")
			},
			{
				path: "user/collection",
				name: "user_collection",
				component: () => import("@/views/admin/user/UserCollection.vue")
			},
			{
				path: "user/news",
				name: "user_news",
				component: () => import("@/views/admin/user/UserNews.vue")
			},
			{
				path: "article/manage",
				name: "article_manage",
				component: () => import("@/views/admin/Imagetext/ArticleManage.vue")
			},
			{
				path: "picture/manage",
				name: "picture_manage",
				component: () => import("@/views/admin/Imagetext/PictureManage.vue")
			},
			{
				path: "comment/manage",
				name: "comment_manage",
				component: () => import("@/views/admin/Imagetext/CommentManage.vue")
			},
			{
				path: "consumer/list",
				name: "consumer_list",
				component: () => import("@/views/admin/consumer/ConsumerList.vue")
			},
			{
				path: "consumer/news",
				name: "consumer_news",
				component: () => import("@/views/admin/consumer/CnsumerNews.vue")
			},
			{
				path: "system/menu",
				name: "system_menu",
				component: () => import("@/views/admin/system/SystemMenu.vue")
			},
			{
				path: "video/recommend",
				name: "video_recommend",
				component: () => import("@/views/admin/system/VideoRecommend.vue")
			},
			{
				path: "system/log",
				name: "system_log",
				component: () => import("@/views/admin/system/SystemLog.vue")
			},
			{
				path: "system/setting",
				name: "system_setting",
				component: () => import("@/views/admin/system/SystemSetting.vue")
			},
		]
	}
]


export default adminRoutes