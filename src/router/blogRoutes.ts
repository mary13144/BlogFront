import type {RouteRecordRaw} from "vue-router";


const BlogRoutes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "blog",
		component: () => import("@/views/blog/Blog.vue"),
		redirect: "/home",
		children: [
			{
				path: "home",
				name: "blog_home",
				component: () => import("@/views/blog/Blog_home.vue"),
			},
			{
				path: "search",
				name: "search",
				component: () => import("@/views/blog/Blog_search.vue"),
			},
			{
				path: "article/:id",
				name: "article_detail",
				component: () => import("@/views/blog/Blog_article.vue"),
			},
		],
	}
]

export default BlogRoutes