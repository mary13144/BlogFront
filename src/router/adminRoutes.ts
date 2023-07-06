import type {RouteRecordRaw} from "vue-router";


const adminRoutes: Array<RouteRecordRaw> = [
	{
		path: "/admin",
		name: "admin",
		meta: {
			is_login: true,
			keep_alive: false,
			role: 0
		},
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
					index: 1,
					keep_alive: false,
					role: 0
				},
				component: () => import("@/views/admin/home/Home.vue")
			},
			{
				path: "user",
				name: "user",
				redirect: "/admin/user/info",
				children: [
					{
						path: "info",
						name: "user_info",
						meta: {
							index: 2,
							open: ['2'],
							keep_alive: false,
							role: 0
						},
						component: () => import("@/views/admin/user/UserInfo.vue")
					},
					{
						path: "article",
						name: "user_article",
						meta: {
							index: 2,
							open: ['2'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/user/UserArticle.vue")
					},
					{
						path: "add_article",
						name: "add_article",
						meta: {
							index: 2,
							open: ['2'],
							keep_alive: true,
							role: 1
						},
						component: () => import("@/views/admin/user/AddArticle.vue")
					},
					{
						path: "collection",
						name: "user_collection",
						meta: {
							index: 2,
							open: ['2'],
							keep_alive: false,
							role: 0
						},
						component: () => import("@/views/admin/user/UserCollection.vue")
					},
					{
						path: "news",
						name: "user_news",
						meta: {
							index: 2,
							open: ['2'],
							keep_alive: false,
							role: 0,
						},
						component: () => import("@/views/admin/user/UserNews.vue")
					},
				]
			},
			{
				path: "article",
				name: "article",
				redirect: "/admin/article/manage",
				children: [
					{
						path: "manage",
						name: "article_manage",
						meta: {
							index: 3,
							open: ['3'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/Imagetext/ArticleManage.vue")
					},
					{
						path: "editor/:id",
						name: "article_editor",
						meta: {
							index: 3,
							open: ['3'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/Imagetext/ArticleEditor.vue")
					},
					{
						path: "picture",
						name: "picture_manage",
						meta: {
							index: 3,
							open: ['3'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/Imagetext/PictureManage.vue")
					},
					{
						path: "comment",
						name: "comment_manage",
						meta: {
							index: 3,
							open: ['3'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/Imagetext/CommentManage.vue")
					},
				]
			},
			{
				path: "consumer",
				name: "consumer",
				redirect: "/admin/consumer/list",
				children: [
					{
						path: "list",
						name: "consumer_list",
						meta: {
							index: 4,
							open: ['4'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/consumer/ConsumerList.vue")
					},
					{
						path: "news",
						name: "consumer_news",
						meta: {
							index: 4,
							open: ['4'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/consumer/CnsumerNews.vue")
					},
				]
			},
			{
				path: "system",
				name: "system",
				redirect: "/admin/system/menu",
				children: [
					{
						path: "menu",
						name: "system_menu",
						meta: {
							index: 5,
							open: ['5'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/system/SystemMenu.vue")
					},
					{
						path: "recommend",
						name: "video_recommend",
						meta: {
							index: 5,
							open: ['5'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/system/VideoRecommend.vue")
					},
					{
						path: "log",
						name: "system_log",
						meta: {
							index: 5,
							open: ['5'],
							keep_alive: false,
							role: 1
						},
						component: () => import("@/views/admin/system/SystemLog.vue")
					},
					{
						path: "setting",
						name: "setting",
						redirect: "/admin/system/setting/web",
						children: [
							{
								path: "web",
								name: "system_web",
								meta: {
									index: "5-4",
									open: ['5', '5-4'],
									keep_alive: false,
									role: 1
								},
								component: () => import("@/views/admin/system/setting/SystemSetting.vue")
							},
							{
								path: "email",
								name: "system_email",
								meta: {
									index: "5-4",
									open: ['5', '5-4'],
									keep_alive: false,
									role: 1
								},
								component: () => import("@/views/admin/system/setting/SystemEmail.vue")
							},
							{
								path: "upload",
								name: "system_upload",
								meta: {
									index: "5-4",
									open: ['5', '5-4'],
									keep_alive: false,
									role: 1
								},
								component: () => import("@/views/admin/system/setting/SystemUpload.vue")
							},
							{
								path: "other",
								name: "system_other",
								meta: {
									index: "5-4",
									open: ['5', '5-4'],
									keep_alive: false,
									role: 1
								},
								component: () => import("@/views/admin/system/setting/SystemOther.vue")
							},
						]

					},
				]
			},

		]
	}
]

export default adminRoutes

